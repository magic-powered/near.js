import BN from 'bn.js';
import {
  field, option, variant, vec,
} from '@dao-xyz/borsh';

export abstract class AccessKeyPermission {}

@variant(0)
export class FullAccess extends AccessKeyPermission {

}

@variant(1)
export class FunctionCallPermission {
  /// Allowance is a balance limit to use by this access key to pay for function call gas and
  /// transaction fees. When this access key is used, both account balance and the allowance is
  /// decreased by the same value.
  /// `None` means unlimited allowance.
  /// NOTE: To change or increase the allowance, the old access key needs to be deleted and a new
  /// access key should be created.
  @field({ type: option('u128') })
    allowance?: BN;

  /// The access key only allows transactions with the given receiver's account id.
  @field({ type: 'string' })
    receiver_id: string;

  /// A list of method names that can be used. The access key only allows transactions with the
  /// function call of one of the given method names.
  /// Empty list means any method name can be used.
  @field({ type: vec('string') })
    method_names: string[];
}

export const serializeAccessKeyPermission = (accessKeyPermission: AccessKeyPermission): string => {
  let accessKeyString = '';
  if (accessKeyPermission instanceof FunctionCallPermission) {
    accessKeyString = JSON.stringify({
      type: FunctionCallPermission.name,
      allowance: accessKeyPermission.allowance,
      receiverId: accessKeyPermission.receiver_id,
      methodNames: accessKeyPermission.method_names,
    });
  } else {
    accessKeyString = JSON.stringify({
      type: FullAccess.name,
    });
  }

  return Buffer.from(accessKeyString).toString('base64');
};

export const deserializePermission = (
  serializedAccessKeyPermission: string,
): AccessKeyPermission => {
  const obj = JSON.parse(Buffer.from(serializedAccessKeyPermission, 'base64').toString());

  if (obj.type === FunctionCallPermission.name) {
    const functionCallPermission = new FunctionCallPermission();
    functionCallPermission.method_names = obj.methodNames;
    functionCallPermission.receiver_id = obj.receiverId;
    functionCallPermission.allowance = obj.allowance;

    return functionCallPermission;
  }

  if (obj.type === FullAccess.name) {
    return new FullAccess();
  }

  throw new Error(`Invalid Access Key Permission${serializedAccessKeyPermission}`);
};

export class AccessKey {
  /// The nonce for this access key.
  /// NOTE: In some cases the access key needs to be recreated. If the new access key reuses the
  /// same public key, the nonce of the new access key should be equal to the nonce of the old
  /// access key. It's required to avoid replaying old transactions again.
  @field({ type: 'u64' })
  public nonce: number;

  /// Defines permissions for this access key.
  @field({ type: AccessKeyPermission })
  readonly permission: AccessKeyPermission;

  constructor(nonce: number, permission: AccessKeyPermission) {
    this.nonce = nonce;
    this.permission = permission;
  }

  public getAndIncrementNonce() {
    this.nonce += 1;
    return this.nonce;
  }

  public setNonce(newNonce: number) {
    this.nonce = newNonce;
  }

  public toString() {
    return Buffer.from(
      JSON.stringify({
        nonce: this.nonce,
        permission: serializeAccessKeyPermission(this.permission),
      }),
    ).toString('base64');
  }

  public static fromString(accessKey: string): AccessKey {
    const obj = JSON.parse(Buffer.from(accessKey, 'base64').toString());

    return new AccessKey(obj.nonce, deserializePermission(obj.permission));
  }
}
