import type { ProductPaginator, ProductQueryOptions } from '@/types';
import { useInfiniteQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { formatProductsArgs } from '@/framework/utils/format-products-args';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useProducts(options?: Partial<ProductQueryOptions>) {
  const { locale } = useRouter();
  const formattedOptions = {
    ...formatProductsArgs(options),
    language: locale,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS, formattedOptions],
    ({ pageParam = 1 }) => {
      const params = {
        ...formattedOptions,
        page: pageParam,
      };
      return client.products.all(params);
    },
    {
      getNextPageParam: (lastPage) => {
        const { current_page, total, per_page } = lastPage;
        const totalPages = Math.ceil(total / per_page);
        return current_page < totalPages ? current_page + 1 : null;
      },
      refetchOnWindowFocus: false,
    },
  );

  const isLoadingMore = !!isFetchingNextPage;
  const hasMore = !!hasNextPage;

  function handleLoadMore() {
    if (hasMore) {
      fetchNextPage();
    }
  }

  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.innerHeight + window.scrollY;

      if (currentScroll + 200 >= scrollHeight && !isFetchingNextPage) {
        handleLoadMore();
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFetchingNextPage, hasMore]);

  return {
    products: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: data
      ? {
          total: data.pages[0].total,
          current_page: data.pages[data.pages.length - 1].current_page,
          count: data.pages[data.pages.length - 1].count,
          per_page: data.pages[0].per_page,
          pages: data.pages[0].pages,
        }
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore,
    loadMore: handleLoadMore,
    hasMore,
  };
}
