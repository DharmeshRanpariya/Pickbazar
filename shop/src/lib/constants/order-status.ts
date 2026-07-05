import { PaymentStatus } from '@/types';

export const ORDER_STATUS = [
  { name: 'Pending', status: 'order-pending', serial: 1 },
  { name: 'Placed', status: 'order-placed', serial: 2 },
  { name: 'Processing', status: 'order-processing', serial: 3 },
  {
    name: 'At Local Facility',
    status: 'order-at-local-facility',
    serial: 4,
  },
  {
    name: 'Out For Delivery',
    status: 'order-out-for-delivery',
    serial: 5,
  },
  { name: 'Completed', status: 'order-completed', serial: 6 },
  { name: 'Cancelled', status: 'order-cancelled', serial: 6 },
  { name: 'Refunded', status: 'order-refunded', serial: 6 },
  { name: 'Failed', status: 'order-failed', serial: 6 },
];

export const filterOrderStatus = (
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number,
) => {
  if ([PaymentStatus.SUCCESS].includes(paymentStatus)) {
    return currentStatusIndex > 5
      ? [...orderStatus.slice(0, 5), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 6);
  }

  return currentStatusIndex > 5
    ? [...orderStatus.slice(0, 3), orderStatus[currentStatusIndex]]
    : orderStatus.slice(0, 6);
};
