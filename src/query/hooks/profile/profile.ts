import { useMutation, useQuery } from '@tanstack/react-query';
import { changePassword, getProfileDetails } from 'src/query/api/services/profile/profile';
import { QUERY_KEY } from 'src/query/lib/query-keys';
import { ChangePasswordPayload, ProfileDetails } from 'src/types/profile';

/**
 * Hook to change user password
 *
 * @returns Mutation result for changing password
 */
export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
  });

export const useGetProfileDetails = (enabled: boolean = true) =>
  useQuery<ProfileDetails>({
    queryKey: [QUERY_KEY.PROFILE_DETAILS],
    queryFn: () => getProfileDetails(),
    enabled,
  });
