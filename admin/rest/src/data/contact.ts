import { ContactPaginator, ContactQueryOptions } from '@/types';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { mapPaginatorData } from '@/utils/data-mappers';
import { ContactClient } from './client/contact';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const useContactQuery = (options: Partial<ContactQueryOptions>) => {
  const { data, error, isLoading } = useQuery<ContactPaginator, Error>(
    [API_ENDPOINTS.CONTACT, options],
    ({ queryKey, pageParam }) =>
      ContactClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );
  return {
    contact: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation(ContactClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CONTACT);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};
