import axios from "axios";
import { response } from "express";

const AxiosInstance = axios.create();
const htmlGet = async (url: string): Promise<string> => {
  const response = await AxiosInstance.get(url);
  return response.data;
};
export default htmlGet;
