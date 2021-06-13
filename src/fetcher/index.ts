import Axios, { AxiosRequestConfig } from 'axios';

export const adminGetFetcher = async (url: string, config?: AxiosRequestConfig) =>
  await Axios.get(`/admin${url}`, config).then((res) => res.data);
