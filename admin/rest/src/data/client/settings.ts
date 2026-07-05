import { Settings, SettingsInput, SettingsOptionsInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from '@/data/client/http-client';
import { HttpClient2 } from './http-client2';

export const settingsClient = {
  ...crudFactory<Settings, any, SettingsOptionsInput>(API_ENDPOINTS.SETTINGS),
  all({ language }: { language: string }) {
    return HttpClient2.get<Settings>(API_ENDPOINTS.SETTINGS, {
      language,
    });
  },
  update: ({ ...data }: SettingsInput) => {
    if (data?.options?._id) {
      return HttpClient2.put<Settings>(
        `${API_ENDPOINTS.SETTINGS}/${data?.options?._id}`,
        { ...data?.options },
      );
    }
    return HttpClient2.post<Settings>(API_ENDPOINTS.SETTINGS, {
      ...data?.options,
    });
  },
};
