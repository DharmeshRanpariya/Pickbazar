import type { GetParams, PaginatorInfo } from '@/types';
import { HttpClient } from './http-client';
import { HttpClient2 } from './http-client2';

interface LanguageParam {
  language: string;
}

export function crudFactory<Type, QueryParams extends LanguageParam, InputType>(
  endpoint: string,
) {
  return {
    all(params: QueryParams) {
      // return HttpClient.get<Type[]>(endpoint, params);
    },
    paginated(params: QueryParams) {
      // return HttpClient.get<PaginatorInfo<Type>>(endpoint, params);
    },
    get({ slug, language }: GetParams) {
      return HttpClient2.get<Type>(`${endpoint}/${slug}`, { language });
    },
    create(data: InputType) {
      return HttpClient2.post<Type>(endpoint, data);
    },
    update({ id, ...input }: Partial<InputType> & { id: string }) {
      return HttpClient2.put<Type>(`${endpoint}/${id}`, input);
    },
    delete({ _id }: { _id: string }) {
      return HttpClient2.delete<boolean>(`${endpoint}/${_id}`);
    },
  };
}
