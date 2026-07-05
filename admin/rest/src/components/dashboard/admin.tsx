import RecentOrders from '@/components/order/recent-orders';
import { motion } from 'framer-motion';
import PopularProductList from '@/components/product/popular-product-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import ColumnChart from '@/components/widgets/column-chart';
import StickerCard from '@/components/widgets/sticker-card';
import Button from '@/components/ui/button';
import {
  useAnalyticsQuery,
  usePopularProductsQuery,
  useLowProductStockQuery,
  useProductByCategoryQuery,
  useTopRatedProductsQuery,
  useRefundAnalyticsQuery,
} from '@/data/dashboard';
import { useOrdersQuery } from '@/data/order';
import { useWithdrawsQuery } from '@/data/withdraw';
import usePrice from '@/utils/use-price';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import LowStockProduct from '@/components/product/product-stock';
import { useEffect, useState } from 'react';
import { EaringIcon } from '@/components/icons/summary/earning';
import { ShoppingIcon } from '@/components/icons/summary/shopping';
import Search from '../common/search';
import { SortOrder } from '@/types';

// const TotalOrderByStatus = dynamic(
//   () => import('@/components/dashboard/total-order-by-status')
// );
// const WeeklyDaysTotalOrderByStatus = dynamic(
//   () => import('@/components/dashboard/total-order-by-status')
// );
// const MonthlyTotalOrderByStatus = dynamic(
//   () => import('@/components/dashboard/total-order-by-status')
// );

const OrderStatusWidget = dynamic(
  () => import('@/components/dashboard/widgets/box/widget-order-by-status'),
);

const RefundStatusWidget = dynamic(
  () => import('@/components/dashboard/widgets/box/widget-refund-status'),
);

const ProductCountByCategory = dynamic(
  () =>
    import(
      '@/components/dashboard/widgets/table/widget-product-count-by-category'
    ),
);

const TopRatedProducts = dynamic(
  () => import('@/components/dashboard/widgets/box/widget-top-rate-product'),
);

interface RefundAnalyticsData {
  refundData: any;
  todayTotalRefundByStatus: any; 
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { data: analyticsData, isLoading: loading } = useAnalyticsQuery();
  const [page, setPage] = useState(1);
  const [searchOrder, setSearchOrder] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [activeTimeFrame, setActiveTimeFrame] = useState(1);
  const [orderDataRange, setOrderDataRange] = useState(
    analyticsData?.todayTotalOrderByStatus,
  );
  const { data: refundAnalyticsData, isLoading: refundLoading } = useRefundAnalyticsQuery<RefundAnalyticsData>();
  const [activeRefundTimeFrame, setActiveRefundTimeFrame] = useState(1);
  const [refundDataRange, setRefundDataRange] = useState(
    refundAnalyticsData?.todayRefundsByStatus,
  );
  const [orderBy, setOrder] = useState('createdAt');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { price: total_revenue } = usePrice(
    analyticsData && {
      amount: analyticsData?.totalRevenue!,
    },
  );
  const { price: todays_revenue } = usePrice(
    analyticsData && {
      amount: analyticsData?.todaysRevenue!,
    },
  );
  const {
    error: orderError,
    orders: orderData,
    loading: orderLoading,
    paginatorInfo: orderPaginatorInfo,
  } = useOrdersQuery({
    language: locale,
    limit: 5,
    page,
    orderBy,
    sortedBy,
    tracking_number: searchOrder,
  });
  const {
    data: popularProductData,
    isLoading: popularProductLoading,
    error: popularProductError,
  } = usePopularProductsQuery({ limit: 10, language: locale });

  const {
    data: topRatedProducts,
    isLoading: topRatedProductsLoading,
    error: topRatedProductsError,
  } = useTopRatedProductsQuery({ limit: 10, language: locale });

  const {
    data: lowStockProduct,
    isLoading: lowStockProductLoading,
    error: lowStockProductError,
  } = useLowProductStockQuery({
    limit: 10,
    page,
    name: searchProduct,
    language: locale,
  });

