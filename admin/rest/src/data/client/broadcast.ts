import { Broadcast } from "@/types";
import { crudFactory } from "./curd-factory";
import { API_ENDPOINTS } from "./api-endpoints";

export const broadcastClient = {
    ...crudFactory<Broadcast, any, Broadcast>(API_ENDPOINTS.BROADCAST),
}