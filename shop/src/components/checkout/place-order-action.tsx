import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { useCreateOrder } from '@/framework/order';
import ValidationError from '@/components/ui/validation-error';
import Button from '@/components/ui/button';
import { formatOrderedProduct } from '@/lib/format-ordered-product';
import { useCart } from '@/store/quick-cart/cart.context';
import { checkoutAtom, discountAtom, walletAtom } from '@/store/checkout';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/store/quick-cart/cart.utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useLogout, useUser } from '@/framework/user';
import { CouponType, PaymentGateway } from '@/types';
import { useSettings } from '@/framework/settings';
import Cookies from 'js-cookie';
import { REVIEW_POPUP_MODAL_KEY } from '@/lib/constants';
import usePrice from '@/lib/use-price';

export const PlaceOrderAction: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = (props) => {
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createOrder, isLoading } = useCreateOrder();
  const { locale }: any = useRouter();
  const { items = [] } = useCart();
  const { me } = useUser();

  const [
    {
      billing_address,
      shipping_address,
      coupon,
      verified_response,
      customerContact,
      customerName,
      payment_gateway,
      payment_sub_gateway,
      note,
      token,
      payable_amount,
    },
  ] = useAtom(checkoutAtom);
  const [discount] = useAtom(discountAtom);
  const [use_wallet_points] = useAtom(walletAtom);
  useEffect(() => {
    setErrorMessage(null);
  }, [payment_gateway]);

  const available_items =
    items?.filter(
      (item) =>
        item && !verified_response?.unavailable_products?.includes(item.id),
    ) || [];

  const subtotal = calculateTotal(available_items);
  let calculateDiscount = 0;
  switch (coupon?.type) {
    case CouponType.PERCENTAGE:
      calculateDiscount = (subtotal * Number(discount)) / 100;
      break;
    case CouponType.FREE_SHIPPING:
      calculateDiscount = verifiedResponse
        ? verifiedResponse.shipping_charge
        : 0;
      break;
    default:
      calculateDiscount = Number(discount);
  }

  const { settings } = useSettings();
  const freeShippingAmount = settings?.freeShippingAmount;
  const freeShipping = settings?.freeShipping;
  let freeShippings = freeShipping && Number(freeShippingAmount) <= subtotal;
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal,
      tax: verified_response?.total_tax!,
      shipping_charge: verified_response?.shipping_charge!,
    },
    Number(calculateDiscount),
  );
  const handlePlaceOrder = () => {
    if (!customerContact) {
      setErrorMessage('Contact Number Is Required');
      return;
    }
    if (!use_wallet_points && !payment_gateway) {
      setErrorMessage('Gateway Is Required');
      return;
    }

    const isFullWalletPayment = use_wallet_points && payable_amount === 0;
    const gateWay = isFullWalletPayment
      ? PaymentGateway.FULL_WALLET_PAYMENT
      : payment_gateway;

    let input = {
      //@ts-ignore
      products: available_items?.map((item) => ({
        ...formatOrderedProduct(item),
        variationOptionsId: item.product.variationId?._id,
        refundStatus: item.refundStatus,
      })),
      amount: subtotal,
      couponId: coupon?._id,
      discount: calculateDiscount ?? 0,
      paidTotal: total,
      salesTax: verified_response?.total_tax,
      deliveryFee: freeShippings ? 0 : verified_response?.shipping_charge,
      total,
      customerContact,
      customerName,
      note,
      paymentGateway: gateWay,
      payment_sub_gateway,
      use_wallet_points,
      isFullWalletPayment,
      billingAddress: {
        ...(billing_address && billing_address),
      },
      shippingAddress: {
        ...(shipping_address && shipping_address),
      },
    };
    delete input.billingAddress.__typename;
    delete input.shippingAddress.__typename;

    try {
      const response = createOrder(input);
      if (response) {
        // Trigger Google Analytics event after order is successfully created
        window.gtag('event', 'purchase', {
          transaction_id: response.order_id,
          value: total,
          currency: 'INR',
          payment_method: gateWay,
          items: available_items.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        });
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      setErrorMessage('Order creation failed. Please try again.'); // Optional user feedback
    }
    Cookies.remove(REVIEW_POPUP_MODAL_KEY);
  };

  const isDigitalCheckout = available_items.find((item) =>
    Boolean(item.is_digital),
  );

  let formatRequiredFields = isDigitalCheckout
    ? [customerContact, payment_gateway]
    : [
        customerContact,
        payment_gateway,
        billing_address,
        shipping_address,
        available_items,
      ];
  if (!isDigitalCheckout && !me) {
    formatRequiredFields.push(customerName);
  }

  const isAllRequiredFieldSelected = formatRequiredFields.every(
    (item) => !isEmpty(item),
  );
  return (
    <>
      <Button
        loading={isLoading}
        className={classNames('mt-5 w-full', props.className)}
        onClick={handlePlaceOrder}
        disabled={!isAllRequiredFieldSelected || !!isLoading}
        {...props}
      />
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
      {!isAllRequiredFieldSelected && (
        <div className="mt-3">
          <ValidationError message={t('text-place-order-helper-text')} />
        </div>
      )}
    </>
  );
};
