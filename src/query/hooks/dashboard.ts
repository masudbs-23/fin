import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from 'src/query/api/services/dashboard';
import { QUERY_KEY } from 'src/query/lib/query-keys';
import { DashboardOverviewData } from 'src/types/dashboard';

export const useGetDashboardOverview = (enabled: boolean = true) =>
  useQuery<DashboardOverviewData>({
    queryKey: [QUERY_KEY.DASHBOARD_OVERVIEW],
    queryFn: () => getDashboardOverview(),
    enabled,
  });
