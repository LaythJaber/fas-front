export enum ReturnProductState {
  PENDING = 'PENDING', // en attente
  RECEIVED = 'RECEIVED', // reçu
  PENDING_REIMBURSEMENT = 'PENDING_REIMBURSEMENT', // en attente de remboursement
  REFUNDED = 'REFUNDED', // remboursé
  REJECTED = 'REJECTED', // refusé
  CANCELED = 'CANCELED' // annulé
}
