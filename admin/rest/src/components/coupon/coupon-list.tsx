import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { SortOrder } from '@/types';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Coupon, MappedPaginatorInfo, Attachment } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useIsRTL } from '@/utils/locals';
import Badge from '../ui/badge/badge';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  // coupons: CouponPaginator | null | undefined;
  coupons: Coupon[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CouponList = ({
  coupons,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
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
      title: t('table:table-item-banner'),
      dataIndex: 'image',
      key: 'image',
      width: 74,
      render: (image: Attachment[]) => (
        <Image
          src={image?.[0]?.thumbnail ?? siteSettings.product.placeholder}
          alt="coupon banner"
          width={42}
          height={42}
          className="overflow-hidden rounded"
        />
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-code')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'code'
          }
          isActive={sortingObj.column === 'code'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      onHeaderCell: () => onHeaderClick('code'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-coupon-amount')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'discountAmount'
          }
          isActive={sortingObj.column === 'discountAmount'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('discountAmount'),
      render: function Render(discountAmount: number, record: any) {
        const { price } = usePrice({
          amount: discountAmount,
        });
        if (record.type === 'percentage') {
          return <span>{price}%</span>;
        }
        return <span>{price}</span>;
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-minimum-cart-amount')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'minimumCartAmount'
          }
          isActive={sortingObj.column === 'minimumCartAmount'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'minimumCartAmount',
      key: 'minimumCartAmount',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('minimumCartAmount'),
      render: function Render(minimumCartAmount: number) {
        const { price } = usePrice({
          amount: minimumCartAmount,
        });
        return <span>{price}</span>;
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-active')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'activeForm'
          }
          isActive={sortingObj.column === 'activeForm'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'activeForm',
      key: 'activeForm',
      align: 'center',
      onHeaderCell: () => onHeaderClick('activeForm'),
      render: (activeForm: string) => (
        <span className="whitespace-nowrap">
          {dayjs().to(dayjs.utc(activeForm).tz(dayjs.tz.guess()))}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-expired')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'expireAt'
          }
          isActive={sortingObj.column === 'expireAt'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'expireAt',
      key: 'expireAt',
      align: 'center',
      onHeaderCell: () => onHeaderClick('expireAt'),
      render: (expireAt: string) => (
        <span className="whitespace-nowrap">
          {dayjs().to(dayjs.utc(expireAt).tz(dayjs.tz.guess()))}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'isApprove'
          }
          isActive={sortingObj.column === 'isApprove'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'isApprove',
      key: 'isApprove',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('isApprove'),
      render: (isApprove: boolean) => (
        <Badge
          textKey={isApprove ? 'Approved' : 'Disapprove'}
          color={
            isApprove
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'code',
      key: 'actions',
      align: 'right',
      width: 260,
      render: (slug: string, record: Coupon) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_COUPON"
          isShop={Boolean(shop)}
          shopSlug={(shop as string) ?? ''}
          couponApproveButton={true}
          isCouponApprove={record?.isApprove}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="pt-6 mb-1 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={coupons}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default CouponList;
