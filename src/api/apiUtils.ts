import axios, { AxiosRequestConfig } from 'axios';

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

export const apiGetRequest = async <T>(url: string, token?: string): Promise<ApiResponse<T>> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        };

        const response = await axios.get<T>(url, config);
        return { data: response.data, error: null };
    } catch (error: any) {
        console.error('Error details:', error.response?.data || error.message || error);
        return { data: null, error: error.response?.data?.message || error.message || 'Something went wrong' };
    }
};