  const {
    data: productByCategory,
    isLoading: productByCategoryLoading,
    error: productByCategoryError,
  } = useProductByCategoryQuery({ limit: 10, language: locale });

  const {
    withdraws,
    loading: withdrawLoading,
    paginatorInfo: withdrawPaginatorInfo,
  } = useWithdrawsQuery({
    limit: 10,
  });

  let salesByYear: number[] = Array.from({ length: 12 }, (_) => 0);
  if (!!analyticsData?.totalYearSaleByMonth?.length) {
    salesByYear = analyticsData.totalYearSaleByMonth.map((item: any) =>
      item.total.toFixed(2),
    );
  }

  function handleSearchOrder({ searchText }: { searchText: string }) {
    setSearchOrder(searchText);
    setPage(1);
  }

  function handleSearchProduct({ searchText }: { searchText: string }) {
    setSearchProduct(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  const timeFrame = [
    { name: t('text-today'), day: 1 },
    { name: t('text-weekly'), day: 7 },
    { name: t('text-monthly'), day: 30 },
    { name: t('text-yearly'), day: 365 },
  ];

  useEffect(() => {
    switch (activeTimeFrame) {
      case 1:
        setOrderDataRange(analyticsData?.todayTotalOrderByStatus);
        break;
      case 7:
        setOrderDataRange(analyticsData?.weeklyTotalOrderByStatus);
        break;
      case 30:
        setOrderDataRange(analyticsData?.monthlyTotalOrderByStatus);
        break;
      case 365:
        setOrderDataRange(analyticsData?.yearlyTotalOrderByStatus);
        break;

      default:
        setOrderDataRange(orderDataRange);
        break;
    }
    switch (activeRefundTimeFrame) {
      case 1:
        setRefundDataRange(refundAnalyticsData?.todayRefundsByStatus);
        break;
      case 7:
        setRefundDataRange(refundAnalyticsData?.weeklyRefundsByStatus);
        break;
      case 30:
        setRefundDataRange(refundAnalyticsData?.monthlyRefundsByStatus);
        break;
      case 365:
        setRefundDataRange(refundAnalyticsData?.yearlyRefundsByStatus);
        break;
      default:
        setRefundDataRange(refundDataRange);
        break;
    }
  });

  if (
    loading ||
    orderLoading ||
    popularProductLoading ||
    withdrawLoading ||
    topRatedProductsLoading
  ) {
    return <Loader text={t('common:text-loading')} />;
  }
  if (orderError || popularProductError || topRatedProductsError) {
    return (
      <ErrorMessage
        message={
          orderError?.message ||
          popularProductError?.message ||
          topRatedProductsError?.message
        }
      />
    );
  }

  return (
    <div className="grid gap-7 md:gap-8 lg:grid-cols-2 2xl:grid-cols-12">
      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t('text-summary')}
          </h3>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-1 xl:grid-cols-2">
          <StickerCard
            titleTransKey="sticker-card-title-rev"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<EaringIcon className="h-8 w-8" />}
            color="#1EAE98"
            price={total_revenue}
          />
          <StickerCard
            titleTransKey="sticker-card-title-order"
            subtitleTransKey="sticker-card-subtitle-order"
            icon={<ShoppingIcon className="h-8 w-8" />}
            color="#865DFF"
            price={analyticsData?.totalOrders}
          />
        </div>
      </div>

      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 items-center justify-between sm:flex md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t('text-order-status')}
          </h3>
          <div className="mt-3.5 inline-flex rounded-full bg-gray-100/80 p-1.5 sm:mt-0">
            {timeFrame
              ? timeFrame.map((time) => (
                <div key={time.day} className="relative">
                  <Button
                    className={cn(
                      '!focus:ring-0  relative z-10 !h-7 rounded-full !px-2.5 text-sm font-medium text-gray-500',
                      time.day === activeTimeFrame ? 'text-accent' : '',
                    )}
                    type="button"
                    onClick={() => setActiveTimeFrame(time.day)}
                    variant="custom"
                  >
                    {time.name}
                  </Button>
                  {time.day === activeTimeFrame ? (
                    <motion.div className="absolute bottom-0 left-0 right-0 z-0 h-full rounded-3xl bg-accent/10" />
                  ) : null}
                </div>
              ))
              : null}
          </div>
        </div>

