import {
  CreateRefundPolicyInput,
  QueryOptions,
  RefundPolicy,
  RefundPolicyPaginator,
  RefundPolicyQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient2 } from './http-client2';

export const RefundPolicyClient = {
  ...crudFactory<RefundPolicy, QueryOptions, CreateRefundPolicyInput>(
    API_ENDPOINTS.REFUND_POLICIES,
  ),
  paginated: ({
    target,
    title,
    status,
    ...params
  }: Partial<RefundPolicyQueryOptions>) => {
    return HttpClient2.get<RefundPolicyPaginator>(
      API_ENDPOINTS.REFUND_POLICIES,
      {
        searchJoin: 'and',
        ...params,
        title,
        target,
        status,
      },
    );
  },
};
