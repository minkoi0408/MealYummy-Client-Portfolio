import { callAPI } from "./axios.client";
import { type AxiosResponse } from "axios";
import { type BaseApiResponse } from "../types/response.api";
import { type Page } from "../types/page.api";

export interface AccessLog {
  id: string;
  userId: string | null;
  username: string;
  ipAddress: string;
  endpoint: string;
  method: string;
  userAgent: string;
  status: number;
  durationMs: number;
  createdAt: string;
}

export const accessLogApi = {
  getLogs: (page: number = 0, size: number = 10, search?: string): Promise<AxiosResponse<BaseApiResponse<Page<AccessLog>>>> => {
    let url = "/dashboard/access-logs?page=" + page + "&size=" + size;
    if (search) {
      url += "&search=" + encodeURIComponent(search);
    }
    return callAPI('GET', url);
  }
};