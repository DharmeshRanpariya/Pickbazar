import {
  AuthorQueryOptions,
  QueryOptions,
  Contact,
  CreateContactInput,
  ContactPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient2 } from './http-client2';

export const ContactClient = {
  ...crudFactory<Contact, QueryOptions, CreateContactInput>(
    API_ENDPOINTS.CONTACT,
  ),
  paginated: ({
    name,
    email,
    subject,
    description,
    ...params
  }: Partial<AuthorQueryOptions>) => {
    return HttpClient2.get<ContactPaginator>(API_ENDPOINTS.CONTACT, {
      searchJoin: 'and',
      ...params,
      search: HttpClient2.formatSearchParams({
        name,
        email,
        subject,
        description,
      }),
    });
  },
};
