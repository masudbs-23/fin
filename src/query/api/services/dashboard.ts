import axios from 'src/query/api/axios';
import { endpoints } from 'src/query/api/endpoints';
import { DashboardOverviewData, DashboardOverviewResponse } from 'src/types/dashboard';

const DASHBOARD_DUMMY_RESPONSE: DashboardOverviewResponse = {
  responseCode: 'S100000',
  responseMessage: 'Dashboard overview generated successfully',
  success: true,
  data: {
    statCards: [
      {
        title: 'Total Customer',
        total: '8,432',
        leftLabel: 'Onboarded',
        leftValue: '3,254',
        rightLabel: 'Pending',
        rightValue: '89',
      },
      {
        title: 'Total Transactions',
        total: '15,642',
        leftLabel: 'Completed',
        leftValue: '15,408',
        rightLabel: 'Pending',
        rightValue: '234',
      },
      {
        title: 'Total Commission',
        total: '$78,920',
        leftLabel: 'Settled',
        leftValue: '$45,678',
        rightLabel: 'Pending',
        rightValue: '$33,242',
      },
      {
        title: 'Customer Request',
        total: '156',
      },
      {
        title: 'Total Recipient',
        total: '12,856',
      },
    ],
    transactionTrend: {
      title: 'Transaction Trends',
      subtitle: 'Monthly transaction overview',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        {
          name: 'Requests',
          data: [420, 470, 510, 535, 565, 600, 650, 690, 720, 780, 820, 860],
        },
        {
          name: 'Completed',
          data: [370, 410, 435, 470, 500, 550, 590, 630, 670, 720, 760, 800],
        },
        {
          name: 'Pending',
          data: [58, 51, 63, 55, 50, 46, 57, 52, 48, 56, 53, 49],
        },
      ],
    },
    commissionOverview: {
      title: 'Commision Overview',
      subtitle: 'Earing vs settlement trend analysis',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        {
          year: 'Last 12 Month',
          data: [
            {
              name: 'Total Earned',
              data: [95, 110, 124, 118, 140, 136, 148, 160, 152, 170, 178, 186],
            },
            {
              name: 'Settled',
              data: [82, 95, 102, 94, 112, 118, 124, 136, 130, 142, 146, 150],
            },
            {
              name: 'Settlement Rate',
              data: [74, 75, 76, 75, 79, 78, 79, 80, 79, 80, 80, 81],
            },
          ],
        },
      ],
      footer: {
        avgEarning: '$1,298',
        avgSettled: '$1,031',
        settlementRate: '79.4%',
      },
    },
  },
};

export const getDashboardOverview = async (): Promise<DashboardOverviewData> => {
  try {
    const response = await axios({
      method: 'GET',
      url: endpoints.dashboard.overview,
    });

    return response.data?.data || response.data;
  } catch (error: any) {
    console.error('Error in getDashboardOverview, using dummy response:', error);
    return DASHBOARD_DUMMY_RESPONSE.data;
  }
};
