import { useModalAction } from '@/components/ui/modal/modal.context';
import type { Review, ReviewPaginator, ReviewQueryOptions } from '@/types';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from './utils/data-mappers';



export function useReview({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery<Review, Error>(
    [`${API_ENDPOINTS.PRODUCTS_REVIEWS}/product`, id],
    () => client.reviews.get({ id }),
    {
      enabled: Boolean(id),
    },
  );
  return {
    review: data,
    isLoading,
    error,
  };
}

export function useCreateReview() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { mutate: createReview, isLoading } = useMutation(
    client.reviews.create,
    {
      onSuccess: (res) => {
        toast.success(`${t('text-review-request-submitted')}`);
      },
      onSettled: () => {
        queryClient.invalidateQueries([API_ENDPOINTS.ORDERS]);
        closeModal();
      },
      onError: (error) => {
        console.log(error);
        toast.error(error?.response?.data?.message);
      },
    },
  );
  return {
    createReview,
    isLoading,
  };
}

export function useUpdateReview() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { mutate: updateReview, isLoading } = useMutation(
    client.reviews.update,
    {
      onSuccess: (res) => {
        toast.success(`${t('text-review-request-update-submitted')}`);
      },
      onSettled: () => {
        queryClient.invalidateQueries([API_ENDPOINTS.ORDERS]);
        closeModal();
      },
    },
  );
  return {
    updateReview,
    isLoading,
  };
}
