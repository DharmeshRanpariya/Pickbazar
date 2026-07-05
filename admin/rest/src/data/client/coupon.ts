import {
  Coupon,
  CouponInput,
  CouponPaginator,
  CouponQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { VerifyCouponInputType, VerifyCouponResponse } from '@/types';
import { HttpClient2 } from './http-client2';

export const couponClient = {
  ...crudFactory<Coupon, any, CouponInput>(API_ENDPOINTS.COUPONS),
  get({ code, language }: { code: string; language: string }) {
    return HttpClient2.get<Coupon>(`${API_ENDPOINTS.COUPONS}/${code}`, {
      language,
    });
  },
  paginated: ({ code, ...params }: Partial<CouponQueryOptions>) => {
    return HttpClient2.get<CouponPaginator>(API_ENDPOINTS.COUPONS, {
      searchJoin: 'and',
      ...params,
      code,
    });
  },

  verify: (input: VerifyCouponInputType) => {
    // {
    //   return HttpClient.post<VerifyCouponResponse>(
    //     API_ENDPOINTS.VERIFY_COUPONS,
    //     input,
    //   );
    // }
  },
  approve: (variables: { id: string }) => {
    // return HttpClient.post<{ id: string }>(
    //   API_ENDPOINTS.APPROVE_COUPON,
    //   variables,
    // );
  },
  disapprove: (variables: { id: string }) => {
    //   return HttpClient.post<{ id: string }>(
    //     API_ENDPOINTS.DISAPPROVE_COUPON,
    //     variables,
    //   );
  },
};
