import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import {
  TransactionDetails,
  TransactionDetailsResponse,
  TransactionListPayload,
  TransactionListResponse,
} from 'src/types/transaction';

const TRANSACTION_LIST_DUMMY_RESPONSE: TransactionListResponse = {
  responseCode: 'S100000',
  responseMessage: 'Transaction list fetched successfully',
  success: true,
  data: {
    list: [
      {
        id: '1',
        transactionId: 'TXN-10421',
        dateTime: '1985-06-20',
        customerMobile: '+201012345678',
        recipientMobile: '+201012345678',
        amount: '40,000',
        exchangeRate: '125',
        payoutMethod: 'Bank Transfer',
        status: 'Success',
      },
      {
        id: '2',
        transactionId: 'TXN-10422',
        dateTime: '1985-06-20',
        customerMobile: '+639171234567',
        recipientMobile: '+201012345678',
        amount: '37,000',
        exchangeRate: '125',
        payoutMethod: 'Bank Transfer',
        status: 'Success',
      },
      {
        id: '3',
        transactionId: 'TXN-10423',
        dateTime: '1985-06-20',
        customerMobile: '+639171234567',
        recipientMobile: '+201012345678',
        amount: '40,000',
        exchangeRate: '125',
        payoutMethod: 'Bank Transfer',
        status: 'Success',
      },
      {
        id: '4',
        transactionId: 'TXN-10424',
        dateTime: '1985-06-20',
        customerMobile: '+639171234567',
        recipientMobile: '+201012345678',
        amount: '1,000',
        exchangeRate: '125',
        payoutMethod: 'Bank Transfer',
        status: 'Success',
      },
      {
        id: '5',
        transactionId: 'TXN-10425',
        dateTime: '1985-06-20',
        customerMobile: '+639171234567',
        recipientMobile: '+201012345678',
        amount: '2,000',
        exchangeRate: '125',
        payoutMethod: 'Bank Transfer',
        status: 'Success',
      },
      {
        id: '6',
        transactionId: 'TXN-10414',
        dateTime: '2026-03-04 14:10:05',
        customerMobile: '+8801789012345',
        recipientMobile: '+8801889012345',
        amount: '20,000',
        exchangeRate: '125',
        payoutMethod: 'Bank Transfer',
        status: 'Pending',
      },
    ],
  },
};

const TRANSACTION_DETAILS_DUMMY_RESPONSE: TransactionDetailsResponse = {
  responseCode: 'S100000',
  responseMessage: 'Transaction details fetched successfully',
  success: true,
  data: {
    id: '6',
    dateTime: '2026-03-04 14:10:05',
    transactionId: 'TXN-10414',
    status: 'Pending',
    customerName: 'Nadia Rahman',
    customerMobile: '+880-1789-012345',
    recipientName: 'Khalid Rahman',
    recipientMobile: '+880-1889-012345',
    transactionAmount: '20,000 BDT',
    payoutMethod: 'Bank Transfer',
  },
};

export const getTransactionList = async (params?: TransactionListPayload): Promise<TransactionListResponse> => {
  try {
    const response = await axios({
      method: 'GET',
      url: endpoints.transactions.list,
      params,
    });

    const responseData = response.data;
    if (responseData?.data?.list) return responseData;
    return TRANSACTION_LIST_DUMMY_RESPONSE;
  } catch (error: any) {
    console.error('Error in getTransactionList, using dummy response:', error);
    return TRANSACTION_LIST_DUMMY_RESPONSE;
  }
};

export const getTransactionDetails = async (transactionId: string): Promise<TransactionDetails> => {
  try {
    const response = await axios({
      method: 'GET',
      url: endpoints.transactions.details(transactionId),
    });

    return response.data?.data || response.data;
  } catch (error: any) {
    console.error('Error in getTransactionDetails, using dummy response:', error);
    return {
      ...TRANSACTION_DETAILS_DUMMY_RESPONSE.data,
      id: transactionId,
      transactionId: transactionId.startsWith('TXN-') ? transactionId : 'TXN-10414',
    };
  }
};
