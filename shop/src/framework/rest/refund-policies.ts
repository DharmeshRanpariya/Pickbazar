import { mapPaginatorData } from '@/framework/utils/data-mappers';
import type { RefundPolicyPaginator, RefundPolicyQueryOptions } from '@/types';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';

export function useRefundPolicies(options?: Partial<RefundPolicyQueryOptions>) {
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
  } = useInfiniteQuery<RefundPolicyPaginator, Error>(
    [API_ENDPOINTS.REFUND_POLICIES, formattedOptions],
    ({ pageParam = 1 }) => {
      const params = {
        ...formattedOptions,
        page: pageParam,
      };
      return client.refundPolicies.all(params);
    },
    {
      getNextPageParam: (lastPage) => {
        const { current_page, total, per_page } = lastPage;
        const totalPages = Math.ceil(total / per_page);
        return current_page < totalPages ? current_page + 1 : null;
      },
    },
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  const isLoadingMore = !!isFetchingNextPage;
  const hasMore = !!hasNextPage;

  return {
    refundPolicies: data?.pages?.flatMap((page) => page.data) ?? [],
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
