export type RecipientStatus = 'Active' | 'Inactive';

export interface RecipientItem {
  id: string;
  customerCode: string;
  customerName: string;
  customerMobile: string;
  recipientName: string;
  recipientMobile: string;
  payoutMethod: string;
  country: string;
  status: RecipientStatus;
}

export interface RecipientFilterPayload {
  customerMobileNumber?: string;
  recipientMobileNumber?: string;
  payoutType?: string;
}

export interface RecipientListResponse {
  responseCode: string;
  responseMessage: string;
  data: {
    list: RecipientItem[];
  };
  success: boolean;
}

export interface UpdateRecipientPayload {
  recipientName: string;
  recipientMobile: string;
  payoutMethod: string;
  country: string;
  status: RecipientStatus;
}
