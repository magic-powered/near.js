import BN from 'bn.js';

export type FullAccess = {};

export interface FunctionCallPermission {
  /// Allowance is a balance limit to use by this access key to pay for function call gas and
  /// transaction fees. When this access key is used, both account balance and the allowance is
  /// decreased by the same value.
  /// `None` means unlimited allowance.
  /// NOTE: To change or increase the allowance, the old access key needs to be deleted and a new
  /// access key should be created.
  allowance?: BN;

  /// The access key only allows transactions with the given receiver's account id.
  receiver_id: string;

  /// A list of method names that can be used. The access key only allows transactions with the
  /// function call of one of the given method names.
  /// Empty list means any method name can be used.
  method_names: string[];
}

export type AccessKeyPermission = FullAccess | FunctionCallPermission;

export interface AccessKey {
  /// The nonce for this access key.
  /// NOTE: In some cases the access key needs to be recreated. If the new access key reuses the
  /// same public key, the nonce of the new access key should be equal to the nonce of the old
  /// access key. It's required to avoid replaying old transactions again.
  nonce: number,
  /// Defines permissions for this access key.
  permission: AccessKeyPermission,
}
