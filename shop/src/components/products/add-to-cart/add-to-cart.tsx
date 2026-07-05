import { cartAnimation } from '@/lib/cart-animation';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import Link from 'next/link';
import { PlusIconNew } from '@/components/icons/plus-icon';
import { MinusIconNew } from '@/components/icons/minus-icon';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'react-toastify';
const AddToCartBtn = dynamic(
  () => import('@/components/products/add-to-cart/add-to-cart-btn'),
  {
    ssr: false,
  },
);
const Counter = dynamic(() => import('@/components/ui/counter'), {
  ssr: false,
});

interface Props {
  data: any;
  variant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'big'
    | 'text'
    | 'florine';
  counterVariant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'details'
    | 'florine';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
}

export const AddToCart = ({
  data,
  variant = 'helium',
  counterVariant,
  counterClass,
  variation,
  disabled,
}: Props) => {
  const { t } = useTranslation('common');
  const { addItemToCart, isInStock, getItemFromCart, isInCart, language } =
    useCart();
  const [loading, setLoading] = useState(false);
  const item = generateCartItem(data, variation);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const itemQuantity = Number(
    getItemFromCart(item?.product?._id)?.quantity || 0,
  );

  const handleCartChange = async (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
    quantity: number,
  ) => {
    e.stopPropagation();
    if (quantity > 10) {
      toast.error(t('You cannot add more than 10 items to the cart.'));
      return;
    }
    setLoading(true);
    try {
      await addItemToCart(item, quantity);
      if (!isInCart(item)) {
        cartAnimation(e);

        window.gtag('event', 'add_to_cart', {
          currency: 'USD', 
          value: item.price, 
          items: [{
            id: item.product._id,
            name: item.product.name, 
            category: item.product.category, 
            quantity: quantity, 
          }],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const outOfStock = isInCart(item?.id) && !isInStock(item.id);
  const disabledState =
    disabled || outOfStock || data.status?.toLowerCase() != 'publish';
  return !isInCart(item?.product._id) || itemQuantity === 0 ? (
    <div>
      {!data?.is_external || !data?.external_product_url ? (
        variant !== 'florine' ? (
          <AddToCartBtn
            disabled={disabledState}
            variant={variant}
            onClick={(e) => handleCartChange(e, 1)}
            loading={loading}
          />
        ) : (
          <div></div>
          // <div className="flex w-24 items-center justify-between rounded-[0.25rem] border border-[#dbdbdb]">
          //   <button
          //     className={classNames(
          //       'p-2 text-base',
          //       disabledState || !isInCart(item?.id)
          //         ? 'cursor-not-allowed text-[#c1c1c1]'
          //         : 'text-accent',
          //     )}
          //     disabled={disabledState || !isInCart(item?.id)}
          //     onClick={handleRemoveClick}
          //   >
          //     <span className="sr-only">{t('text-minus')}</span>
          //     <MinusIconNew />
          //   </button>
          //   <div className="text-sm uppercase text-[#666]">Add</div>
          //   <button
          //     className={classNames(
          //       'p-2 text-base',
          //       disabledState
          //         ? 'cursor-not-allowed text-[#c1c1c1]'
          //         : 'text-accent',
          //     )}
          //     disabled={disabledState}
          //     onClick={handleAddClick}
          //   >
          //     <span className="sr-only">{t('text-plus')}</span>
          //     <PlusIconNew />
          //   </button>
          // </div>
        )
      ) : (
        <Link
          href={data?.external_product_url}
          target="_blank"
          className="inline-flex h-10 !shrink items-center justify-center rounded border border-transparent bg-accent px-5 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-accent-hover focus:shadow focus:outline-0 focus:ring-1 focus:ring-accent-700"
        >
          {data?.external_product_button_text}
        </Link>
      )}
    </div>
  ) : (
    <>
      <Counter
        value={itemQuantity}
        onDecrement={(e) => handleCartChange(e, Math.max(itemQuantity - 1, 0))}
        onIncrement={(e) => handleCartChange(e, itemQuantity + 1)}
        variant={counterVariant || variant}
        className={counterClass}
        disabled={outOfStock}
        loading={loading}
      />
    </>
  );
};
