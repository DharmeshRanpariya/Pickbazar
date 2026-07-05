import {
  CreateOrderInput,
  CreateOrderPaymentInput,
  CreateRefundInput,
  DownloadableFilePaginator,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  PaymentGateway,
  QueryOptions,
  RefundPolicyQueryOptions,
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { API_ENDPOINTS } from './client/api-endpoints';
import client from './client';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { isArray, isObject, isEmpty } from 'lodash';

export function useOrders(options?: Partial<OrderQueryOptions>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    limit: options?.limit ?? 3,
    orderBy: 'createdAt',
    sortedBy: 'desc',
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.ORDERS_MY_ORDERS, formattedOptions],
    ({ pageParam = 1 }) => {
      const params = {
        ...formattedOptions,
        page: pageParam,
      };
      return client.orders.all(params).then((response) => {
        return response;
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const current_page = lastPage.current_page || 1;
        const total = lastPage.total || 0;
        const per_page = lastPage.per_page || 10;

        const last_page = Math.ceil(total / per_page);

        const nextPage = current_page < last_page ? current_page + 1 : null;
        return nextPage;
      },
      refetchOnWindowFocus: false,
    },
  );

  const hasMore = !!hasNextPage;

  return {
    orders: data?.pages.flatMap((page) => page.data) ?? [],
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
    isLoadingMore: !!isFetchingNextPage,
    loadMore: fetchNextPage,
    hasMore,
  };
}

export function useOrder({ tracking_number }: { tracking_number: string }) {
  const { data, isLoading, error, isFetching, refetch } = useQuery<
    Order,
    Error
  >(
    [`${API_ENDPOINTS.ORDERS}/tracking/${tracking_number}`],
    () => client.orders.get(tracking_number),
    { refetchOnWindowFocus: false },
  );

  return {
    order: data,
    isFetching,
    isLoading,
    refetch,
    error,
  };
}


