import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query"
import { broadcastClient } from "./client/broadcast";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "./client/api-endpoints";

export const useCreateBroadcastMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(broadcastClient.create, {
    onSuccess: async (data) => {
      if (data) {
        toast.success(t('common:successfully-created'));
      }
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BROADCAST);
    },
  });
}