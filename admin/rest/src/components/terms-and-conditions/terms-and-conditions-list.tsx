import ActionButtons from '@/components/common/action-buttons';
import { NoShop } from '@/components/icons/no-shop';
import PriorityColor from '@/components/store-notice/priority-color';
import Badge from '@/components/ui/badge/badge';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import { NoDataFound } from '@/components/icons/no-data-found';
import {
  MappedPaginatorInfo,
  SortOrder,
  TermsAndConditions,
  User,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  termsAndConditions: TermsAndConditions[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  user?: User | undefined;
};
const TermsAndConditionsLists = ({
  termsAndConditions,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  user,
}: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
  } = router;
  const { alignLeft, alignRight } = useIsRTL();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder?.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder?.Desc
          ? SortOrder?.Asc
          : SortOrder?.Desc,
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj?.sort === SortOrder?.Desc
            ? SortOrder?.Asc
            : SortOrder?.Desc,
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
      width: 250,
      onHeaderCell: () => onHeaderClick('_id'),
      render: (_id: number) => `#${t('table:table-item-id')}: ${_id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'title'
          }
          isActive={sortingObj?.column === 'title'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'title',
      align: alignLeft,
      ellipsis: true,
      width: 200,
      onHeaderCell: () => onHeaderClick('title'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-description')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'description'
          }
          isActive={sortingObj?.column === 'description'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'description',
      key: 'description',
      align: alignLeft,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('description'),
      render: (text: string) => (
        <span
          dangerouslySetInnerHTML={{
            __html: text?.length < 100 ? text : text?.substring(0, 100) + '...',
          }}
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: 'right',
      render: (slug: string, record: TermsAndConditions) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_TERMS_AND_CONDITIONS"
          routes={Routes?.termsAndCondition}
          isShop={Boolean(shop)}
          shopSlug={(shop as string) ?? ''}
        />
      ),
    },
    // {
    //   title: t('table:table-item-actions'),
    //   key: 'actions',
    //   align: alignRight,
    //   width: 150,
    //   render: (data: TermsAndConditions) => {
    //     if (router?.asPath !== '/') {
    //       return (
    //         <>
    //           <LanguageSwitcher
    //             slug={data?.id}
    //             record={data}
    //             deleteModalView="DELETE_TERMS_AND_CONDITIONS"
    //             routes={Routes?.termsAndCondition}
    //           />
    //         </>
    //       );
    //     } else {
    //       return (
    //         <ActionButtons
    //           id={data?.id}
    //           detailsUrl={Routes?.termsAndCondition?.details(data?.id)}
    //           customLocale={router?.locale}
    //         />
    //       );
    //     }
    //   },
    // },
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
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={termsAndConditions}
          rowKey="id"
          scroll={{ x: 1000 }}
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

export default TermsAndConditionsLists;
