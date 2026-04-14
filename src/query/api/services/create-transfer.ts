import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import {
  CreateTransferFilterPayload,
  CreateTransferListItem,
  CreateTransferListResponse,
} from 'src/types/create-transfer';

const CREATE_TRANSFER_DUMMY_RESPONSE: CreateTransferListResponse = {
  responseCode: 'S100000',
  responseMessage: 'Create transfer list fetched successfully',
  success: true,
  data: {
    list: [
      {
        id: '1',
        customerCode: 'C-10421',
        customerName: 'Ahmed Hassan',
        mobileNumber: '+201012345678',
        country: 'Bangladesh',
        kycStatus: 'Verified',
      },
      {
        id: '2',
        customerCode: 'C-10420',
        customerName: 'Fatima Al-Said',
        mobileNumber: '+639171234567',
        country: 'South Africa',
        kycStatus: 'Verified',
      },
      {
        id: '3',
        customerCode: 'C-10419',
        customerName: 'Mohammed Khalid',
        mobileNumber: '(252) 555-0126',
        country: 'Curacao',
        kycStatus: 'Pending',
      },
      {
        id: '4',
        customerCode: 'C-10418',
        customerName: 'Sara Abdullah',
        mobileNumber: '(229) 555-0109',
        country: 'Aland Islands',
        kycStatus: 'Verified',
      },
      {
        id: '5',
        customerCode: 'C-10417',
        customerName: 'Omar Yusuf',
        mobileNumber: '(808) 555-0111',
        country: 'Iceland',
        kycStatus: 'Verified',
      },
      {
        id: '6',
        customerCode: 'C-10416',
        customerName: 'Layla Ibrahim',
        mobileNumber: '(308) 555-0121',
        country: 'Iran',
        kycStatus: 'Verified',
      },
    ],
  },
};

export const getCreateTransferList = async (
  params?: CreateTransferFilterPayload
): Promise<CreateTransferListResponse> => {
  try {
    const response = await axios({
      method: 'GET',
      url: endpoints.createTransfer.list,
      params,
    });

    const responseData = response.data;
    if (responseData?.data?.list) return responseData;
    if (Array.isArray(responseData?.data)) {
      return {
        responseCode: 'S100000',
        responseMessage: 'Create transfer list fetched successfully',
        success: true,
        data: {
          list: responseData.data as CreateTransferListItem[],
        },
      };
    }
    return CREATE_TRANSFER_DUMMY_RESPONSE;
  } catch (error: any) {
    console.error('Error in getCreateTransferList, using dummy response:', error);
    return CREATE_TRANSFER_DUMMY_RESPONSE;
  }
};
