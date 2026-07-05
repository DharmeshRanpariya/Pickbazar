import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import Pagination from '@/components/ui/pagination';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useIsRTL } from '@/utils/locals';
import usePrice from '@/utils/use-price';
import { Routes } from '@/config/routes';
import { NoDataFound } from '@/components/icons/no-data-found';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export type IProps = {
  // refunds: Refund[] | undefined;
  refunds: any;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const RefundList = ({ refunds, onSort, onOrder, onPagination }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
  } = router;
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-id')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === '_id'
          }
          isActive={sortingObj.column === '_id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: '_id',
      key: '_id',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('_id'),
      render: (_id: number) => `#${t('table:table-item-id')}: ${_id}`,
    },
    {
      title: t('common:text-reason'),
      dataIndex: 'refundReason',
      key: 'refundReason',
      align: alignLeft,
      ellipsis: true,
      width: 220,
      render: (refundReason: any) => (
        <span className="whitespace-nowrap">{refundReason}</span>
      ),
    },
    {
      title: t('table:table-item-customer-email'),
      dataIndex: 'orderId',
      key: 'orderId',
      align: 'center',
      width: 200,
      render: (orderId: any) => (
        <span className="whitespace-nowrap">{orderId?.customer?.email ? orderId?.customer?.email : orderId?.customer?.phoneNumber}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-amount')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'orderId'
          }
          isActive={sortingObj.column === 'orderId'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'orderId',
      key: 'orderId',
      align: 'center',
      width: 100,
      onHeaderCell: () => onHeaderClick('orderId'),
      render: function Render(orderId: any) {
        const hasDiscount =
          (orderId?.discount ?? 0) > 0;
        if (!hasDiscount) {
          return <span>{orderId?.amount}</span>;
        }
        const { basePrice } = usePrice({
          amount: orderId?.amount ?? 0,
          baseAmount:
            orderId?.amount - orderId?.discount,
        });
        return <span>{basePrice}</span>;
      },
    },
    {
      title: t('table:table-item-tracking-number'),
      dataIndex: 'orderId',
      key: 'orderId',
      align: 'center',
      width: 330,
      render: (orderId: any) => (
        <span className="whitespace-nowrap">{orderId?.trackingNumber}</span>
      ),
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-created-at')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'createdAt'
          }
          isActive={sortingObj.column === 'createdAt'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 120,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('createdAt'),
      render: (active_date: string) => (
        <span className="whitespace-nowrap capitalize">
          {dayjs().to(dayjs.utc(active_date).tz(dayjs.tz.guess()))}
        </span>
      ),
    },
    {
      title: t('table:table-item-order-date'),
      dataIndex: 'orderId',
      key: 'orderId',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (orderId: any) => (
        <span className="whitespace-nowrap capitalize">
          {dayjs().to(dayjs.utc(orderId?.createdAt).tz(dayjs.tz.guess()))}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'status'
          }
          isActive={sortingObj.column === 'status'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120,
      onHeaderCell: () => onHeaderClick('status'),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: '_id',
      key: 'actions',
      align: 'right',
      width: 120,
      render: (_id: string, refund: any) => {
        return (
          <ActionButtons
            id={_id}
            detailsUrl={router.query ? `${router.pathname}/${_id}` : `${router.asPath}/${_id}`}
            customLocale={refund?.order?.language}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={refunds}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>
      {!!refunds?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={refunds?.total}
            current={refunds?.current_page}
            pageSize={refunds?.per_page}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default RefundList;
