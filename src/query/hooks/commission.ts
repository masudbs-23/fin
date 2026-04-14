import { useQuery } from '@tanstack/react-query';
import { getCommissionList } from 'src/query/api/services/commission';
import { QUERY_KEY } from 'src/query/lib/query-keys';
import { CommissionListPayload, CommissionListResponse } from 'src/types/commission';

export const useGetCommissionList = (params?: CommissionListPayload, enabled: boolean = true) =>
  useQuery<CommissionListResponse>({
    queryKey: [QUERY_KEY.COMMISSION_LIST, params],
    queryFn: () => getCommissionList(params),
    enabled,
  });