export function useRefunds(options: Pick<QueryOptions, 'limit'>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery(
    [API_ENDPOINTS.ORDERS_REFUNDS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.refunds(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    },
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    refunds: data?.pages?.flatMap((page) => page) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export const useDownloadableProducts = (
  options: Pick<QueryOptions, 'limit'>,
) => {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery<DownloadableFilePaginator, Error>(
    [API_ENDPOINTS.ORDERS_DOWNLOADS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.downloadable(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
      refetchOnWindowFocus: false,
    },
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    downloads: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
};

export function useCreateRefund() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { mutate: createRefundRequest, isLoading } = useMutation(
    client.orders.createRefund,
    {
      onSuccess: () => {
        toast.success(`${t('text-refund-request-submitted')}`);
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(`${t(data?.message)}`);
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
        closeModal();
      },
    },
  );
 

  function formatRefundInputs(inputs: CreateRefundInput[]) {
    console.log("Raw Input:", inputs);
  
    const refundInputs = Array.isArray(inputs) ? inputs : [inputs];
  
    refundInputs.forEach((input) => {
      const formattedInput = {
        orderId: input.orderId,
        description: input.description,
        image: Array.isArray(input.image)
          ? input.image.map((image) => ({
              thumbnail: image.thumbnail,
              original: image.original,
            }))
          : [],
        refundReason: input.refundReason,
        refundedItems: Array.isArray(input.refundedItems)
          ? input.refundedItems.map((item) => ({
              productId: item.productId,
              variationOptionsId: item.variationOptionsId,
              quantity: item.quantity,
              _id: item._id, 
            }))
          : [],
      };
      createRefundRequest(input);
    });
  }
  
  
  
  

  return {
    createRefundRequest: formatRefundInputs, // Updated to handle an array of inputs
    isLoading,
  };
}


export function useCreateOrder() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();
  const { mutate: createOrder, isLoading } = useMutation(client.orders.create, {
    onSuccess: (data) => {

      const trackingNumber = data?.trackingNumber;
      const paymentGateway = data?.paymentGateway;
      const paymentIntent = data?.paymentIntent;

      if (trackingNumber) {
        if (
          [
            PaymentGateway.COD,
            PaymentGateway.CASH,
            PaymentGateway.FULL_WALLET_PAYMENT,
          ].includes(paymentGateway as PaymentGateway)
        ) {
          return router.push(Routes.order(trackingNumber));
        }

        if (paymentIntent?.payment_intent_info?.is_redirect) {
          return router.push(
            paymentIntent?.payment_intent_info?.redirect_url as string,
          );
        } else {
          return router.push(`${Routes.order(trackingNumber)}/payment`);
        }
      } else {
        console.error('Tracking number is undefined', data);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  function formatOrderInput(input: CreateOrderInput) {
    const formattedInputs = {
      ...input,
      language: locale,
      invoice_translated_text: {
        subtotal: t('order-sub-total'),
        discount: t('order-discount'),
        tax: t('order-tax'),
        delivery_fee: t('order-delivery-fee'),
        total: t('order-total'),
        products: t('text-products'),
        quantity: t('text-quantity'),
        invoice_no: t('text-invoice-no'),
        date: t('text-date'),
      },
    };
    createOrder(formattedInputs);
  }

  return {
    createOrder: formatOrderInput,
    isLoading,
  };
}

export function useGenerateDownloadableUrl() {
  const { mutate: getDownloadableUrl } = useMutation(
    client.orders.generateDownloadLink,
    {
      onSuccess: (data) => {
        function download(fileUrl: string, fileName: string) {
          var a = document.createElement('a');
          a.href = fileUrl;
          a.setAttribute('download', fileName);
          a.click();
        }

        download(data, 'record.name');
      },
    },
  );

  function generateDownloadableUrl(digital_file_id: string) {
    getDownloadableUrl({
      digital_file_id,
    });
  }

  return {
    generateDownloadableUrl,
  };
}

export function useVerifyOrder() {
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);

  return useMutation(client.orders.verify, {
    onSuccess: (data) => {
      //@ts-ignore
      if (data?.errors as string) {
        //@ts-ignore
        toast.error(data?.errors[0]?.message);
      } else if (data) {
        // FIXME
        //@ts-ignore
        setVerifiedResponse(data);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });
}


export function useSavePaymentMethod() {
  const {
    mutate: savePaymentMethod,
    isLoading,
    error,
    data,
  } = useMutation(client.orders.savePaymentMethod);

  return {
    savePaymentMethod,
    data,
    isLoading,
    error,
  };
}

export function useGetPaymentIntentOriginal({
  tracking_number,
}: {
  tracking_number: string;
}) {
  const router = useRouter();
  const { openModal } = useModalAction();

  const { data, isLoading, error, refetch } = useQuery(
    [API_ENDPOINTS.PAYMENT_INTENT, { tracking_number }],
    () => client.orders.getPaymentIntent({ tracking_number }),
    // Make it dynamic for both gql and rest
    {
      enabled: false,
      onSuccess: (data) => {
        if (data?.payment_intent_info?.is_redirect) {
          return router.push(data?.payment_intent_info?.redirect_url as string);
        } else {
          openModal('PAYMENT_MODAL', {
            paymentGateway: data?.payment_gateway,
            paymentIntentInfo: data?.payment_intent_info,
            trackingNumber: data?.tracking_number,
          });
        }
      },
    },
  );

  return {
    data,
    getPaymentIntentQueryOriginal: refetch,
    isLoading,
    error,
  };
}

export function useGetPaymentIntent({
  tracking_number,
  payment_gateway,
  recall_gateway,
  form_change_gateway,
}: {
  tracking_number: string;
  payment_gateway: string;
  recall_gateway?: boolean;
  form_change_gateway?: boolean;
}) {
  const router = useRouter();
  const { openModal, closeModal } = useModalAction();

  const { data, isLoading, error, refetch, isFetching } = useQuery(
    [
      API_ENDPOINTS.PAYMENT_INTENT,
      { tracking_number, payment_gateway, recall_gateway },
    ],
    () =>
      client.orders.getPaymentIntent({
        tracking_number,
        payment_gateway,
        recall_gateway,
      }),
    // Make it dynamic for both gql and rest
    {
      enabled: false,
      onSuccess: (item) => {
        let data: any = '';
        if (isArray(item)) {
          data = { ...item };
          data = isEmpty(data) ? [] : data[0];
        } else if (isObject(item)) {
          data = item;
        }
        if (data?.payment_intent_info?.is_redirect) {
          return router.push(data?.payment_intent_info?.redirect_url as string);
        } else {
          if (recall_gateway) window.location.reload();
          openModal('PAYMENT_MODAL', {
            paymentGateway: data?.payment_gateway,
            paymentIntentInfo: data?.payment_intent_info,
            trackingNumber: data?.tracking_number,
          });
        }
      },
    },
  );

  return {
    data,
    getPaymentIntentQuery: refetch,
    isLoading,
    fetchAgain: isFetching,
    error,
  };
}
