import { useEffect, useState } from 'react';
import { Grid } from '@/components/products/grid';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import { useRouter } from 'next/router';
import client from '@/framework/client';

interface Props {
  className?: string;
  variables: any;
  column?: any;
  gridClassName?: string;
}
export default function ProductGridHome({
  className,
  variables,
  column,
  gridClassName,
}: Props) {
  const { query } = useRouter();
  const [products, setProducts] = useState(variables?.data || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<string | undefined>(
    query?.categories,
  );

  let isLoading = false;

  const loadMoreProducts = async () => {
    if (!hasMore || isLoading) return;
    isLoading = true;
    const options = {
      page: page + 1,
      limit: PRODUCTS_PER_PAGE,
      categories: query.categories,
    };
    try {
      const response = await client.products.all(options);
      const newProducts = await response.data;
      if (newProducts.length < PRODUCTS_PER_PAGE) {
        setHasMore(false);
      }
      setProducts((prevProducts) => {
        const existingProductIds = new Set(
          prevProducts.map((product) => product._id),
        );
        const filteredNewProducts = newProducts.filter(
          (product) => !existingProductIds.has(product._id),
        );
        return [...prevProducts, ...filteredNewProducts];
      });
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Failed to fetch more products:', error);
    } finally {
      isLoading = false;
    }
  };

  useEffect(() => {
    if (query?.categories !== categories) {
      getCategoriesByData();
    }
  }, [query?.categories]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.innerHeight + window.scrollY;
      if (currentScroll + 200 >= scrollHeight) {
        loadMoreProducts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [query]);

  async function getCategoriesByData() {
    const options = {
      page: 1,
      limit: PRODUCTS_PER_PAGE,
      categories: query.categories,
    };
    try {
      const response = await client.products.all(options);
      const newProducts = await response.data;
      if (newProducts.length < PRODUCTS_PER_PAGE) {
        setHasMore(false);
      }
      setProducts(newProducts);
      setCategories(query.categories);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Failed to fetch more products:', error);
    } finally {
      isLoading = false;
    }
  }

  return (
    <Grid
      products={products}
      limit={PRODUCTS_PER_PAGE}
      className={className}
      gridClassName={gridClassName}
      column={column}
    />
  );
}
