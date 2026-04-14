import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
  ProfileDetails,
  ProfileDetailsResponse,
} from 'src/types/profile';

const PROFILE_DUMMY_RESPONSE: ProfileDetailsResponse = {
  responseCode: 'S100000',
  responseMessage: 'Profile fetched successfully',
  success: true,
  data: {
    fullName: 'John Doe',
    distributorName: 'Ahmed Hossain',
    dateOfBirth: 'January 15, 1985',
    nationality: 'Bangladeshi',
    phoneNumber: '+880-17-12345678',
    email: 'Bangladeshi',
    nidNumber: '1234567890123',
    address: 'Bangladeshi',
  },
};

export const changePassword = async (
  passwordData: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  try {
    const response = await axios({
      method: 'POST',
      url: endpoints.profile.changePassword,
      data: passwordData,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error in changePassword, using dummy response:', error);
    return {
      message: 'Password updated successfully',
      data: {
        success: true,
      },
    };
  }
};

export const getProfileDetails = async (): Promise<ProfileDetails> => {
  try {
    const response = await axios({
      method: 'GET',
      url: endpoints.profile.me,
    });

    return response.data?.data || response.data;
  } catch (error: any) {
    console.error('Error in getProfileDetails, using dummy response:', error);
    return PROFILE_DUMMY_RESPONSE.data;
  }
};
