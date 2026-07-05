import { useCallback, useEffect } from 'react';
import useRazorpay, { RazorpayOptions } from '@/lib/use-razorpay';
import { formatAddress } from '@/lib/format-address';
import { PaymentGateway, PaymentIntentInfo } from '@/types';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useSettings } from '@/framework/settings';
import { useOrder } from '@/framework/order';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { HttpClient2 } from 'src/framework/rest/client/http-client2';
import { API_ENDPOINTS } from 'src/framework/rest/client/api-endpoints';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';

interface Props {
  paymentIntentInfo: PaymentIntentInfo;
  trackingNumber: string;
  paymentGateway: PaymentGateway;
}

const RazorpayPaymentModal: React.FC<Props> = ({
  trackingNumber,
  paymentIntentInfo,
  paymentGateway,
}) => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const { loadRazorpayScript, checkScriptLoaded } = useRazorpay();
  const { settings, isLoading: isSettingsLoading } = useSettings();
  const { order, isLoading, refetch } = useOrder({
    tracking_number: trackingNumber,
  });
  const router = useRouter();

  // @ts-ignore
  const { customer, billingAddress } = order ?? {};
  const paymentHandle = useCallback(async () => {
    if (!checkScriptLoaded()) {
      await loadRazorpayScript();
    }
    const amount = order?.paidTotal;

    const data = await HttpClient2.post(API_ENDPOINTS.PAYMENT_CHECKOUT, {
      amount,
    });

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
      amount: data?.amount!,
      currency: 'INR',
      name: customer.name!,
      description: `${t('text-order')}#${trackingNumber}`,
      image: settings?.logo?.original!,
      order_id: data?.id!,
      callback_url: `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/order/paymentverification`,
      prefill: {
        ...(customer.name && { name: customer.name }),
        ...(customer.phoneNumber && { contact: `+${customer.phoneNumber}` }),
        ...(customer?.email && { email: customer?.email }),
      },
      notes: {
        address: formatAddress(billingAddress as any),
      },
      theme: {
        color: '#a4562e',
      },
      handler: async (response: any) => {
        await HttpClient2.post(
          `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/order/paymentverification`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: order?._id,
          },
        );

        // Google Analytics event for successful purchase
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'purchase', {
            transaction_id: order?._id,
            value: amount / 100,
            currency: 'INR',
            payment_method: 'razorpay',
          });
        }

        closeModal();

        router.push(Routes.orders);
      },
    };

    const razorpay = (window as any).Razorpay(options);
    return razorpay.open();
  }, [isLoading, isSettingsLoading]);

  useEffect(() => {
    if (!isLoading && !isSettingsLoading) {
      (async () => {
        await paymentHandle();
      })();
    }
  }, [isLoading, isSettingsLoading]);

  if (isLoading || isSettingsLoading) {
    return <Spinner showText={false} />;
  }

  return null;
};

export default RazorpayPaymentModal;
