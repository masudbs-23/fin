export type CustomerStatus = 'Active' | 'Inactive';
export type CustomerKycStatus = 'Completed' | 'In Progress' | 'Failed';

export interface Customer {
  id: string;
  customerCode: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  status: CustomerStatus;
  ekycStatus: CustomerKycStatus;
  country: string;
  nidNumber: string;
  address: string;
}

export interface CustomerListResponse {
  responseCode: string;
  responseMessage: string;
  data: {
    customers: Customer[];
  };
  success: boolean;
}

export interface CustomerListPayload {
  mobileNumber?: string;
  nidNumber?: string;
  country?: string;
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
}

export interface UpdateCustomerPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  ekycStatus: CustomerKycStatus;
  address: string;
}
