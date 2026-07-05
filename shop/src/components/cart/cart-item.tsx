import { Image } from '@/components/ui/image';
import { motion } from 'framer-motion';
import { siteSettings } from '@/config/site';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/lib/motion/fade-in-out';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import { cartAnimation } from '@/lib/cart-animation';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface CartItemProps {
  item: any;
}

const CartItem = ({ item }: CartItemProps) => {
  const { t } = useTranslation('common');
  const {
    isInStock,
    clearItemFromCart,
    addItemToCart,
    getItemFromCart,
    isInCart,
    language,
  } = useCart();
  const { price } = usePrice({
    amount: item.product?.sale_price,
  });
  const { price: itemPrice } = usePrice({
    amount: item.itemTotal,
  });
  const itemQuantity = Number(
    getItemFromCart(item?.product?._id)?.quantity || 0,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleCartChange = async (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
    quantity: number,
  ) => {
    e.stopPropagation();
    if (quantity > 10) {
      toast.error(t('You cannot add more than 10 items to the cart.'));
      return;
    }
    await addItemToCart(item, quantity);
    if (!isInCart(item)) {
      cartAnimation(e);
    }
  };

  const outOfStock = !isInStock(item.id);

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex items-center border-b border-solid border-border-200 border-opacity-75 px-4 py-4 text-sm sm:px-6"
    >
      <div className="flex-shrink-0">
        <Counter
          value={itemQuantity}
          onDecrement={(e) =>
            handleCartChange(e, Math.max(itemQuantity - 1, 0))
          }
          onIncrement={(e) => handleCartChange(e, itemQuantity + 1)}
          variant="pillVertical"
          disabled={outOfStock}
        />
      </div>

      <div className="relative mx-4 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        <Image
          src={
            (item?.product?.variationId?.image[0]?.thumbnail ||
              item?.product?.image[0]?.thumbnail) ??
            siteSettings?.product?.placeholderImage
          }
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-contain"
        />
      </div>
      <div>
        {/* <h3 className="font-bold text-heading">{item.name}</h3> */}
        <h3 className="font-bold text-heading">{item?.product?.name} </h3>
        <p className="my-2.5 font-semibold text-accent">{price}</p>
        <span className="text-xs text-body">
          {item?.quantity} X {item?.product?.sale_price}
        </span>
      </div>
      <span className="font-bold text-heading ltr:ml-auto rtl:mr-auto">
        {itemPrice}
      </span>
      <button
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-0 ltr:ml-3 ltr:-mr-2 rtl:mr-3 rtl:-ml-2"
        onClick={() => clearItemFromCart(item?.product?._id)}
      >
        <span className="sr-only">{t('text-close')}</span>
        <CloseIcon className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default CartItem;
