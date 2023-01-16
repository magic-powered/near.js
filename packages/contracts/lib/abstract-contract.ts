/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { NearRPCProvider, CallViewFunction } from '@nearjs/provider-core';
import { FunctionCall } from '@nearjs/tx';

export abstract class Contract {
  private readonly provider: NearRPCProvider<any>;

  private readonly contractAccountId: string;

  private signerAccountId?: string;

  constructor(
    contractAccountId: string,
    provider: NearRPCProvider<any>,
    signerAccountId?: string,
  ) {
    this.contractAccountId = contractAccountId;
    this.provider = provider;
    this.signerAccountId = signerAccountId;
  }

  public async setSignerAccountId(signerAccountId: string) {
    if (!(await this.provider.isAccountConnected(signerAccountId))) {
      throw new Error(
        `account ${signerAccountId} is not connected to the provider.`
          + `Please authorize ${signerAccountId} with near provider`,
      );
    }
    this.signerAccountId = signerAccountId;
  }

  protected async call(
    methodName: string,
    args: { [key: string]: any },
    gas: number,
    deposit: string,
  ) {
    if (!this.signerAccountId) {
      const connectedAccounts = await this.provider.listConnectedAccounts();
      if (connectedAccounts.length === 1) {
        [this.signerAccountId] = connectedAccounts;
      } else {
        if (!connectedAccounts.length) {
          throw new Error(
            'No Near accounts connected. '
              + 'Please connect at least one account ot call the contract functions',
          );
        }
        throw new Error(
          'Signer account id ambiguous. Please choose one from connected',
        );
      }
    }

    return this.provider.sendTransactionSync(
      this.signerAccountId,
      this.contractAccountId,
      [new FunctionCall(methodName, args, gas, deposit)],
    );
  }

  protected async callView(
    methodName: string,
    args: { [key: string]: any },
  ): CallViewFunction {
    return this.provider.sendViewCall(this.contractAccountId, methodName, args);
  }
}
