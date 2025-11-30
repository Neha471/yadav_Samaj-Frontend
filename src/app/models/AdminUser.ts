export interface AdminUser {
  id?: number;
  fullName: string;
  phone: string;
  email: string;
  type: 'membership' | 'matrimonial';
}
