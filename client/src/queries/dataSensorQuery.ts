import axios from "axios";
import { DefaultParams } from "../common/common";
import { useQuery } from "react-query";

const API_URL = 'http://localhost:4000/api'



// model
export type DataSensorQueryParams = DefaultParams & {
    s?: string
}


export interface DataSensorData {
    id: number;
    temperature: string,
    humidity: string,
    light: string,
    createdAt: string
}

export interface DataSensorListData {
    data: DataSensorData[]
    page: number,
    limit: number,
    total: number,
    totalPage: number,
    orderBy: string,
    sortBy: string,
    s: string
}
// api
export const getListDataSensor = async (params: DataSensorQueryParams) => {
    try {
        const response = await axios.get(`${API_URL}/datasensors`, { params })
        return response.data
    } catch (error) {
        return error
    }

    // return request({ url: 'ChiNhanh', method: 'GET', params }, { token: checkAuth() })
}

// hook
export const useQueryDataSensor = (params: DataSensorQueryParams) => {
    return useQuery<{ data: DataSensorListData }, Error>(
        ['LIST_DATA_SENSOR', params],
        () => getListDataSensor(params),
        {
            keepPreviousData: true,
        }
    )
}



