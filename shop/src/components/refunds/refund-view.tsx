import { Table } from '@/components/ui/table';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/lib/locals';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/cards/card';
import { Eye } from '@/components/icons/eye-icon';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import ErrorMessage from '@/components/ui/error-message';
import { useRefunds } from '@/framework/order';
import { useRouter } from 'next/router';
import { Refund } from '@/types';
type AlignType = 'left' | 'right' | 'center';
const RenderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useTranslation('common');
  switch (status.toLowerCase()) {
    case 'approved':
      return <Badge text={t('text-approved')} color="bg-accent" />;
    case 'rejected':
      return <Badge text={t('text-rejected')} color="bg-red-500" />;
    case 'processing':
      return <Badge text={t('text-processing')} color="bg-yellow-500" />;
    default:
      return <Badge text={t('text-pending')} color="bg-purple-500" />;
  }
};

const RefundView: React.FC = () => {
  const { t } = useTranslation('common');
  const { alignLeft, alignRight } = useIsRTL();
  const { locale = 'en' } = useRouter();
  const { error, refunds } = useRefunds({});
  let err: any = error;
  const refundTableColumns = useMemo(
    () => [
      {
        title: t('text-id'),
        dataIndex: '_id',
        key: '_id',
        align: 'center' as AlignType,
        ellipsis: true,
        className: '!text-sm',
        width: 250,
      },
      {
        title: t('text-reason'),
        dataIndex: 'refundReason',
        key: 'refundReason',
        align: alignLeft as AlignType,
        ellipsis: true,
        className: '!text-sm',
        width: 220,
        render: function renderQuantity(refundReason: any, record: Refund) {
          return (
            <p className="whitespace-nowrap">
              {refundReason ?? record?.refund_reason?.name!}
            </p>
          );
        },
      },
      {
        title: t('text-status'),
        dataIndex: 'status',
        key: 'status',
        align: 'center' as AlignType,
        ellipsis: true,
        className: '!text-sm',
        width: 160,
        render: function renderStatus(status: any) {
          return <RenderStatusBadge status={status} />;
        },
      },
      {
        title: t('text-tracking-number'),
        dataIndex: 'orderId',
        key: 'orderId',
        align: 'center' as AlignType,
        className: '!text-sm',
        width: 300,
        render: function renderTrackingNumber(orderId: any) {
          return <p>{orderId?.trackingNumber}</p>;
        },
      },
      {
        title: t('text-amount'),
        dataIndex: 'orderId',
        key: 'orderId',
        align: alignRight as AlignType,
        className: '!text-sm',
        width: 150,
        render: function RenderPrice(orderId: any) {
          const { price } = usePrice({
            amount: orderId?.paidTotal,
          });
          return <p>{price}</p>;
        },
      },
      {
        title: t('text-date'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center' as AlignType,
        className: '!text-sm',
        width: 160,
        render: (date: string) => {
          dayjs.extend(relativeTime);
          dayjs.extend(utc);
          dayjs.extend(timezone);
          return (
            <span className="whitespace-nowrap">
              {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
            </span>
          );
        },
      },
      {
        title: t('text-details'),
        dataIndex: 'orderId',
        key: 'orderId',
        align: 'center' as AlignType,
        className: '!text-sm',
        width: 100,
        render: (orderId: any) => (
          <Link
            href={Routes.order(orderId?.trackingNumber)}
            className="inline-block transition duration-200 text-body hover:text-accent-hover focus:text-accent-hover"
            title={t('text-view-order')}
          >
            <Eye width={20} />
          </Link>
        ),
      },
    ],
    [alignLeft, alignRight, t],
  );
  if (err) return <ErrorMessage message={err?.message} />;
  return (
    <Card className="self-stretch w-full min-h-screen overflow-hidden lg:min-h-0">
      <div className="flex items-center justify-center mb-8 sm:mb-10">
        <h3 className="text-lg font-semibold text-center text-heading sm:text-xl">
          {t('text-my-refunds')}
        </h3>
      </div>
      <Table
        columns={refundTableColumns}
        data={refunds}
        rowKey={(record: any) => record.created_at}
        className="w-full border border-gray-200 orderDetailsTable"
        scroll={{ x: 500, y: 700 }}
      />
    </Card>
  );
};

export default RefundView;
