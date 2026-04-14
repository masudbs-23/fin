export interface CommissionListPayload {
  fromDate?: string;
  toDate?: string;
  customerMobileNumber?: string;
}

export interface CommissionListItem {
  id: string;
  transactionId: string;
  dateTime: string;
  amount: string;
  customerName: string;
  customerMobile: string;
  totalCommission: string;
}

export interface CommissionListResponse {
  responseCode: string;
  responseMessage: string;
  data: {
    list: CommissionListItem[];
  };
  success: boolean;
}
