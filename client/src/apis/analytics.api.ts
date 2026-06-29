import { callAPI } from "./axios.client";
import { type AxiosResponse } from "axios";
import { type BaseApiResponse } from "../types/response.api";

export const analyticsApi = {
  getRevenueByMonth: (year: number): Promise<AxiosResponse<BaseApiResponse<{ [key: string]: number }>>> => {
    return callAPI('GET', "/dashboard/analytics/revenue/monthly?year=" + year);
  },
  
  getTotalRevenue: (): Promise<AxiosResponse<BaseApiResponse<number>>> => {
    return callAPI('GET', "/dashboard/analytics/revenue/total");
  },

  getActiveUsers: (): Promise<AxiosResponse<BaseApiResponse<string[]>>> => {
    return callAPI('GET', "/dashboard/active-users");
  }
};