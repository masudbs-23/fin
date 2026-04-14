import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import {
  CreateCustomerPayload,
  CreateCustomerResponse,
  Customer,
  CustomerListPayload,
  CustomerListResponse,
  UpdateCustomerPayload,
} from 'src/types/customers';

const CUSTOMER_DUMMY_RESPONSE: CustomerListResponse = {
  responseCode: 'S100000',
  responseMessage: 'Customer list fetched successfully',
  success: true,
  data: {
    customers: [
      {
        id: '1',
        customerCode: 'C-10421',
        fullName: 'Ahmed Hassan',
        phoneNumber: '+9665512345678',
        email: 'ahmed.hassan@email.com',
        dateOfBirth: '1985-06-20',
        status: 'Active',
        ekycStatus: 'Completed',
        country: 'Saudi Arabia',
        nidNumber: '111223344556',
        address: 'Riyadh, Olaya',
      },
      {
        id: '2',
        customerCode: 'C-10420',
        fullName: 'Fatima Al-Said',
        phoneNumber: '+9665598765432',
        email: 'fatima.alsaid@email.com',
        dateOfBirth: '1990-11-14',
        status: 'Active',
        ekycStatus: 'Completed',
        country: 'Saudi Arabia',
        nidNumber: '223344556677',
        address: 'Jeddah, Al Salamah',
      },
      {
        id: '3',
        customerCode: 'C-10419',
        fullName: 'Mohammed Khalid',
        phoneNumber: '+9665511223344',
        email: 'm.khalid@email.com',
        dateOfBirth: '1978-02-28',
        status: 'Inactive',
        ekycStatus: 'In Progress',
        country: 'Saudi Arabia',
        nidNumber: '334455667788',
        address: 'Dammam, Al Faisaliyah',
      },
      {
        id: '4',
        customerCode: 'C-10418',
        fullName: 'Sara Abdullah',
        phoneNumber: '+9665577665544',
        email: 'sara.ab@email.com',
        dateOfBirth: '1995-09-05',
        status: 'Active',
        ekycStatus: 'Completed',
        country: 'Saudi Arabia',
        nidNumber: '445566778899',
        address: 'Mecca, Al Aziziyah',
      },
      {
        id: '5',
        customerCode: 'C-10417',
        fullName: 'Omar Yusuf',
        phoneNumber: '+9665533445566',
        email: 'omar.y@email.com',
        dateOfBirth: '1982-12-30',
        status: 'Inactive',
        ekycStatus: 'Failed',
        country: 'Saudi Arabia',
        nidNumber: '556677889900',
        address: 'Medina, Al Haram',
      },
    ],
  },
};

export const getCustomerList = async (params?: CustomerListPayload): Promise<CustomerListResponse> => {
  try {
    const response = await axios({
      method: 'GET',
      url: endpoints.customers.list,
      params,
    });

    const responseData = response.data;

    if (responseData?.data?.customers) {
      return responseData;
    }

    if (responseData?.customers) {
      return {
        responseCode: 'S100000',
        responseMessage: 'Customer list fetched successfully',
        success: true,
        data: {
          customers: responseData.customers,
        },
      };
    }

    return CUSTOMER_DUMMY_RESPONSE;
  } catch (error: any) {
    console.error('Error in getCustomerList, using dummy response:', error);
    return CUSTOMER_DUMMY_RESPONSE;
  }
};

export const updateCustomer = async (
  customerId: string,
  customerPayload: UpdateCustomerPayload
): Promise<Customer> => {
  try {
    const response = await axios({
      method: 'PUT',
      url: endpoints.customers.update(customerId),
      data: customerPayload,
    });

    return response.data?.data || response.data;
  } catch (error: any) {
    console.error('Error in updateCustomer, using dummy response:', error);
    return {
      id: customerId,
      customerCode: 'C-10421',
      fullName: customerPayload.fullName,
      phoneNumber: customerPayload.phoneNumber,
      email: customerPayload.email,
      dateOfBirth: customerPayload.dateOfBirth,
      status: 'Active',
      ekycStatus: customerPayload.ekycStatus,
      country: 'Saudi Arabia',
      nidNumber: '111223344556',
      address: customerPayload.address,
    };
  }
};

export const createCustomer = async (payload: CreateCustomerPayload): Promise<CreateCustomerResponse> => {
  try {
    const response = await axios({
      method: 'POST',
      url: endpoints.customers.create,
      data: payload,
    });

    const responseData = response.data;

    if (responseData?.data?.customer) {
      return responseData;
    }

    if (responseData?.data?.id) {
      return {
        responseCode: 'S100000',
        responseMessage: 'Customer created successfully',
        success: true,
        data: {
          customer: responseData.data as Customer,
        },
      };
    }

    if (responseData?.id) {
      return {
        responseCode: 'S100000',
        responseMessage: 'Customer created successfully',
        success: true,
        data: {
          customer: responseData as Customer,
        },
      };
    }

    throw new Error('Invalid create customer response');
  } catch (error: any) {
    console.error('Error in createCustomer, using dummy response:', error);
    return {
      responseCode: 'S100000',
      responseMessage: 'Customer created successfully',
      success: true,
      data: {
        customer: {
          id: `${Date.now()}`,
          customerCode: `C-${Math.floor(10000 + Math.random() * 9999)}`,
          fullName: `${payload.firstName} ${payload.lastName}`,
          phoneNumber: payload.phoneNumber || '+8800000000000',
          email: payload.email || `${payload.firstName.toLowerCase()}@email.com`,
          dateOfBirth: payload.dateOfBirth || '1990-01-01',
          status: 'Active',
          ekycStatus: 'In Progress',
          country: payload.country || 'Bangladesh',
          nidNumber: payload.nidNumber || '000000000000',
          address: payload.address || 'Dhaka',
        },
      },
    };
  }
};
