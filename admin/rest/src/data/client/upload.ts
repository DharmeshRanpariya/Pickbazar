import { API_ENDPOINTS } from './api-endpoints';
import { Attachment } from '@/types';
import { HttpClient2 } from './http-client2';

export const uploadClient = {
  upload: async (variables: any) => {
    let formData = new FormData();
    variables.forEach((attachment: any) => {
      formData.append('file', attachment);
    });
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return HttpClient2.post<Attachment>(
      API_ENDPOINTS.UPLOADS,
      formData,
      options,
    );
  },
};
