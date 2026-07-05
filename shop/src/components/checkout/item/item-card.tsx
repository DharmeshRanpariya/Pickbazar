import usePrice from '@/lib/use-price';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { Image } from '@/components/ui/image';
interface Props {
  item: any;
  notAvailable?: boolean;
}

const ItemCard = ({ item, notAvailable }: Props) => {
  const { t } = useTranslation('common');
  const itemTotal = item.quantity * (item.product?.sale_price || 0);
  const { price } = usePrice({
    amount: itemTotal,
  });
  return (
    <div className="flex justify-between py-2">
      <div className="flex items-center justify-between text-base">
        <span
          className={cn('text-sm', notAvailable ? 'text-red-500' : 'text-body')}
        >
          <div className="flex items-center">
            <div className="flex">
              <div className="relative flex-shrink-0 h-8 w-8 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
                <Image
                  src={
                    (item?.product?.variationId?.image[0]?.thumbnail ||
                      item?.product?.image[0]?.thumbnail)

                  }
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw"
                  className="object-contain"
                />
              </div>
              <div className="flex-1 px-4">
                <h3 className="font-bold text-heading">
                  {item?.product?.name}
                </h3>
                <p className="font-bold text-accent">
                  {item?.product?.sale_price}
                </p>
                <span className="text-xs text-body">
                  {item?.quantity} X {item?.product?.sale_price}
                </span>
              </div>
            </div>
          </div>
        </span>
      </div>
      <div className="right-0">
        <p className=" font-semibold text-accent right-0">{price}</p>
        <span> {item?.in_flash_sale ? '(On Sale)' : ''} </span>
      </div>
    </div>
  );
};

export default ItemCard;
