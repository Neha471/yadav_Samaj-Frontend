// src/app/core/models.ts

export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MembershipUser {
  id?: number;
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  city?: string;               // Optional for compatibility
  gender?: string;
  membershipType?: string;
  membershipPlan?: string;
  address?: string;
  approved?: boolean;
  membershipPaid?: boolean;
  role?: string;
  photoFileName?: string;
  status?: UserStatus;
  profilePhoto?: string;
  pincode?: string;
  district?: string;
  state?: string;
  assemblyConstituency?: string;
  referralPhone?: string;
  referredBy?: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
  status?: 'PENDING' | 'ACTIVE' | string;
  paymentDone?: boolean;
  role?: 'ADMIN' | 'USER' | string;
  message?: string;
  fullName?: string; // ✅ add this
}
