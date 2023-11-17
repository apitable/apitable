import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { IResponseStruct } from 'api/interface';
import { CustomError } from 'api/utils/custom_error';

export const javaApi = axios.create({
  baseURL: '/api/v1',
});

const responseInterceptors = (response: AxiosResponse<IResponseStruct>) => {
  if (!response.data.success) {
    const error = new CustomError(response.data.message);
    error.code = response.data.code;
    throw error;
  } else {
    return response.data.data;
  }
};

javaApi.interceptors.response.use(responseInterceptors, (error) => Promise.reject(error));
