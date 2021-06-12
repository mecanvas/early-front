import Axios, { AxiosRequestConfig } from 'axios';

const initialConfig = { baseURL: 'http://localhost:4000/admin' };

export const getFetcher = async (url: string, config?: AxiosRequestConfig) =>
  await Axios.get(url, config || initialConfig).then((res) => res.data);
