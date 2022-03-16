export enum TransactionStatus {
  INCOMPLETE, // non cofirm other action 3d secure
  AUTHORIZED, // non captured
  PAID, // captured
  CANCELED, // cancel an authorized trans
  REFUNDED, // cancel a paid trans
  FAILED, // any other status
  AUTHENTICATION_3D_REQUIRED // 3D SECURE authentication required
}
