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

export class AccessKey {
  /// The nonce for this access key.
  /// NOTE: In some cases the access key needs to be recreated. If the new access key reuses the
  /// same public key, the nonce of the new access key should be equal to the nonce of the old
  /// access key. It's required to avoid replaying old transactions again.
  @field({ type: 'u64' })
  readonly nonce: number;

  /// Defines permissions for this access key.
  @field({ type: AccessKeyPermission })
  readonly permission: AccessKeyPermission;

  constructor(nonce: number, permission: AccessKeyPermission) {
    this.nonce = nonce;
    this.permission = permission;
  }
}
