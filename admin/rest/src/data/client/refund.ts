import type {
  QueryOptions,
  Order,
  CreateOrderInput,
  OrderQueryOptions,
  OrderPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient2 } from './http-client2';

export const refundClient = {
  ...crudFactory<Order, QueryOptions, CreateOrderInput>(API_ENDPOINTS.REFUNDS),
  get({ id }: { id: string }) {
    return HttpClient2.get<Order>(`${API_ENDPOINTS.REFUNDS}/${id}`);
  },
  paginated: ({
    type,
    name,
    shop_id,
    refundReason,
    status,
    ...params
  }: Partial<OrderQueryOptions>) => {
    return HttpClient2.get<OrderPaginator>(API_ENDPOINTS.REFUNDS, {
      refundReason,
      status
    });
  },
};
