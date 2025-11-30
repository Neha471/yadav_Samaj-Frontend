export interface Payment {
  id?: number;
  userId: number;
  type: 'matrimonial' | 'membership';
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt?: Date;

  paymentAmount?: number;
}
