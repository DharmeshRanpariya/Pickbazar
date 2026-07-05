import { Shop } from '@/types';
import isEmpty from 'lodash/isEmpty';
interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
  language: string;
  in_flash_sale: boolean;
  shop: Shop;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}
export function generateCartItem(item: Item, variation: Variation) {
  const {
    _id,
    name,
    slug,
    image,
    price,
    sale_price,
    quantity,
    unit,
    is_digital,
    language,
    in_flash_sale,
    shop,
  } = item;
  if (!isEmpty(variation)) {
    return {
      product: {
        _id: `${_id}.${variation._id}`,
        name: `${name} - ${variation.title}`,
        slug,
        unit,
        is_digital: variation?.is_digital,
        image: image,
        stock: variation.quantity,
        price: Number(
          variation.sale_price ? variation.sale_price : variation.price,
        ),
        sale_price: variation.sale_price,
        variationId: variation,
        language,
        in_flash_sale,
        shop_id: shop?.id,
      },
    };
  }
  return {
    product: {
      _id,
      name,
      slug,
      unit,
      is_digital,
      image: image,
      stock: quantity,
      price: Number(sale_price ? sale_price : price),
      sale_price,
      language,
      in_flash_sale,
      shop_id: shop?.id,
    },
  };
}
