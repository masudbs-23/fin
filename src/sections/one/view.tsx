import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Chart, { useChart } from 'src/components/chart';
import Iconify from 'src/components/iconify';
import AppAreaInstalled from 'src/components/overview/app-area-installed';
import { useGetDashboardOverview } from 'src/query/hooks/dashboard';

import CustomerIcon from 'src/assets/dashbaord/Customer.svg';
import TransactionIcon from 'src/assets/dashbaord/Transaction.svg';
import CommissionIcon from 'src/assets/dashbaord/Commission.svg';
import CustomerRequestIcon from 'src/assets/dashbaord/Customer_Request.svg';

// ----------------------------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STAT_CARD_STYLES = [
  { icon: CustomerIcon, iconBg: '#EAF4FF', iconColor: '#3B82F6' },
  { icon: TransactionIcon, iconBg: '#F4EEFF', iconColor: '#8B5CF6' },
  { icon: CommissionIcon, iconBg: '#EAFCEE', iconColor: '#16A34A' },
  { icon: CustomerRequestIcon, iconBg: '#FFF2EB', iconColor: '#FF6A39' },
  { icon: CustomerIcon, iconBg: '#EFF4FF', iconColor: '#4A77FF' },
];
const DEFAULT_STAT_CARDS = [
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
];
const DEFAULT_TRANSACTION_SERIES = [
  { name: 'Requests', data: [420, 470, 510, 535, 565, 600, 650, 690, 720, 780, 820, 860] },
  { name: 'Completed', data: [370, 410, 435, 470, 500, 550, 590, 630, 670, 720, 760, 800] },
  { name: 'Pending', data: [58, 51, 63, 55, 50, 46, 57, 52, 48, 56, 53, 49] },
];
const DEFAULT_COMMISSION_SERIES = [
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
];
const DEFAULT_CUSTOMER_GROWTH_SERIES = [
  { name: 'Total Recipients', data: [1800, 2000, 2200, 2400, 2650, 2850, 3050, 3280, 3500, 3720, 3950, 4200] },
  { name: 'Active Customers', data: [1600, 1780, 1960, 2120, 2300, 2470, 2650, 2830, 3000, 3200, 3380, 3600] },
  { name: 'Monthly Onboarded', data: [60, 72, 85, 80, 98, 110, 122, 132, 141, 156, 170, 182] },
];
const DEFAULT_RECENT_ACTIVITY = [
  { id: 1, name: 'Sarah Johnson', type: 'Transaction', status: 'Completed', time: '2 min ago', amount: '$2,450', icon: 'solar:check-circle-bold', iconBg: '#ECFDF3', iconColor: '#16A34A' },
  { id: 2, name: 'Michael Chen', type: 'Transaction', status: 'Pending', time: '15 min ago', amount: '$1,820', icon: 'solar:clock-circle-bold', iconBg: '#FFF7ED', iconColor: '#F97316' },
  { id: 3, name: 'Emma Wilson', type: 'Commission', status: 'Settled', time: '1 hour ago', amount: '$125', icon: 'solar:wallet-money-bold', iconBg: '#ECFDF3', iconColor: '#10B981' },
  { id: 4, name: 'David Martinez', type: 'Transaction', status: 'Completed', time: '2 hours ago', amount: '$3,200', icon: 'solar:check-circle-bold', iconBg: '#ECFDF3', iconColor: '#16A34A' },
  { id: 5, name: 'Lisa Anderson', type: 'Commission', status: 'Earned', time: '3 hours ago', amount: '$89', icon: 'solar:wallet-money-bold', iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  { id: 6, name: 'James Taylor', type: 'Transaction', status: 'Pending', time: '4 hours ago', amount: '$950', icon: 'solar:clock-circle-bold', iconBg: '#FFF7ED', iconColor: '#F97316' },
];

function StatCard({
  title,
  total,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  icon,
  iconBg,
  iconColor,
  compact = false,
}: {
  title: string;
  total: string;
  leftLabel?: string;
  leftValue?: string;
  rightLabel?: string;
  rightValue?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  compact?: boolean;
}) {
  const hasSplit = !!leftLabel || !!rightLabel;

  return (
    <Card
      sx={{
        height: 1,
        minHeight: compact ? 86 : 173,
        borderRadius: '14px',
        boxShadow: 'none',
        border: '1px solid #E8EEF5',
      }}
    >
      <CardContent sx={{ px: compact ? 2.15 : 3.1, py: compact ? 1.25 : 2.5, height: 1 }}>
        <Stack direction="row" spacing={1.4} alignItems={compact ? 'center' : 'flex-start'}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '14px',
              bgcolor: iconBg,
              color: iconColor,
              flexShrink: 0,
              mt: compact ? 0 : 0.2,
            }}
          >
            <Box
              component="img"
              src={icon}
              sx={{
                width: 40,
                height: 40,
              }}
            />
          </Stack>

          <Stack spacing={0.2} sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ color: '#6A7282', fontSize: 14, fontWeight: 400, lineHeight: '20px' }}>
              {title}
            </Typography>
            <Typography sx={{ color: '#101828', fontSize: compact ? 30 : 30, lineHeight: 1, fontWeight: 600 }}>
              {total}
            </Typography>
          </Stack>
        </Stack>

        {hasSplit && !compact && (
          <>
            <Divider sx={{ my: 1.5, borderColor: '#EAECF0' }} />
            <Stack direction="row" spacing={0}>
              {!!leftLabel && (
                <Stack spacing={0.35} sx={{ flex: 1, pr: 1.6, borderRight: '1px solid #EAECF0' }}>
                  <Typography sx={{ color: '#6A7282', fontSize: 12, fontWeight: 400, lineHeight: '16px' }}>
                    {leftLabel}
                  </Typography>
                  <Typography sx={{ color: '#101828', fontSize: 18, lineHeight: '32px', fontWeight: 500 }}>
                    {leftValue}
                  </Typography>
                </Stack>
              )}

              {!!rightLabel && (
                <Stack spacing={0.35} sx={{ flex: 1, pl: 1.6 }}>
                  <Typography sx={{ color: '#6A7282', fontSize: 12, fontWeight: 400, lineHeight: '16px' }}>
                    {rightLabel}
                  </Typography>
                  <Typography sx={{ color: '#101828', fontSize: 18, lineHeight: '32px', fontWeight: 500 }}>
                    {rightValue}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TrendCard({
  title,
  subtitle,
  chartSeries,
  chartOptions,
  footer,
  chartHeight = 280,
  cardSx,
}: {
  title: string;
  subtitle: string;
  chartSeries: any[];
  chartOptions: any;
  footer?: { label: string; value: string; color: string }[];
  chartHeight?: number;
  cardSx?: SxProps<Theme>;
}) {
  return (
    <Card
      sx={{
        borderRadius: '14px',
        boxShadow: 'none',
        border: '1px solid #E8EEF5',
        ...cardSx,
      }}
    >
      <CardContent sx={{ px: 2, pt: 2.1, pb: 1.6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack>
            <Typography sx={{ color: '#101828', fontSize: 18, fontWeight: 500, lineHeight: '28px' }}>
              {title}
            </Typography>
            <Typography sx={{ color: '#6A7282', fontSize: 14, fontWeight: 400, lineHeight: '20px' }}>
              {subtitle}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.7}
            sx={{
              width: 143,
              height: 38,
              px: 1.25,
              border: '1px solid #D0D5DD',
              borderRadius: '12px',
              color: '#101828',
              fontSize: 12,
              fontWeight: 400,
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 400 }}>Last 12 Month</Typography>
            <Iconify icon="eva:arrow-ios-downward-fill" width={16} />
          </Stack>
        </Stack>

        <Chart dir="ltr" type="line" series={chartSeries} options={chartOptions} height={chartHeight} />

        {!!footer?.length && (
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem sx={{ borderColor: '#EDF2F7' }} />} sx={{ mt: 1 }}>
            {footer.map((item) => (
              <Stack key={item.label} spacing={0.2} sx={{ flex: 1, px: 0.75 }}>
                <Typography sx={{ color: '#98A2B3', fontSize: 12, fontWeight: 500 }}>{item.label}</Typography>
                <Typography sx={{ color: item.color, fontSize: 32, lineHeight: 1, fontWeight: 700 }}>
                  {item.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default function OneView() {
  const { data: dashboardOverview } = useGetDashboardOverview();

  const statCards = dashboardOverview?.statCards || DEFAULT_STAT_CARDS;
  const transactionTrend = dashboardOverview?.transactionTrend;
  const commissionOverview = dashboardOverview?.commissionOverview;

  const transactionTrendOptions = useChart({
    chart: { sparkline: { enabled: false } },
    stroke: { width: [3, 3, 2] },
    colors: ['#5B70FF', '#16C784', '#F59E0B'],
    markers: { size: 0 },
    xaxis: {
      categories: transactionTrend?.months || MONTHS,
      labels: {
        show: true,
        style: { colors: '#98A2B3' },
      },
    },
    yaxis: {
      labels: {
        style: { colors: '#98A2B3' },
      },
    },
    grid: {
      borderColor: '#EDF2F7',
      strokeDashArray: 4,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: { size: 8 },
      itemMargin: { horizontal: 16 },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value}`,
      },
    },
  });

  const transactionSeries = transactionTrend?.series || DEFAULT_TRANSACTION_SERIES;
  const topCards = statCards.slice(0, 3);
  const bottomCards = statCards.slice(3, 5);
  const customerGrowthOptions = useChart({
    stroke: { width: [2.5, 2.5, 2], curve: 'smooth' },
    colors: ['#10B981', '#F59E0B', '#3B82F6'],
    fill: {
      type: ['gradient', 'gradient', 'solid'],
      opacity: [0.24, 0.18, 1],
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.24,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    markers: { size: [0, 0, 0] },
    xaxis: {
      categories: MONTHS,
      labels: { style: { colors: '#98A2B3' } },
    },
    yaxis: {
      min: 0,
      max: 6000,
      tickAmount: 4,
      labels: {
        formatter: (value: number) => `${Math.round(value)}`,
        style: { colors: '#98A2B3' },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: { size: 8 },
      itemMargin: { horizontal: 16 },
    },
    grid: {
      borderColor: '#EDF2F7',
      strokeDashArray: 4,
    },
    tooltip: {
      y: { formatter: (value: number) => `${Math.round(value)}` },
    },
  });

  return (
    <Stack spacing={2}>
      <Grid container spacing={1.75}>
        {topCards.map((card, index) => {
          const style = STAT_CARD_STYLES[index] || STAT_CARD_STYLES[0];
          return (
            <Grid item xs={12} md={6} lg={4} key={`${card.title}-${index}`}>
              <StatCard
                title={card.title}
                total={card.total}
                leftLabel={card.leftLabel}
                leftValue={card.leftValue}
                rightLabel={card.rightLabel}
                rightValue={card.rightValue}
                icon={style.icon}
                iconBg={style.iconBg}
                iconColor={style.iconColor}
              />
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={1.75}>
        {bottomCards.map((card, index) => {
          const style = STAT_CARD_STYLES[index + 3] || STAT_CARD_STYLES[0];
          return (
            <Grid item xs={12} md={6} lg={4} key={`${card.title}-${index + 3}`}>
              <StatCard
                title={card.title}
                total={card.total}
                leftLabel={card.leftLabel}
                leftValue={card.leftValue}
                rightLabel={card.rightLabel}
                rightValue={card.rightValue}
                icon={style.icon}
                iconBg={style.iconBg}
                iconColor={style.iconColor}
                compact
              />
            </Grid>
          );
        })}
      </Grid>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: '24px',
        }}
      >
        <Box sx={{ width: { xs: '100%', lg: 'calc((100% - 24px) / 2)' } }}>
          <TrendCard
            title={transactionTrend?.title || 'Transaction Trends'}
            subtitle={transactionTrend?.subtitle || 'Monthly transaction overview'}
            chartSeries={transactionSeries}
            chartOptions={transactionTrendOptions}
            chartHeight={365}
            cardSx={{ height: { lg: 515 } }}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: 'calc((100% - 24px) / 2)' } }}>
          <AppAreaInstalled
            title={commissionOverview?.title || 'Commision Overview'}
            subheader={commissionOverview?.subtitle || 'Earing vs settlement trend analysis'}
            chartHeight={280}
            sx={{
              borderRadius: '14px',
              boxShadow: 'none',
              border: '1px solid #E8EEF5',
              height: { lg: 515 },
              '& .MuiCardHeader-root': {
                px: 2,
                pt: 2.1,
                pb: 1.1,
              },
              '& .MuiCardHeader-title': {
                color: '#101828',
                fontSize: 18,
                lineHeight: '28px',
                fontWeight: 500,
              },
              '& .MuiCardHeader-subheader': {
                color: '#6A7282',
                fontSize: 14,
                lineHeight: '20px',
                fontWeight: 400,
              },
              '& .MuiCardHeader-action': {
                m: 0,
                mt: 0.25,
              },
              '& .MuiCardHeader-action .MuiButtonBase-root': {
                width: 143,
                height: 38,
                px: 1.25,
                py: 0.75,
                borderRadius: '12px',
                border: '1px solid #D0D5DD',
                bgcolor: 'transparent',
                color: '#101828',
                fontSize: 12,
                fontWeight: 400,
                justifyContent: 'center',
              },
              '& .apexcharts-legend': {
                justifyContent: 'center !important',
              },
            }}
            chart={{
              categories: commissionOverview?.categories || MONTHS,
              colors: [
                ['#C6B8FF', '#7A5AF8'],
                ['#9BEAC2', '#12B76A'],
                ['#FFD3A2', '#F79009'],
              ],
              series: commissionOverview?.series || DEFAULT_COMMISSION_SERIES,
              options: {
                stroke: { width: [3, 3, 2] },
                yaxis: [
                  {
                    min: 40,
                    max: 180,
                    tickAmount: 4,
                    labels: {
                      formatter: (value: number) => `${Math.round(value)}`,
                      style: { colors: '#98A2B3' },
                    },
                  },
                  {
                    opposite: true,
                    min: 70,
                    max: 85,
                    tickAmount: 3,
                    labels: {
                      formatter: (value: number) => `${Math.round(value)}%`,
                      style: { colors: '#98A2B3' },
                    },
                  },
                ],
                fill: {
                  type: 'gradient',
                  opacity: 0.35,
                  gradient: {
                    shadeIntensity: 0,
                    opacityFrom: 0.35,
                    opacityTo: 0,
                    stops: [0, 100],
                  },
                },
                legend: {
                  position: 'bottom',
                  horizontalAlign: 'center',
                  fontSize: '12px',
                  markers: { size: 8 },
                  itemMargin: { horizontal: 16 },
                },
                grid: {
                  borderColor: '#EDF2F7',
                  strokeDashArray: 4,
                },
                chart: {
                  toolbar: { show: false },
                },
              },
            }}
            footer={
              <Box sx={{ px: 1.5, pb: 1.4 }}>
                <Card
                  sx={{
                    borderRadius: '14px',
                    boxShadow: 'none',
                    border: '1px solid #E8EEF5',
                  }}
                >
                  <CardContent sx={{ py: 1.4, px: 1.5 }}>
                    <Stack
                      direction="row"
                      divider={<Divider orientation="vertical" flexItem sx={{ borderColor: '#EDF2F7' }} />}
                    >
                      <Stack spacing={0.35} sx={{ flex: 1, px: 0.75 }}>
                        <Typography sx={{ color: '#6A7282', fontSize: 12, fontWeight: 400, textAlign: 'center' }}>
                          Avg. Earning
                        </Typography>
                        <Typography
                          sx={{
                            color: '#7A5AF8',
                            fontSize: 18,
                            lineHeight: '28px',
                            fontWeight: 500,
                            textAlign: 'center',
                          }}
                        >
                          {commissionOverview?.footer?.avgEarning || '$1,298'}
                        </Typography>
                      </Stack>

                      <Stack spacing={0.35} sx={{ flex: 1, px: 0.75 }}>
                        <Typography sx={{ color: '#6A7282', fontSize: 12, fontWeight: 400, textAlign: 'center' }}>
                          Avg. Settled
                        </Typography>
                        <Typography
                          sx={{
                            color: '#12B76A',
                            fontSize: 18,
                            lineHeight: '28px',
                            fontWeight: 500,
                            textAlign: 'center',
                          }}
                        >
                          {commissionOverview?.footer?.avgSettled || '$1,031'}
                        </Typography>
                      </Stack>

                      <Stack spacing={0.35} sx={{ flex: 1, px: 0.75 }}>
                        <Typography sx={{ color: '#6A7282', fontSize: 12, fontWeight: 400, textAlign: 'center' }}>
                          Settlement Rate
                        </Typography>
                        <Typography
                          sx={{
                            color: '#F79009',
                            fontSize: 18,
                            lineHeight: '28px',
                            fontWeight: 500,
                            textAlign: 'center',
                          }}
                        >
                          {commissionOverview?.footer?.settlementRate || '79.4%'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            }
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: '24px',
        }}
      >
        <Box sx={{ width: { xs: '100%', lg: 'calc((100% - 24px) / 2)' } }}>
          <Card
            sx={{
              borderRadius: '14px',
              boxShadow: 'none',
              border: '1px solid #E8EEF5',
              height: { lg: 515 },
            }}
          >
            <CardContent sx={{ p: 2.25 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
                <Stack>
                  <Typography sx={{ color: '#101828', fontSize: 18, fontWeight: 500 }}>Customer Growth</Typography>
                  <Typography sx={{ color: '#6A7282', fontSize: 14, fontWeight: 400 }}>
                    Customer acquisition and activity trends
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    border: '1px solid #D1D5DB',
                    borderRadius: 1.5,
                    color: '#344054',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Last 12 Month</Typography>
                  <Iconify icon="eva:arrow-ios-downward-fill" width={14} />
                </Stack>
              </Stack>

              <Chart
                dir="ltr"
                type="area"
                series={DEFAULT_CUSTOMER_GROWTH_SERIES}
                options={customerGrowthOptions}
                height={330}
              />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', lg: 'calc((100% - 24px) / 2)' } }}>
          <Card
            sx={{
              borderRadius: '14px',
              boxShadow: 'none',
              border: '1px solid #E8EEF5',
              height: { lg: 515 },
            }}
          >
            <CardContent sx={{ p: 2.25 }}>
              <Stack sx={{ mb: 2 }}>
                <Typography sx={{ color: '#101828', fontSize: 18, fontWeight: 500 }}>Recent Activity</Typography>
                <Typography sx={{ color: '#6A7282', fontSize: 14, fontWeight: 400 }}>
                  Latest transactions
                </Typography>
              </Stack>

              <Stack spacing={1}>
                {DEFAULT_RECENT_ACTIVITY.map((item, index) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{
                      py: 0.9,
                      borderBottom:
                        index === DEFAULT_RECENT_ACTIVITY.length - 1 ? 'none' : '1px solid #F1F5F9',
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        bgcolor: item.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.iconColor,
                        flexShrink: 0,
                      }}
                    >
                      <Iconify icon={item.icon} width={16} />
                    </Box>

                    <Stack sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ color: '#101828', fontSize: 14, fontWeight: 500, lineHeight: '20px' }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ color: '#6A7282', fontSize: 12, lineHeight: '16px' }}>
                        {item.type} - {item.status}
                      </Typography>
                      <Typography sx={{ color: '#99A1AF', fontSize: 12, lineHeight: '16px' }}>
                        {item.time}
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        color: '#101828',
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: '20px',
                        flexShrink: 0,
                      }}
                    >
                      {item.amount}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Stack>
  );
}
