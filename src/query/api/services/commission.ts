import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import { CommissionListPayload, CommissionListResponse } from 'src/types/commission';

const COMMISSION_LIST_DUMMY_RESPONSE: CommissionListResponse = {
  responseCode: 'S100000',
  responseMessage: 'Commission list fetched successfully',
  success: true,
  data: {
    list: [
      {
        id: '1',
        transactionId: 'TXN-10421',
        dateTime: '1985-06-20',
        amount: '1,000',
        customerName: 'Ahmed Hassan',
        customerMobile: '+201012345678',
        totalCommission: '76.00',
      },
      {
        id: '2',
        transactionId: 'TXN-10422',
        dateTime: '1985-06-20',
        amount: '40,000',
        customerName: 'Ahmed Hassan',
        customerMobile: '+201012345678',
        totalCommission: '67.00',
      },
      {
        id: '3',
        transactionId: 'TXN-10423',
        dateTime: '1985-06-20',
        amount: '40,000',
        customerName: 'Ahmed Hassan',
        customerMobile: '+201012345678',
        totalCommission: '6.50',
      },
      {
        id: '4',
        transactionId: 'TXN-10424',
        dateTime: '1985-06-20',
        amount: '40,000',
        customerName: 'Ahmed Hassan',
        customerMobile: '+201012345678',
        totalCommission: '99.00',
      },
      {
        id: '5',
        transactionId: 'TXN-10425',
        dateTime: '1985-06-20',
        amount: '37,000',
        customerName: 'Ahmed Hassan',
        customerMobile: '+201012345678',
        totalCommission: '54.99',
      },
      {
        id: '6',
        transactionId: 'TXN-10426',
        dateTime: '1985-06-20',
        amount: '2,000',
        customerName: 'Ahmed Hassan',
        customerMobile: '+201012345678',
        totalCommission: '11.45',
      },
    ],
  },
};

export const getCommissionList = async (params?: CommissionListPayload): Promise<CommissionListResponse> => {
  try {
    const response = await axios({
      method: 'GET',
      url: endpoints.commissions.list,
      params,
    });

    const responseData = response.data;
    if (responseData?.data?.list) return responseData;
    return COMMISSION_LIST_DUMMY_RESPONSE;
  } catch (error: any) {
    console.error('Error in getCommissionList, using dummy response:', error);
    return COMMISSION_LIST_DUMMY_RESPONSE;
  }
};
