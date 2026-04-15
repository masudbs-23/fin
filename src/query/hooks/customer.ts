import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCustomer, getCustomerDetails, getCustomerList, updateCustomer } from 'src/query/api/services/customer';
import { QUERY_KEY } from 'src/query/lib/query-keys';
import {
  CreateCustomerPayload,
  CreateCustomerResponse,
  Customer,
  CustomerListPayload,
  CustomerListResponse,
  UpdateCustomerPayload,
} from 'src/types/customers';

export const useGetCustomerList = (params?: CustomerListPayload, enabled: boolean = true) =>
  useQuery<CustomerListResponse>({
    queryKey: [QUERY_KEY.CUSTOMER_LIST, params],
    queryFn: () => getCustomerList(params),
    enabled,
  });

export const useGetCustomerDetails = (customerId?: string, enabled: boolean = true) =>
  useQuery<Customer>({
    queryKey: [QUERY_KEY.CUSTOMER_DETAILS, customerId],
    queryFn: () => getCustomerDetails(customerId || ''),
    enabled: !!customerId && enabled,
  });

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, payload }: { customerId: string; payload: UpdateCustomerPayload }) =>
      updateCustomer(customerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMER_LIST] });
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateCustomerResponse, unknown, CreateCustomerPayload>({
    mutationFn: (payload) => createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMER_LIST] });
    },
  });
};
