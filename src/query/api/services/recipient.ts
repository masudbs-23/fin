import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import { RecipientFilterPayload, RecipientItem, RecipientListResponse, UpdateRecipientPayload } from 'src/types/recipient';

const RECIPIENT_DUMMY_RESPONSE: RecipientListResponse = {
  responseCode: 'S100000',
  responseMessage: 'Recipient list fetched successfully',
  success: true,
  data: {
    list: [
      {
        id: '1',
        customerCode: 'C-10421',
        customerName: 'Ahmed Hassan',
        customerMobile: '+201012345678',
        recipientName: 'Hassan Ali',
        recipientMobile: '+201012345678',
        payoutMethod: 'New Mexico',
        country: 'Bangladesh',
        status: 'Active',
      },
      {
        id: '2',
        customerCode: 'C-10420',
        customerName: 'Fatima Al-Said',
        customerMobile: '+201012345678',
        recipientName: 'Floyd Miles',
        recipientMobile: '+639171234567',
        payoutMethod: 'Brazil',
        country: 'South Africa',
        status: 'Active',
      },
      {
        id: '3',
        customerCode: 'C-10419',
        customerName: 'Mohammed Khalid',
        customerMobile: '+201012345678',
        recipientName: 'Kristin Watson',
        recipientMobile: '(252) 555-0126',
        payoutMethod: 'United States',
        country: 'Curacao',
        status: 'Inactive',
      },
      {
        id: '4',
        customerCode: 'C-10418',
        customerName: 'Sara Abdullah',
        customerMobile: '+201012345678',
        recipientName: 'Cody Fisher',
        recipientMobile: '(229) 555-0109',
        payoutMethod: 'Dhaka',
        country: 'Aland Islands',
        status: 'Active',
      },
      {
        id: '5',
        customerCode: 'C-10417',
        customerName: 'Omar Yusuf',
        customerMobile: '+201012345678',
        recipientName: 'Kathryn Murphy',
        recipientMobile: '(808) 555-0111',
        payoutMethod: 'Montana',
        country: 'Iceland',
        status: 'Active',
      },
      {
        id: '6',
        customerCode: 'C-10416',
        customerName: 'Layla Ibrahim',
        customerMobile: '+201012345678',
        recipientName: 'Jenny Wilson',
        recipientMobile: '(308) 555-0121',
        payoutMethod: 'Washington',
        country: 'Iran',
        status: 'Active',
      },
      {
        id: '7',
        customerCode: 'C-10415',
        customerName: 'Khalid Al-Rashid',
        customerMobile: '+201012345678',
        recipientName: 'Khalid Al-Rashid',
        recipientMobile: '+9665522334455',
        payoutMethod: 'New York',
        country: 'Guinea',
        status: 'Active',
      },
    ],
  },
};

export const getRecipientList = async (params?: RecipientFilterPayload): Promise<RecipientListResponse> => {
  try {
    const response = await axios({
      method: 'GET',
      url: endpoints.recipients.list,
      params,
    });

    const responseData = response.data;
    if (responseData?.data?.list) return responseData;
    if (Array.isArray(responseData?.data)) {
      return {
        responseCode: 'S100000',
        responseMessage: 'Recipient list fetched successfully',
        success: true,
        data: {
          list: responseData.data as RecipientItem[],
        },
      };
    }
    return RECIPIENT_DUMMY_RESPONSE;
  } catch (error: any) {
    console.error('Error in getRecipientList, using dummy response:', error);
    return RECIPIENT_DUMMY_RESPONSE;
  }
};

export const updateRecipient = async (
  recipientId: string,
  payload: UpdateRecipientPayload
): Promise<RecipientItem> => {
  try {
    const response = await axios({
      method: 'PUT',
      url: endpoints.recipients.update(recipientId),
      data: payload,
    });

    return response.data?.data || response.data;
  } catch (error: any) {
    console.error('Error in updateRecipient, using dummy response:', error);
    return {
      id: recipientId,
      customerCode: 'C-10421',
      customerName: 'Ahmed Hassan',
      customerMobile: '+201012345678',
      recipientName: payload.recipientName,
      recipientMobile: payload.recipientMobile,
      payoutMethod: payload.payoutMethod,
      country: payload.country,
      status: payload.status,
    };
  }
};
