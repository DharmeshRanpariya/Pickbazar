import { Table } from '@/components/ui/table';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/lib/locals';
import { Image } from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
import { useModalAction } from '@/components/ui/modal/modal.context';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import {
  getReview,
  isAlreadyReviewedInThisOrder,
  reviewSystem,
} from '@/lib/get-review';
import { OrderStatus, Product, RefundStatus } from '@/types';
import classNames from 'classnames';

//FIXME: need to fix this usePrice hooks issue within the table render we may check with nested property
const OrderItemList = (record: any) => {
  const product = record?.product;
  const variationOptions = product?.variationOptions;

  const isSimpleProduct = !variationOptions || variationOptions.length === 0;

  const { price } = usePrice({
    amount: isSimpleProduct
      ? product?.sale_price ?? product?.price
      : variationOptions[0]?.sale_price ?? variationOptions[0]?.price,
  });

  let name = product?.name;
  return (
    <div className="flex items-center">
      <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded">
        <Image
          src={
            (record?.product?.variationOptions[0]?.image[0]?.thumbnail ||
              record?.product?.image[0]?.thumbnail) ??
            productPlaceholder
          }
          alt={name}
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw"
        />
      </div>

      <div className="flex flex-col overflow-hidden ltr:ml-4 rtl:mr-4">
        <div className="mb-1 flex space-x-1 rtl:space-x-reverse">
          <div className="inline-block overflow-hidden truncate text-sm text-body transition-colors">
            {name}
          </div>
          <span className="inline-block overflow-hidden truncate text-sm text-body">
            x
          </span>
          <span className="inline-block overflow-hidden truncate text-sm font-semibold text-heading">
            {record?.product?.unit}
          </span>
        </div>
        <span className="mb-1 inline-block overflow-hidden truncate text-sm font-semibold text-accent">
          {price}
        </span>
      </div>
    </div>
  );
};
export const OrderItems = ({
  products,
  orderId,
  orderStatus,
  refund,
  settings,
}: {
  products: Product[];
  orderId: any;
  orderStatus: string;
  refund: boolean;
  settings: any;
}) => {
  const { t } = useTranslation('common');
  const { alignLeft, alignRight } = useIsRTL();
  const { openModal } = useModalAction();

  const orderTableColumns = [
    {
      title: <span className="ltr:pl-20 rtl:pr-20">{t('text-item')}</span>,
      dataIndex: '',
      key: 'items',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      render: OrderItemList,
    },
    {
      title: t('text-quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 100,
      render: function renderQuantity(quantity: number) {
        return <p className="text-base">{quantity}</p>;
      },
    },
    {
      title: t('text-price'),
      dataIndex: '',
      key: 'price',
      align: alignRight,
      width: 100,
      render: function RenderPrice(record: any) {
        const product = record?.product;
        const variationOptions = product?.variationOptions;

        const isSimpleProduct =
          !variationOptions || variationOptions.length === 0;

        const totalPrice =
          (isSimpleProduct
            ? product?.sale_price ?? product?.price
            : variationOptions[0]?.sale_price ?? variationOptions[0]?.price) *
          record.quantity;

        const { price } = usePrice({
          amount: totalPrice,
        });

        return <div>{price}</div>;
      },
    },
    {
      title: 'Return Request',
      dataIndex: '',
      align: alignRight,
      width: 140,
      render: function RenderRefund(_: any, record: any) {
        const refundStatus = record?.refundStatus;
    
        if (refundStatus === RefundStatus.APPROVED) {
          return (
            <span className="text-sm font-semibold text-green-600">
              {t('text-refund-order-approved')}
            </span>
          );
        }
    
        if (refundStatus === RefundStatus.PENDING) {
          return (
            <span className="text-sm font-semibold text-yellow-600">
              {t('text-refund-order-pending')}
            </span>
          );
        }
    
        if (refundStatus === RefundStatus.REJECTED) {
          return (
            <span className="text-sm font-semibold text-red-600">
              {t('text-refund-order-rejected')}
            </span>
          );
        }
    
        if (refundStatus === RefundStatus.PROCESSING) {
          return (
            <span className="text-sm font-semibold text-blue-600">
              {t('text-refund-order-processing')}
            </span>
          );
        }
    
        if (orderStatus === OrderStatus.COMPLETED) {
          return (
            <button
              onClick={() =>
                openModal('REFUND_REQUEST', {
                  orderId,
                  order: record,
                })
              }
              className="text-sm font-semibold text-body transition-colors hover:text-accent  md:p-0"
            >
              {t('text-return-order')}
            </button>
          );
        }
      },
    },
    
    
    {
      title: '',
      dataIndex: '',
      align: alignRight,
      width: 140,
      render: function RenderReview(_: any, record: any) {
        if (refund) {
          return;
        }

        const alreadyReviewedInOrder = isAlreadyReviewedInThisOrder(
          record,
          orderId,
          settings,
        );

        function openReviewModal() {
          openModal('REVIEW_RATING', {
            product_id: record?.product?._id,
            shop_id: record.shop_id,
            order_id: orderId,
            name: record.name,
            image: record?.product?.image,
            // my_review: record?.is_digital ? getReview(record) : null,
            my_review: reviewSystem(record, settings),
            ...(record.pivot?.variation_option_id && {
              variation_option_id: record.pivot?.variation_option_id,
            }),
          });
        }

        // Button text control for digital product
        const DigitalProductReviewButtonText = () => {
          if (settings?.reviewSystem?.value === 'review_single_time') {
            return getReview(record)
              ? t('text-update-review')
              : t('text-write-review');
          }

          return !alreadyReviewedInOrder
            ? t('text-update-review')
            : t('text-write-review');
        };

        // Button text control for physical product
        const PhysicalProductReviewButtonText = () => {
          if (settings?.reviewSystem?.value === 'review_single_time') {
            return getReview(record)
              ? t('text-update-review')
              : t('text-write-review');
          }

          return alreadyReviewedInOrder
            ? t('text-already-review')
            : t('text-write-review');
        };

        if (orderStatus === OrderStatus?.COMPLETED || refund) {
          return (
            <>
              <button
                onClick={openReviewModal}
                className={classNames(
                  'cursor-pointer text-sm font-semibold text-body transition-colors hover:text-accent',
                )}
                disabled={alreadyReviewedInOrder ? true : false}
              >
                {/* {getReview(record)
                  ? t('text-update-review')
                  : t('text-write-review')} */}
                {record?.is_digital ? (
                  <DigitalProductReviewButtonText />
                ) : (
                  <PhysicalProductReviewButtonText />
                )}
              </button>
            </>
          );
        }
      },
    },
  ];

  return (
    <Table
      //@ts-ignore
      columns={orderTableColumns}
      //@ts-ignore
      data={products as Product}
      rowKey={(record: any) =>
        record?.pivot?.variation_option_id
          ? record.pivot.variation_option_id
          : record?.created_at
      }
      className="orderDetailsTable w-full"
      rowClassName="!cursor-auto"
      scroll={{ x: 350, y: 500 }}
    />
  );
};
