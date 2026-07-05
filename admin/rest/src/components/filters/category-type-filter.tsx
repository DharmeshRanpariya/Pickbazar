import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import { useAuthorsQuery } from '@/data/author';
import { useCategoriesQuery } from '@/data/category';
import { useManufacturersQuery } from '@/data/manufacturer';
import { useTypesQuery } from '@/data/type';
import {
  OrderStatus,
  PaymentGateway,
  ProductType,
  RefundPolicyStatus,
} from '@/types';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ActionMeta } from 'react-select';

type Props = {
  onCategoryFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onTypeFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onAuthorFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onProductTypeFilter?: (
    newValue: any,
    actionMeta: ActionMeta<unknown>,
  ) => void;
  onManufactureFilter?: (
    newValue: any,
    actionMeta: ActionMeta<unknown>,
  ) => void;
  onOrderTypeFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onRefundTypeFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onTransactionFilter?: (
    newValue: any,
    actionMeta: ActionMeta<unknown>,
  ) => void;
  className?: string;
  type?: string;
  enableType?: boolean;
  enableCategory?: boolean;
  enableAuthor?: boolean;
  enableProductType?: boolean;
  enableManufacturer?: boolean;
  enableOrderType?: boolean;
  enableRefundType?: boolean;
  enableTransactionType?: boolean;
};

export default function CategoryTypeFilter({
  onTypeFilter,
  onCategoryFilter,
  onAuthorFilter,
  onProductTypeFilter,
  onOrderTypeFilter,
  onRefundTypeFilter,
  onTransactionFilter,
  className,
  type,
  enableType,
  enableCategory,
  enableAuthor,
  enableProductType,
  enableManufacturer,
  enableOrderType,
  enableRefundType,
  enableTransactionType,
  onManufactureFilter,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const { types, loading } = useTypesQuery({ language: locale });
  const { categories, loading: categoryLoading } = useCategoriesQuery({
    page: 1,
    limit: 999,
    language: locale,
    type,
  });

  const { authors, loading: authorLoading } = useAuthorsQuery({
    limit: 999,
    language: locale,
  });

  const { manufacturers, loading: manufactureLoading } = useManufacturersQuery({
    limit: 999,
    language: locale,
  });

  const productType = [
    { name: 'Simple product', slug: ProductType.Simple },
    { name: 'Variable product', slug: ProductType.Variable },
  ];

  const orderType = [
    { name: 'PLACED', slug: OrderStatus.PLACED },
    { name: 'PENDING', slug: OrderStatus.PENDING },
    { name: 'PROCESSING', slug: OrderStatus.PROCESSING },
    { name: 'COMPLETED', slug: OrderStatus.COMPLETED },
    { name: 'CANCELLED', slug: OrderStatus.CANCELLED },
    { name: 'REFUNDED', slug: OrderStatus.REFUNDED },
    { name: 'FAILED', slug: OrderStatus.FAILED },
    { name: 'AT_LOCAL_FACILITY', slug: OrderStatus.AT_LOCAL_FACILITY },
    { name: 'OUT_FOR_DELIVERY', slug: OrderStatus.OUT_FOR_DELIVERY },
  ];

  const refundType = [
    { name: 'Approved', slug: RefundPolicyStatus.Approved },
    { name: 'Pending', slug: RefundPolicyStatus.Pending },
    { name: 'Rejected', slug: RefundPolicyStatus.Rejected },
    { name: 'Processing', slug: RefundPolicyStatus.Processing },
  ];

  const transactionType = [
    { name: 'CASH_ON_DELIVERY', slug: PaymentGateway.COD },
    { name: 'RAZORPAY', slug: PaymentGateway.RAZORPAY },
  ];

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
      {enableType ? (
        <div className="w-full">
          <Label>{t('common:filter-by-group')}</Label>
          <Select
            options={types}
            isLoading={loading}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('common:filter-by-group-placeholder')}
            onChange={onTypeFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

      {enableCategory ? (
        <div className="w-full">
          <Label>{t('common:filter-by-category')}</Label>
          <Select
            options={categories}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.name}
            placeholder={t('common:filter-by-category-placeholder')}
            isLoading={categoryLoading}
            onChange={onCategoryFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

      {enableAuthor ? (
        <div className="w-full">
          <Label>{t('common:filter-by-author')}</Label>
          <Select
            options={authors}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('common:filter-by-author-placeholder')}
            isLoading={authorLoading}
            onChange={onAuthorFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

      {enableProductType ? (
        <div className="w-full">
          <Label>Filter by Product Type</Label>
          <Select
            options={productType}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder="Filter by product type"
            // isLoading={authorLoading}
            onChange={onProductTypeFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

      {enableManufacturer ? (
        <div className="w-full">
          <Label>Filter by manufacturer/publications </Label>
          <Select
            options={manufacturers}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder="Filter by product manufacturer/publications"
            isLoading={manufactureLoading}
            onChange={onManufactureFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

      {enableOrderType ? (
        <div className="w-full">
          <Label>Filter by order status</Label>
          <Select
            options={orderType}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder="Order by status"
            onChange={onOrderTypeFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

      {enableRefundType ? (
        <div className="w-full">
          <Label>Filter by refund status</Label>
          <Select
            options={refundType}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder="Refund by status"
            onChange={onRefundTypeFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

      {enableTransactionType ? (
        <div className="w-full">
          <Label>Filter by transaction status</Label>
          <Select
            options={transactionType}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder="Transaction by status"
            onChange={onTransactionFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
