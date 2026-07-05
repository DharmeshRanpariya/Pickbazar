import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { CheckedIcon } from '@/components/icons/checked';
import isEmpty from 'lodash/isEmpty';
import { productPlaceholder } from '@/utils/placeholders';
import { useState } from 'react';
import { Carousel, Modal } from 'antd';
import { ChevronLeft } from '@/components/icons/chevron-left';
import { ChevronRight } from '../icons/chevron-right';

type ReviewCardProps = {
  className?: any;
  review: any;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { t } = useTranslation();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    comment,
    photos,
    positive_feedbacks_count,
    negative_feedbacks_count,
    userId,
  } = review;

  function handleImageClick(images: string[], index: number) {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
    setSelectedImages([]);
    setSelectedImageIndex(0);
  }

  const CustomPrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-1 md:p-2 z-10"
    >
      <ChevronLeft className='w-4 h-4' />{' '}
    </button>
  );

  const CustomNextArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-1 md:p-2 z-10"
    >
      <ChevronRight className='w-4 h-4' />{' '}
    </button>
  );

  return (
    <div className="block">
      <div className="mb-3 flex items-center text-xs text-gray-500">
        {t('common:text-by')}{' '}
        <span className="font-semibold capitalize text-heading ltr:ml-1 rtl:mr-1">
          {userId?.name ? userId?.name : t('common:text-guest')}
        </span>
        {userId?.is_active && (
          <CheckedIcon className="h-[13px] w-[13px] text-gray-700 ltr:ml-1 rtl:mr-1" />
        )}
      </div>
      <p className="text-sm leading-6 text-heading">{comment}</p>
      {photos && !isEmpty(photos) && (
        <div className="flex items-start pt-3 space-s-2">
          {photos?.map((photo: any, idx: any) => (
            <div
              className="mb-1"
              key={idx}
              onClick={() =>
                handleImageClick(
                  photos.map(
                    (p) => p.thumbnail ?? productPlaceholder
                  ),
                  idx,
                )
              }
            >
              <Image
                src={photo?.original ?? '/product-placeholder-borderless.svg'}
                width={32}
                height={32}
                className="inline-flex rounded-md bg-gray-200"
                alt={review?.product?.name}
              />
            </div>
          ))}
        </div>
      )}
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCloseModal}
        centered
        className='custom-modal max-w-lg w-full mx-auto'
      >
        <Carousel
          initialSlide={selectedImageIndex}
          arrows
          prevArrow={<CustomPrevArrow />}
          nextArrow={<CustomNextArrow />}
        >
          {selectedImages.map((image, index) => (
            <div key={12} className='flex justify-center items-center'>
              <Image
                src={image}
                alt={`Review image ${index + 1}`}
                width={1000}
                height={1000}
                className='w-full h-[300px] object-cover rounded-md'
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
};

export default ReviewCard;
