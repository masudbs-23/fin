export type TransactionStatus = 'Success' | 'Pending' | 'Failed';

export interface TransactionListPayload {
  date?: string;
  status?: string;
  payoutType?: string;
  customerMobileNumber?: string;
  recipientMobileNumber?: string;
}

export interface TransactionListItem {
  id: string;
  transactionId: string;
  dateTime: string;
  customerMobile: string;
  recipientMobile: string;
  amount: string;
  exchangeRate: string;
  payoutMethod: string;
  status: TransactionStatus;
}

export interface TransactionListResponse {
  responseCode: string;
  responseMessage: string;
  data: {
    list: TransactionListItem[];
  };
  success: boolean;
}

export interface TransactionDetails {
  id: string;
  dateTime: string;
  transactionId: string;
  status: TransactionStatus;
  customerName: string;
  customerMobile: string;
  recipientName: string;
  recipientMobile: string;
  transactionAmount: string;
  payoutMethod: string;
}

export interface TransactionDetailsResponse {
  responseCode: string;
  responseMessage: string;
  data: TransactionDetails;
  success: boolean;
}
