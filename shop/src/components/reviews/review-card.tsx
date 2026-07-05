import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { Image } from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
import { StarIcon } from '../icons/star-icon';
import { Modal, Carousel } from 'antd';
import { useState } from 'react';
import type { Review } from '@/types';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import NotFound from '../ui/not-found';

type ReviewCardProps = {
  reviews: Review[];
};

export default function ReviewCard({ reviews }: ReviewCardProps) {
  const { t } = useTranslation('common');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedImages([]);
    setSelectedImageIndex(0);
  };

  const CustomPrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-1 md:p-2 z-10" // Adjusted padding for responsiveness
    >
      <LeftOutlined style={{ fontSize: '16px' }} />{' '}
    </button>
  );

  const CustomNextArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-1 md:p-2 z-10" // Adjusted padding for responsiveness
    >
      <RightOutlined style={{ fontSize: '16px' }} />{' '}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h2 className="mb-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-heading">
        {t('text-reviews')}
      </h2>
      <div className={cn('flex flex-col space-y-4 sm:space-y-6')}>
        {isEmpty(reviews) ? (
          <div className="max-w-lg px-4 pt-6 pb-8 mx-auto bg-gray-100 lg:p-8">
            <NotFound text="text-no-review" />
          </div>
        ) : (
          reviews?.map((review) => (
            <div
              key={review.id}
              className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                <div className="mb-3 sm:mb-0">
                  <img
                    src={review.userId?.photoUrl?.thumbnail}
                    alt="User"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                </div>
                <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex-1">
                  <p className="text-base sm:text-lg md:text-xl font-bold">
                    {review.userId?.name}
                  </p>
                </div>
                <div className="inline-flex shrink-0 items-center bg-accent text-white rounded px-2 py-1 text-xs sm:px-3 sm:text-sm ml-0 sm:ml-4 mt-2 sm:mt-0">
                  {review.rating}
                  <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                </div>
              </div>

              <p className="text-sm sm:text-base mb-4 break-words whitespace-normal">
                {review.comment}
              </p>

              <div className="flex flex-wrap gap-2">
                {review.photos.map((photo, index) => (
                  <div
                    className="m-1.5 cursor-pointer"
                    key={photo._id}
                    onClick={() =>
                      handleImageClick(
                        review.photos.map(
                          (p) => p.thumbnail ?? productPlaceholder,
                        ),
                        index,
                      )
                    }
                  >
                    <Image
                      src={photo.thumbnail ?? productPlaceholder}
                      alt={`Review image ${index + 1}`}
                      width={80}
                      height={80}
                      className="inline-flex rounded-md bg-gray-200 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCloseModal}
        centered
        className="custom-modal max-w-lg w-full mx-auto"
      >
        <Carousel
          initialSlide={selectedImageIndex}
          arrows
          prevArrow={<CustomPrevArrow />}
          nextArrow={<CustomNextArrow />}
        >
          {selectedImages.map((image, index) => (
            <div key={12} className="flex justify-center items-center">
              <Image
                src={image}
                alt={`Review image ${index + 1}`}
                width={500}
                height={300}
                className="w-full h-[300px] object-cover rounded-md"
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
}
