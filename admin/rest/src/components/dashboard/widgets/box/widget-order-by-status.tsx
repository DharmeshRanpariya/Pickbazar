import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'react-i18next';
import { TodayTotalOrderByStatus } from '@/types';
import { Fragment } from 'react';
import { OrderProcessedIcon } from '@/components/icons/summary/order-processed';
import { CustomersIcon } from '@/components/icons/summary/customers';
import { ChecklistIcon } from '@/components/icons/summary/checklist';
import { EaringIcon } from '@/components/icons/summary/earning';
import { useRouter } from 'next/router';

interface IProps {
  order: TodayTotalOrderByStatus;
  timeFrame?: number;
  allowedStatus: any;
}

const WidgetOrderByStatus: React.FC<IProps> = ({
  order,
  timeFrame = 1,
  allowedStatus,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const safeOrder = order || {};
  let tempContent = [];
  const widgetContents = [
    {
      key: 'pending',
      title: t('text-pending-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <ChecklistIcon className="h-8 w-8" />,
      color: '#0094FF',
      data: safeOrder['order-pending'] || 0,
      path: '/orders?status=order-pending',
    },
    {
      key: 'processing',
      title: t('text-processing-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <CustomersIcon className="h-8 w-8" />,
      color: '#28B7FF',
      data: safeOrder['order-processing'] || 0,
      path: '/orders?status=order-processing',
    },
    {
      key: 'complete',
      title: t('text-completed-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#FF8D29',
      data: safeOrder['order-completed'] || 0,
      path: '/orders?status=order-completed',
    },
    {
      key: 'cancel',
      title: t('text-cancelled-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <EaringIcon className="h-8 w-8" />,
      color: '#D7E679',
      data: safeOrder['order-cancelled'] || 0,
      path: '/orders?status=order-cancelled',
    },
    {
      key: 'refund',
      title: t('text-refunded-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#A7F3D0',
      data: safeOrder['order-refunded'] || 0,
      path: '/orders?status=order-refunded',
    },
    {
      key: 'fail',
      title: t('text-failed-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#A7F3D0',
      data: safeOrder['order-failed'] || 0,
      path: '/orders?status=order-failed',
    },
    {
      key: 'local-facility',
      title: t('text-order-local-facility'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#A7F3D0',
      data: safeOrder['order-at-local-facility'] || 0,
      path: '/orders?status=at-local-facility',
    },
    {
      key: 'placed',
      title: t('text-order-placed'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#A7F3D0',
      data: safeOrder['order-placed'] || 0,
      path: '/orders?status=order-placed',
    },
  ];

  for (let index = 0; index < allowedStatus.length; index++) {
    const element = allowedStatus[index];
    const items = widgetContents.find((item) => item.key === element);
    tempContent.push(items);
  }

  const handleNavigation = (path: string) => {
    router.push(path); 
  };

  return (
    <Fragment>
      <div className="mt-5 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {tempContent && tempContent.length > 0
          ? tempContent.map((content) => {
            return (
              <div className="w-full cursor-pointer" key={content?.key} onClick={() => handleNavigation(content?.path!)}>
                <StickerCard
                  titleTransKey={content?.title}
                  subtitleTransKey={content?.subtitle}
                  icon={content?.icon}
                  color={content?.color}
                  price={content?.data}
                />
              </div>
            );
          })
          : ''}
      </div>
    </Fragment>
  );
};

export default WidgetOrderByStatus;