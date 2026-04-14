import { useQuery } from '@tanstack/react-query';
import { getTransactionDetails, getTransactionList } from 'src/query/api/services/transaction';
import { QUERY_KEY } from 'src/query/lib/query-keys';
import { TransactionDetails, TransactionListPayload, TransactionListResponse } from 'src/types/transaction';

export const useGetTransactionList = (params?: TransactionListPayload, enabled: boolean = true) =>
  useQuery<TransactionListResponse>({
    queryKey: [QUERY_KEY.TRANSACTION_LIST, params],
    queryFn: () => getTransactionList(params),
    enabled,
  });

export const useGetTransactionDetails = (transactionId?: string, enabled: boolean = true) =>
  useQuery<TransactionDetails>({
    queryKey: [QUERY_KEY.TRANSACTION_DETAILS, transactionId],
    queryFn: () => getTransactionDetails(transactionId || ''),
    enabled: !!transactionId && enabled,
  });
