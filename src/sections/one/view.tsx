import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Chart, { useChart } from 'src/components/chart';
import Iconify from 'src/components/iconify';
import AppAreaInstalled from 'src/components/overview/app-area-installed';
import { useGetDashboardOverview } from 'src/query/hooks/dashboard';

// ----------------------------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STAT_CARD_STYLES = [
  { icon: 'solar:users-group-rounded-bold', iconBg: '#EAF4FF', iconColor: '#3B82F6' },
  { icon: 'solar:arrow-right-up-linear', iconBg: '#F4EEFF', iconColor: '#8B5CF6' },
  { icon: 'solar:wallet-money-bold', iconBg: '#EAFCEE', iconColor: '#16A34A' },
  { icon: 'solar:document-text-bold', iconBg: '#FFF2EB', iconColor: '#FF6A39' },
  { icon: 'solar:user-rounded-bold', iconBg: '#EFF4FF', iconColor: '#4A77FF' },
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
}) {
  return (
    <Card
      sx={{
        height: 1,
        borderRadius: 2,
        boxShadow: 'none',
        border: '1px solid #E8EEF5',
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.5,
              bgcolor: iconBg,
              color: iconColor,
              mt: 0.25,
            }}
          >
            <Iconify icon={icon} width={16} />
          </Stack>

          <Stack spacing={0.3} sx={{ minWidth: 0 }}>
            <Typography sx={{ color: '#7A8394', fontSize: 12, fontWeight: 500 }}>{title}</Typography>
            <Typography sx={{ color: '#101828', fontSize: 40, lineHeight: 1, fontWeight: 700 }}>
              {total}
            </Typography>
          </Stack>
        </Stack>

        {(leftLabel || rightLabel) && (
          <>
            <Divider sx={{ my: 1.5, borderColor: '#EDF2F7' }} />
            <Stack direction="row" spacing={2}>
              {!!leftLabel && (
                <Stack spacing={0.2} sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#98A2B3', fontSize: 12, fontWeight: 500 }}>
                    {leftLabel}
                  </Typography>
                  <Typography sx={{ color: '#111827', fontSize: 30, lineHeight: 1, fontWeight: 700 }}>
                    {leftValue}
                  </Typography>
                </Stack>
              )}

              {!!leftLabel && !!rightLabel && (
                <Divider orientation="vertical" flexItem sx={{ borderColor: '#EDF2F7' }} />
              )}

              {!!rightLabel && (
                <Stack spacing={0.2} sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#98A2B3', fontSize: 12, fontWeight: 500 }}>
                    {rightLabel}
                  </Typography>
                  <Typography sx={{ color: '#111827', fontSize: 30, lineHeight: 1, fontWeight: 700 }}>
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
}: {
  title: string;
  subtitle: string;
  chartSeries: any[];
  chartOptions: any;
  footer?: { label: string; value: string; color: string }[];
}) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 'none',
        border: '1px solid #E8EEF5',
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
          <Stack>
            <Typography sx={{ color: '#101828', fontSize: 28, fontWeight: 700 }}>{title}</Typography>
            <Typography sx={{ color: '#98A2B3', fontSize: 14, fontWeight: 500 }}>{subtitle}</Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              px: 1.25,
              py: 0.75,
              border: '1px solid #DCE5F1',
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

        <Chart dir="ltr" type="line" series={chartSeries} options={chartOptions} height={280} />

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

  return (
    <Stack spacing={2}>
      <Grid container spacing={1.75}>
        {statCards.map((card, index) => {
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
        <Grid item xs={12} lg={6}>
          <TrendCard
            title={transactionTrend?.title || 'Transaction Trends'}
            subtitle={transactionTrend?.subtitle || 'Monthly transaction overview'}
            chartSeries={transactionSeries}
            chartOptions={transactionTrendOptions}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <Stack spacing={1}>
            <AppAreaInstalled
              title={commissionOverview?.title || 'Commision Overview'}
              subheader={commissionOverview?.subtitle || 'Earing vs settlement trend analysis'}
              sx={{
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #E8EEF5',
                '& .MuiCardHeader-root': {
                  px: 2.25,
                  pt: 2.25,
                  pb: 1,
                },
                '& .MuiCardHeader-title': {
                  color: '#101828',
                  fontSize: 28,
                  fontWeight: 700,
                },
                '& .MuiCardHeader-subheader': {
                  color: '#98A2B3',
                  fontSize: 14,
                  fontWeight: 500,
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
            />

            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #E8EEF5',
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2.25 }}>
                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem sx={{ borderColor: '#EDF2F7' }} />}
                >
                  <Stack spacing={0.2} sx={{ flex: 1, px: 0.75 }}>
                    <Typography sx={{ color: '#98A2B3', fontSize: 12, fontWeight: 500 }}>
                      Avg. Earning
                    </Typography>
                    <Typography sx={{ color: '#7A5AF8', fontSize: 32, lineHeight: 1, fontWeight: 700 }}>
                      {commissionOverview?.footer?.avgEarning || '$1,298'}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.2} sx={{ flex: 1, px: 0.75 }}>
                    <Typography sx={{ color: '#98A2B3', fontSize: 12, fontWeight: 500 }}>
                      Avg. Settled
                    </Typography>
                    <Typography sx={{ color: '#12B76A', fontSize: 32, lineHeight: 1, fontWeight: 700 }}>
                      {commissionOverview?.footer?.avgSettled || '$1,031'}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.2} sx={{ flex: 1, px: 0.75 }}>
                    <Typography sx={{ color: '#98A2B3', fontSize: 12, fontWeight: 500 }}>
                      Settlement Rate
                    </Typography>
                    <Typography sx={{ color: '#F79009', fontSize: 32, lineHeight: 1, fontWeight: 700 }}>
                      {commissionOverview?.footer?.settlementRate || '79.4%'}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
