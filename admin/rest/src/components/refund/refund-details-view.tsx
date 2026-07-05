import Card from '@/components/common/card';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import ValidationError from '@/components/ui/form-validation-error';
import { useTranslation } from 'next-i18next';
import SelectInput from '@/components/ui/select-input';
import { useIsRTL } from '@/utils/locals';
import { useUpdateRefundMutation } from '@/data/refund';
import { useModalAction } from '@/components/ui/modal/modal.context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Badge from '@/components/ui/badge/badge';
import StatusColor from '@/components/order/status-color';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const RefundStatus = [
  {
    value: 'approved',
    name: 'Approved',
  },
  {
    value: 'pending',
    name: 'Pending',
  },
  {
    value: 'rejected',
    name: 'Rejected',
  },
  {
    value: 'processing',
    name: 'Processing',
  },
];

type FormValues = {
  status: any;
};

export default function RefundDetailsView({
  refund,
  canChangeStatus = true,
}: any) {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { alignLeft, alignRight } = useIsRTL();
  const { openModal } = useModalAction();
  const { mutate: updateRefund, isLoading: updating } =
    useUpdateRefundMutation();

  async function handleUpdateRefundStatus({ status }: any) {
    const input = {
      status: status?.value,
    };

    const id = query.refundId as string;

    updateRefund(
      {
        id,
        ...input,
      },
      {
        onError: (error: any) => {
          setError('status', {
            type: 'manual',
            message: error?.response?.data?.message,
          });
        },
      },
    );
  }

  const handleImageClick = (idx: number) => {
    openModal('REFUND_IMAGE_POPOVER', {
      images: refund?.image,
      initSlide: idx,
    });
  };

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      status: RefundStatus.find(
        (status) =>
          refund?.status?.toUpperCase() === status.value.toUpperCase(),
      ),
    },
  });
  const sale_price =
    refund?.variationOptionsId?.sale_price || refund?.productId?.sale_price;

  const totalQuantity = refund?.orderId?.items?.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  const calculateCouponDiscount = refund.orderId.discount / totalQuantity * refund.quantity;

  const calculateFlashSaleDiscount = refund.orderId.flashSaleDiscount / totalQuantity * refund.quantity;

  const subtotal = refund?.quantity * sale_price;

  const total = subtotal - (calculateCouponDiscount + calculateFlashSaleDiscount);

  const { price: discount } = usePrice(
    refund && {
      amount: calculateCouponDiscount!,
    },
  );

  const { price: flash_sale_discount } = usePrice(
    refund && {
      amount: calculateFlashSaleDiscount,
    },
  );

  const { price: delivery_fee } = usePrice(
    refund && {
      amount: refund?.orderId?.deliveryFee!,
    },
  );
  const { price: sales_tax } = usePrice(
    refund && {
      amount: refund?.orderId?.salesTax!,
    },
  );

  const columns = [
    {
      dataIndex: 'product',
      key: 'product',
      width: 70,
      render: (product: any) => (
        <Image
          src={product?.image[0]?.thumbnail ?? siteSettings.product.placeholder}
          alt="alt text"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: t('table:table-item-products'),
      dataIndex: 'product',
      key: 'product',
      align: alignLeft,
      render: (product: any, item: any) => (
        <div>
          <span>{product.name}</span>
          <span className="mx-2">x</span>
          <span className="font-semibold text-heading">{item.quantity}</span>
        </div>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'product',
      key: 'product',
      align: alignRight,
      render: function Render(_: any, item: any) {
        const { price } = usePrice({
          amount: item.product.sale_price,
        });
        return <span>{price}</span>;
      },
    },
  ];

  return (
    <Card>
      <div className="mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8">
        <div className="bg-[#F7F8FA] px-8 py-4 text-base font-bold text-heading capitalize">
          <span className="mb-2 block lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
            {t('text-refund-status')} :
          </span>
          <Badge text={t(refund?.status)} color={StatusColor(refund?.status)} />
        </div>
      </div>
      <div className="flex flex-col items-center lg:flex-row">
        <h3 className="mb-8 w-full whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-0 lg:w-1/3 lg:text-start">
          {t('common:text-refund-id')} - #{refund?._id}
        </h3>

        {refund?.status && canChangeStatus && (
          <form
            onSubmit={handleSubmit(handleUpdateRefundStatus)}
            className="flex w-full flex-col ms-auto sm:flex-row sm:justify-end lg:w-2/3 xl:w-1/2"
          >
            <div className="z-20 w-full me-5 lg:max-w-[280px]">
              <SelectInput
                name="status"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.value}
                options={RefundStatus}
                placeholder={t('common:text-refund-status')}
                rules={{
                  required: t('common:text-status-required'),
                }}
              />
              {errors?.status?.message && (
                <ValidationError message={t(`${errors?.status?.message}`)} />
              )}
            </div>
            <Button
              loading={updating}
              className="mt-2 w-full sm:mt-0 sm:w-auto"
            >
              <span>{t('form:button-label-change-status')}</span>
            </Button>
          </form>
        )}
      </div>

      <div className="mt-10 mb-9 md:my-10 flex flex-col">
        <div className="flex flex-col gap-3.5">
          <p className="flex flex-col text-sm text-sub-heading sm:flex-row sm:items-center">
            <span className="mb-2 min-w-[180px] font-medium sm:mb-0">
              {t('common:text-refund-created')}
            </span>
            <span className="mx-2 hidden sm:block">: </span>
            <span className="md:pl-10 capitalize">
              {dayjs
                .utc(refund?.orderId?.createdAt)
                .tz(dayjs.tz.guess())
                .format('DD MMMM YYYY')}
            </span>
          </p>
          <p className="flex flex-col text-sm text-sub-heading sm:flex-row sm:items-center">
            <span className="mb-2 min-w-[180px] font-medium sm:mb-0">
              {t('common:text-order-created')}
            </span>
            <span className="mx-2 hidden sm:block">: </span>
            <span className="md:pl-10 capitalize">
              {dayjs
                .utc(refund?.orderId?.createdAt)
                .tz(dayjs.tz.guess())
                .format('DD MMMM YYYY')}
            </span>
          </p>
          <p className="flex flex-col text-sm text-sub-heading sm:flex-row sm:items-center">
            <span className="mb-2 min-w-[180px] font-medium sm:mb-0">
              {t('table:table-item-tracking-number')}
            </span>
            <span className="mx-2 hidden sm:block">: </span>
            <span className="md:pl-10 capitalize">
              {refund?.orderId?.trackingNumber}
            </span>
          </p>
          <p className="flex flex-col text-sm text-sub-heading sm:flex-row sm:items-center">
            <span className="mb-2 min-w-[180px] font-medium sm:mb-0">
              {t('common:text-customer-email')}
            </span>
            <span className="mx-2 hidden sm:block">: </span>
            <span className="md:pl-10">
              {refund?.orderId?.customer?.email}
            </span>
          </p>
          <p className="flex flex-col text-sm text-sub-heading sm:flex-row sm:items-center">
            <span className="mb-2 min-w-[180px] font-medium sm:mb-0">
              {t('form:input-label-contact')}
            </span>
            <span className="mx-2 hidden sm:block">: </span>
            <span className="md:pl-10 capitalize">
              {refund?.orderId?.customerContact}
            </span>
          </p>
        </div>
      </div>

      {/* Reason with description */}
      <div className="mb-10 flex flex-col">
        <p className="mb-9 flex flex-col text-sub-heading">
          <span className="mb-3 text-lg font-semibold">
            {t('common:text-reason')}
          </span>
          <span className="text-sm">
            {refund?.refundReason ?? refund?.refund_reason?.name}
          </span>
        </p>
        <p className="mb-9 flex flex-col text-sub-heading">
          <span className="mb-3 text-lg font-semibold">
            {t('form:input-description')}
          </span>
          <span className="text-sm leading-[1.8]">{refund?.description}</span>
        </p>

        <div className="flex flex-col">
          <span className="mb-4 text-lg font-semibold text-sub-heading">
            {t('common:text-images')}
          </span>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-6 3xl:grid-cols-8">
            {refund?.image?.map((img: any, idx: number) => (
              <div
                key={img?._id}
                className="relative cursor-pointer rounded-lg bg-gray-100"
                onClick={() => handleImageClick(idx)}
              >
                <Image
                  src={img?.original ?? '/'}  
                  alt={refund?.title!}
                  width={400}
                  height={400}
                  className="overflow-hidden rounded object-contain"
                />
              </div>
            ))}

            {!refund?.image?.length && (
              <span className="text-sm text-gray-400">
                {t('common:text-no-image-found')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10">
        <span className="mb-4 flex w-56 overflow-hidden text-lg font-semibold text-sub-heading">
          {t('common:text-order-details')}
        </span>
        <div className="flex w-full flex-col space-y-2 py-4 ms-auto sm:w-1/2 sm:px-4 md:w-1/3 border-t-4 border-double border-border-200">
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-sub-total')}</span>
            <span className="text-sub-heading font-semibold">{subtotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-tax')}</span>
            <span className="text-sub-heading font-semibold">{sales_tax}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-delivery-fee')}</span>
            <span className="text-sub-heading font-semibold">
              {delivery_fee}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-discount')}</span>
            <span className="text-sub-heading font-semibold">{discount}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-flashSaleDiscount')}</span>
            <span className="text-sub-heading font-semibold">
              {flash_sale_discount}
            </span>
          </div>
          <div className="flex items-center justify-between font-semibold text-sub-heading">
            <span>{t('common:order-total')}</span>
            <span>{Number(total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="mb-10 w-full sm:mb-0 sm:w-1/2 sm:pe-8">
          <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
            {t('common:billing-address')}
          </h3>

          <div className="flex flex-col items-start space-y-1 text-sm text-body">
            <span>{refund?.orderId?.customer?.name}</span>
            {refund?.orderId?.billingAddress && (
              <span>{formatAddress(refund.orderId.billingAddress)}</span>
            )}
            {refund?.orderId?.customer?.phoneNumber && (
              <span>{refund?.orderId?.customer?.phoneNumber}</span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-1/2 sm:ps-8">
          <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading text-start sm:text-end">
            {t('common:shipping-address')}
          </h3>

          <div className="flex flex-col items-start space-y-1 text-sm text-body text-start sm:items-end sm:text-end">
            <span>{refund?.orderId?.customer?.name}</span>
            {refund?.orderId?.shippingAddress && (
              <span>{formatAddress(refund.orderId.shippingAddress)}</span>
            )}
            {refund?.orderId?.customer?.phoneNumber && (
              <span>{refund?.order?.customer?.phoneNumber}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
