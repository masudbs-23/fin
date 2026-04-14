export type TransferKycStatus = 'Verified' | 'Pending';

export interface CreateTransferListItem {
  id: string;
  customerCode: string;
  customerName: string;
  mobileNumber: string;
  country: string;
  kycStatus: TransferKycStatus;
}

export interface CreateTransferFilterPayload {
  customerMobileNumber?: string;
  recipientMobileNumber?: string;
  payoutType?: string;
}

export interface CreateTransferListResponse {
  responseCode: string;
  responseMessage: string;
  data: {
    list: CreateTransferListItem[];
  };
  success: boolean;
}
