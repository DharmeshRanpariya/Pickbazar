import { useModalState } from '../modal/modal.context';
import { Image } from '@/components/ui/image';
import { couponPlaceholder } from '@/lib/placeholders';
import { format } from 'date-fns';

const CouponDetails = () => {
  const { data: coupon } = useModalState();

  if (!coupon) return null;

  function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minutes} ${ampm}`;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto lg:max-w-xl xl:max-w-2xl">
      <div className="relative mb-6 flex justify-center">
        <div className="rounded-lg overflow-hidden w-32 h-32 border-4 border-accent">
          <Image
            src={coupon.image?.[0]?.thumbnail ?? couponPlaceholder}
            alt={coupon.code}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <div className="text-center space-y-6 lg:space-y-8">
        <h2 className="text-3xl font-bold text-accent lg:text-2xl">
          Coupon Code: {coupon.code}
        </h2>
        <p className="text-sm text-gray-500 lg:text-base">
          Description: {coupon.description}
        </p>
        <div className="flex justify-center items-center space-x-2 text-lg lg:text-xl">
          <span className="text-gray-700 font-medium">Discount Amount:</span>
          {coupon.type.toLowerCase() === 'fixed' ? (
            <span className="font-semibold text-green-600">
              ₹{coupon.discountAmount} OFF
            </span>
          ) : (
            <span className="font-semibold text-green-600">
              {coupon.discountAmount}% OFF
            </span>
          )}
        </div>
        <p className="text-sm lg:text-base">
          Minimum Cart Amount:{' '}
          <span className="font-semibold text-heading">
            ₹{coupon.minimumCartAmount}
          </span>
        </p>
        <p className="text-sm lg:text-base">
          Coupon Type:{' '}
          <span className="font-semibold text-heading">
            {coupon.type === 'fixed' ? 'Fixed Amount' : 'Percentage'}
          </span>
        </p>
        <div className="space-y-2 text-sm lg:text-base">
          <p>
            Active From:{' '}
            <span className="font-medium text-gray-800">
              {format(new Date(coupon.activeForm), 'PPP')}
            </span>
          </p>
          <p>
            Expires On:{' '}
            <span className="font-medium text-red-500">
              {format(new Date(coupon.expireAt), 'PPP')}
            </span>
          </p>
        </div>
        <div className="space-y-2 text-sm lg:text-base">
          <p>
            Active From:{' '}
            <span className="font-medium text-gray-800">
              {formatTime(coupon.startTime)}
            </span>
          </p>
          <p>
            Expires On:{' '}
            <span className="font-medium text-red-500">
              {formatTime(coupon.endTime)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouponDetails;