import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function get<T = any>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await api.get(path, config);
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    return undefined;
  }
}

export async function post<T = any>(
  path: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await api.post(path, data, config);
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    return undefined;
  }
}

export async function put<T = any>(
  path: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await api.put(path, data, config);
    return response.data;
  } catch (error) {
    console.error("PUT request error:", error);
    return undefined;
  }
}

export async function deleteRequest<T = any>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await api.delete(path, config);
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    return undefined;
  }
}
