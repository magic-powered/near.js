import { ProviderError } from '@near.js/provider-core';

export type RPCErrorCauseObject = {
  info: any; // TODO
  name: string; // TODO enum
}

export type RPCErrorObject = {
  name: string; // TODO enum
  cause: RPCErrorCauseObject;
  code: number;
  message: string;
  data: string;
};

export class UnknownError extends ProviderError {
  private readonly errorData: unknown;

  constructor(errorData: unknown) {
    super(`Unexpected error happened: ${JSON.stringify(errorData)}`);
    this.errorData = errorData;
  }

  getErrorData() {
    return this.errorData;
  }
}

export class RPCError extends ProviderError {
  private readonly errorObject: RPCErrorObject;

  constructor(errorObject: RPCErrorObject) {
    const message = `${errorObject.code}: ${errorObject.name}/${errorObject.cause.name} - ${errorObject.message}: ${errorObject.data}`;
    super(message);
    this.errorObject = errorObject;
  }

  public getRawJson() {
    return this.errorObject;
  }

  public getCause() {
    return this.errorObject.cause;
  }

  public getCauseName() {
    return this.errorObject.cause.name;
  }

  public getCode() {
    this.errorObject.code;
  }

  public getName() {
    this.errorObject.name;
  }
}
