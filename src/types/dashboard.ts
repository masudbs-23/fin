export interface DashboardStatCard {
  title: string;
  total: string;
  leftLabel?: string;
  leftValue?: string;
  rightLabel?: string;
  rightValue?: string;
}

export interface DashboardChartSeries {
  name: string;
  data: number[];
}

export interface DashboardCommissionSeries {
  year: string;
  data: DashboardChartSeries[];
}

export interface DashboardOverviewData {
  statCards: DashboardStatCard[];
  transactionTrend: {
    title: string;
    subtitle: string;
    months: string[];
    series: DashboardChartSeries[];
  };
  commissionOverview: {
    title: string;
    subtitle: string;
    categories: string[];
    series: DashboardCommissionSeries[];
    footer: {
      avgEarning: string;
      avgSettled: string;
      settlementRate: string;
    };
  };
}

export interface DashboardOverviewResponse {
  responseCode: string;
  responseMessage: string;
  data: DashboardOverviewData;
  success: boolean;
}
