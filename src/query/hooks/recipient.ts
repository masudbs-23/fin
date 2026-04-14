import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRecipientList, updateRecipient } from 'src/query/api/services/recipient';
import { QUERY_KEY } from 'src/query/lib/query-keys';
import { RecipientFilterPayload, RecipientItem, RecipientListResponse, UpdateRecipientPayload } from 'src/types/recipient';

export const useGetRecipientList = (params?: RecipientFilterPayload, enabled: boolean = true) =>
  useQuery<RecipientListResponse>({
    queryKey: [QUERY_KEY.RECIPIENT_LIST, params],
    queryFn: () => getRecipientList(params),
    enabled,
  });

export const useUpdateRecipient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipientId, payload }: { recipientId: string; payload: UpdateRecipientPayload }) =>
      updateRecipient(recipientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RECIPIENT_LIST] });
    },
  });
};

export const getStatusColor = (status: RecipientItem['status']) =>
  status === 'Active'
    ? { bg: '#B9E8C9', text: '#137A3A' }
    : { bg: '#F5E9B5', text: '#9D7A00' };
