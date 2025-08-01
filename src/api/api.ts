// E:\fitarch-ai-app\src\api\api.ts

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Base URL from environment variable
const baseURL = import.meta.env.VITE_API_BASE_URL as string;

// Create a configured Axios instance
const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic GET request
export async function get<T = any>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await api.get(path, config);
    return response.data;
  } catch (error) {
    handleError("GET", path, error);
    return undefined;
  }
}

// Generic POST request
export async function post<T = any>(
  path: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await api.post(path, data, config);
    return response.data;
  } catch (error) {
    handleError("POST", path, error);
    return undefined;
  }
}

// Generic PUT request
export async function put<T = any>(
  path: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await api.put(path, data, config);
    return response.data;
  } catch (error) {
    handleError("PUT", path, error);
    return undefined;
  }
}

// Generic DELETE request
export async function deleteRequest<T = any>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await api.delete(path, config);
    return response.data;
  } catch (error) {
    handleError("DELETE", path, error);
    return undefined;
  }
}

// Error handling utility
function handleError(method: string, path: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error(
      `${method} ${path} failed with status ${error.response?.status}:`,
      error.response?.data || error.message
    );
  } else {
    console.error(`${method} ${path} failed:`, error);
  }
}

export default api;
