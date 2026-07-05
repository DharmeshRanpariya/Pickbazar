import { PaymentStatus } from '@/types';

export const ORDER_STATUS = [
  { name: 'text-order-pending', status: 'order-pending', serial: 1 },
  { name: 'Placed', status: 'order-placed', serial: 2 },
  { name: 'text-order-processing', status: 'order-processing', serial: 3 },
  {
    name: 'text-order-at-local-facility',
    status: 'order-at-local-facility',
    serial: 4,
  },
  {
    name: 'text-order-out-for-delivery',
    status: 'order-out-for-delivery',
    serial: 5,
  },
  { name: 'text-order-completed', status: 'order-completed', serial: 6 },
  { name: 'text-order-cancelled', status: 'order-cancelled', serial: 6 },
  { name: 'text-order-refunded', status: 'order-refunded', serial: 6 },
  { name: 'text-order-failed', status: 'order-failed', serial: 6 },
];

export const filterOrderStatus = (
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number
) => {
  if ([PaymentStatus.SUCCESS, PaymentStatus.COD].includes(paymentStatus)) {
    return currentStatusIndex > 5
      ? [...orderStatus.slice(0, 5), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 6);
  }

  return currentStatusIndex > 5
    ? [...orderStatus.slice(0, 3), orderStatus[currentStatusIndex]]
    : orderStatus.slice(0, 6);
};
