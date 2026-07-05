import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient2 } from './http-client2';

export const dashboardClient = {
  analytics() {
    return HttpClient2.get<any>(API_ENDPOINTS.ANALYTICS);
  },
  refundanalytics() {
    return HttpClient2.get<any>(API_ENDPOINTS.REFUNDANALYTICS);
  },
};
