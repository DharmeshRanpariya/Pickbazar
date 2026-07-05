import type {
  FlashSalePaginator,
  FlashSaleQueryOptions,
  FlashSale,
  ProductPaginator,
  FlashSaleProductsQueryOptions,
} from '@/types';
import { useQuery } from 'react-query';
import client from '@/framework/client';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { useRouter } from 'next/router';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { useInfiniteQuery } from 'react-query';

export function useFlashSales(options?: Partial<FlashSaleQueryOptions>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
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
  } = useInfiniteQuery<FlashSalePaginator, Error>(
    [API_ENDPOINTS.FLASH_SALE, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.flashSale.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    },
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    flashSales: data?.pages[0]?.data?.flatMap((page) => page) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages[0].data.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}
