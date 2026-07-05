import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'react-i18next';
import { CustomersIcon } from '@/components/icons/summary/customers';
import { Fragment } from 'react';
import { useRouter } from 'next/router';

interface IProps {
  refund: TodayTotalRefundByStatus;
  timeFrame?: number;
  allowedStatus: any;
}

const WidgetRefundStatus: React.FC<IProps> = ({
  refund,
  timeFrame = 1,
  allowedStatus,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  
  const safeRefund = refund || {};
  let tempContent = [];
  const widgetContents = [
    {
      key: 'pending',
      title: t('text-pending-refund'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <CustomersIcon className="h-8 w-8" />,
      color: '#FFD700',
      data: safeRefund['pending'] || 0,
      path: '/refunds?status=pending',
    },
    {
      key: 'processing',
      title: t('text-processing-refund'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <CustomersIcon className="h-8 w-8" />,
      color: '#FF4500',
      data: safeRefund['processing'] || 0,
      path: '/refunds?status=processing',
    },
    {
      key: 'approved',
      title: t('text-approved-refund'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <CustomersIcon className="h-8 w-8" />,
      color: '#32CD32',
      data: safeRefund['approved'] || 0,
      path: '/refunds?status=approved',
    },
    {
      key: 'rejected',
      title: t('text-rejected-refund'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <CustomersIcon className="h-8 w-8" />,
      color: '#DC143C',
      data: safeRefund['rejected'] || 0,
      path: '/refunds?status=rejected',
    },
  ];

  for (let index = 0; index < allowedStatus.length; index++) {
    const element = allowedStatus[index];
    const items = widgetContents.find((item) => item.key === element);
    tempContent.push(items);
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  }

  return (
    <Fragment>
      <div className="mt-5 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {tempContent && tempContent.length > 0
          ? tempContent.map((content) => {
              return (
                <div className="w-full cursor-pointer" key={content?.key} onClick={() => handleNavigation(content?.path)}>
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

export default WidgetRefundStatus;
