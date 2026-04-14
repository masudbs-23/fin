// Change Password Types
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
  data: {
    success: boolean;
  };
}

export interface ProfileDetails {
  fullName: string;
  distributorName: string;
  dateOfBirth: string;
  nationality: string;
  phoneNumber: string;
  email: string;
  nidNumber: string;
  address: string;
}

export interface ProfileDetailsResponse {
  responseCode: string;
  responseMessage: string;
  data: ProfileDetails;
  success: boolean;
}