        <OrderStatusWidget
          order={orderDataRange}
          timeFrame={activeTimeFrame}
          allowedStatus={[
            'placed',
            'pending',
            'processing',
            'complete',
            'cancel',
            'refund',
            'fail',
            'local-facility',
          ]}
        />
      </div>
      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 items-center justify-between sm:flex md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t('text-refund-status')}
          </h3>
          <div className="mt-3.5 inline-flex rounded-full bg-gray-100/80 p-1.5 sm:mt-0">
            {timeFrame &&
              timeFrame.map((time) => (
                <div key={time.day} className="relative">
                  <Button
                    className={cn(
                      '!focus:ring-0 relative z-10 !h-7 rounded-full !px-2.5 text-sm font-medium text-gray-500',
                      time.day === activeRefundTimeFrame ? 'text-accent' : '',
                    )}
                    type="button"
                    onClick={() => setActiveRefundTimeFrame(time.day)}
                    variant="custom"
                  >
                    {time.name}
                  </Button>
                  {time.day === activeRefundTimeFrame && (
                    <motion.div className="absolute bottom-0 left-0 right-0 z-0 h-full rounded-3xl bg-accent/10" />
                  )}
                </div>
              ))}
          </div>
        </div>

        <RefundStatusWidget
          refund={refundDataRange}
          timeFrame={activeRefundTimeFrame}
          allowedStatus={[
            'pending',
            'processing',
            'approved',
            'rejected',
          ]}
        />
      </div>
      <RecentOrders
        className="col-span-full"
        orders={orderData}
        paginatorInfo={orderPaginatorInfo}
        title={t('table:recent-order-table-title')}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        searchElement={
          <Search
            onSearch={handleSearchOrder}
            placeholderText={t('form:input-placeholder-search-name')}
            className="hidden max-w-sm sm:inline-block [&button]:top-0.5"
            inputClassName="!h-10"
          />
        }
      />
      <div className="lg:col-span-full 2xl:col-span-8">
        <ColumnChart
          widgetTitle={t('common:sale-history')}
          colors={['#6073D4']}
          series={salesByYear}
          categories={[
            t('common:january'),
            t('common:february'),
            t('common:march'),
            t('common:april'),
            t('common:may'),
            t('common:june'),
            t('common:july'),
            t('common:august'),
            t('common:september'),
            t('common:october'),
            t('common:november'),
            t('common:december'),
          ]}
        />
      </div>

      <PopularProductList
        products={popularProductData}
        title={t('table:popular-products-table-title')}
        className="col-span-full"
      />

      <LowStockProduct
        //@ts-ignore
        products={lowStockProduct?.data}
        title={'text-low-stock-products'}
        paginatorInfo={withdrawPaginatorInfo}
        onPagination={handlePagination}
        className="col-span-full"
        searchElement={
          <Search
            onSearch={handleSearchProduct}
            placeholderText={t('form:input-placeholder-search-name')}
            className="hidden max-w-sm sm:inline-block"
            inputClassName="!h-10"
          />
        }
      />

      {/* <TopRatedProducts
        products={topRatedProducts}
        title={'text-most-rated-products'}
        className="lg:col-span-1 lg:col-start-1 lg:row-start-5 2xl:col-span-5 2xl:col-start-auto 2xl:row-start-auto 2xl:me-20"
      /> */}
      {/* <ProductCountByCategory
        products={productByCategory}
        title={'text-most-category-products'}
        className="col-span-full 2xl:col-span-7 2xl:ltr:-ml-20 2xl:rtl:-mr-20"
      /> */}

      {/* <WithdrawTable
        withdraws={withdraws}
        title={t('table:withdraw-table-title')}
        paginatorInfo={withdrawPaginatorInfo}
        onPagination={handlePagination}
        className="col-span-full"
      /> */}
    </div>
  );
}
