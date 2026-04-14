import { useQuery } from '@tanstack/react-query';
import { getCreateTransferList } from 'src/query/api/services/create-transfer';
import { QUERY_KEY } from 'src/query/lib/query-keys';
import { CreateTransferFilterPayload, CreateTransferListResponse } from 'src/types/create-transfer';

export const useGetCreateTransferList = (
  params?: CreateTransferFilterPayload,
  enabled: boolean = true
) =>
  useQuery<CreateTransferListResponse>({
    queryKey: [QUERY_KEY.CREATE_TRANSFER_LIST, params],
    queryFn: () => getCreateTransferList(params),
    enabled,
  });
