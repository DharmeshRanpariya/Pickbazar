import { FAQs, FAQsInput, FAQsQueryOptions, FAQsPaginator } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { HttpClient2 } from './http-client2';

export const faqsClient = {
  ...crudFactory<FAQs, any, FAQsInput>(API_ENDPOINTS.FAQS),
  all: ({ faq_title, shop_id, ...params }: Partial<FAQsQueryOptions> = {}) =>
    HttpClient.get<FAQsPaginator>(API_ENDPOINTS.FAQS, {
      searchJoin: 'and',
      shop_id: shop_id,
      ...params,
      search: HttpClient.formatSearchParams({
        faq_title,
        shop_id,
      }),
    }),
  get({ id, language }: { id: string; language: string }) {
    return HttpClient2.get<FAQs>(`${API_ENDPOINTS.FAQS}/${id}`, {
      language,
    });
  },
  paginated: ({ title, shop_id, ...params }: Partial<FAQsQueryOptions>) => {
    return HttpClient2.get<FAQsPaginator>(API_ENDPOINTS.FAQS, {
      searchJoin: 'and',
      shop_id: shop_id,
      title,
      ...params,
    });
  },
};
