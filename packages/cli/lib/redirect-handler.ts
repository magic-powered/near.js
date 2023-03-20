import * as net from 'net';
import * as http from 'http';
import * as url from 'url';

export const DEFAULT_PORT = 4000;
export const MAX_PORT = 4020;

export class RedirectHandler {
  private readonly expectedFields: string[];

  private readonly successWebPage: string;

  private readonly fetchedParameters: Map<string, string | string[]>;

  private readonly server: http.Server;

  private redirectUrl: string;

  private handlerUrl: string;

  private expired: boolean;

  constructor(expectedFields: string[], successWebPage = 'You may close this window now.') {
    this.expectedFields = expectedFields;
    this.successWebPage = successWebPage;
    this.fetchedParameters = new Map<string, string | string[]>();
    this.expired = false;
    this.server = http.createServer(this.handler.bind(this));
    this.redirectUrl = `http://127.0.0.1:${DEFAULT_PORT}`;
    this.handlerUrl = `http://127.0.0.1:${DEFAULT_PORT}`;
  }

  public setRedirectUrl(redirectUrl: string) {
    this.redirectUrl = redirectUrl;
  }

  public async start() {
    if (this.expired) {
      throw new Error('Redirect handler is expired.');
    }

    const port = await this.findFreePort();

    this.handlerUrl = `http://127.0.0.1:${port}`;

    this.server.listen(port, '127.0.0.1');
  }

  public async stop() {
    if (this.expired) {
      return;
    }

    this.server.closeAllConnections();
    this.server.close();
  }

  public listenForRedirectParams(): Promise<Map<string, string | string[]>> {
    return new Promise((resolve, reject) => {
      if (this.expired) {
        reject(new Error('Redirect handler is expired.'));
        return;
      }

      this.server.on('close', () => {
        if (!this.fetchedParameters.size) {
          return reject(new Error('Failed to fetch auth session'));
        }

        this.expired = true;

        return resolve(this.fetchedParameters);
      });
    });
  }

  public getHandlerUrl() {
    return this.handlerUrl;
  }

  private resolveListener(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.closeAllConnections();
      this.server.close((err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  private findFreePort(port: number = DEFAULT_PORT): Promise<number> {
    return new Promise((resolve, reject) => {
      if (port > MAX_PORT) {
        reject(new Error(`Cannot find free port in a range ${DEFAULT_PORT} ${MAX_PORT}`));
        return;
      }
      const connection = net.createConnection({
        port,
        host: '127.0.0.1',
      });
      connection.on('connect', () => {
        connection.end();
        resolve(port);
      });
      connection.on('error', async () => {
        connection.end();
        resolve(await this.findFreePort(port + 1));
      });
    });
  }

  private handler(request: http.IncomingMessage, response: http.ServerResponse) {
    const throwError = async (err: Error | undefined) => {
      console.error(err);
      await this.resolveListener();
    };

    const parsedUrl = url.parse(request.url as string, true);

    if (!Object.keys(parsedUrl.query).length) {
      response.writeHead(302, { Location: this.redirectUrl });
      response.end();
      return;
    }

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.end(this.successWebPage, () => {
      this.expectedFields.forEach((field) => {
        const value = parsedUrl.query[field];
        if (!value) {
          return;
        }
        this.fetchedParameters.set(field, value);
      });

      this.resolveListener().catch(throwError);
    });
  }
}
