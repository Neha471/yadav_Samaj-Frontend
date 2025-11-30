// src/app/models/user.model.ts
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export interface User {
  id?: number;
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  membershipPlan?: string;
  otp?: string;
  approved?: boolean;

status?: UserStatus;
}

// AdminUser includes type info for endpoint selection
export type AdminUser = User & { type: 'matrimonial' | 'membership' };
