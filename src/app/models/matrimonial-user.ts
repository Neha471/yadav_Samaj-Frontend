import { membershipPlans } from './../core/premium-plans';
export interface MatrimonialUser {
  fullName: string;
  phone: string;
  dob: string;
  age?: number;
  email?: string;
  gender?: string;

  fatherName?: string;
  motherName?: string;
  membershipPlan?: '1_YEAR' | 'LIFETIME';

  brothers?: number;
  sisters?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  education?: string;
  occupation?: string;
  income?: number;
  maritalStatus?: string;
  motherTongue?: string;
  hobbies?: string;
  religion?: string;
  caste?: string;
  diet?: string;
  lifestyle?: string;
  height?: number;
  weight?: number;
  bloodGroup?: string;
 paymentAmount?: number;
 membershipPlans ?: string;
  isYadav?: boolean;
}
