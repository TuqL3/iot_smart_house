import axios from "axios";
import { DefaultParams } from "../common/common";
import { useQuery } from "react-query";

const API_URL = "http://localhost:4000/api";

// model
export type ActionHistoryQueryParams = DefaultParams & {
  s?: string;
};

export interface ActionHistoryData {
  id: number;
  temperature: string;
  humidity: string;
  light: string;
  createdAt: string;
}

export interface ActionHistoryListData {
  data: ActionHistoryData[];
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  orderBy: string;
  sortBy: string;
  s: string;
  searchBy: string;
}
// api
export const getListActionHistory = async (
  params: ActionHistoryQueryParams
) => {
  try {
    const response = await axios.get(`${API_URL}/actionhistory`, { params });
    return response.data;
  } catch (error) {
    return error;
  }

  // return request({ url: 'ChiNhanh', method: 'GET', params }, { token: checkAuth() })
};

// hook
export const useQueryActionHistory = (params: ActionHistoryQueryParams) => {
  return useQuery<{ data: ActionHistoryListData }, Error>(
    ["LIST_DATA_SENSOR", params],
    () => getListActionHistory(params),
    {
      keepPreviousData: true,
    }
  );
};
