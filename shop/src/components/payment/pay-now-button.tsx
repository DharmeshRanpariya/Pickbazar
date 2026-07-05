import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import { useGetPaymentIntent } from '@/framework/order';
import { Order } from '@/types';
import RazorpayPaymentModal from './razorpay/razorpay-payment-modal';
import { useState } from 'react';

interface Props {
  trackingNumber?: string;
  order: Order;
  buttonSize?: 'big' | 'medium' | 'small';
  isFetching?: boolean;
}

const PayNowButton: React.FC<Props> = ({
  order,
  buttonSize = 'small',
  isFetching,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };
  return (
    <>
      <Button
        className="w-full"
        onClick={handleClick}
        size={buttonSize}
        disabled={isFetching}
      >
        {t('text-pay-now')}
      </Button>

      {showModal && (
        <RazorpayPaymentModal
          paymentIntentInfo={order}
          trackingNumber={order.trackingNumber}
          
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default PayNowButton;
