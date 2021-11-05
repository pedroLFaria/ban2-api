import { AxiosInstance } from "axios";

const documentDownloader = (ai: AxiosInstance, url: string) => {
  return ai.request({
    method: "GET",
    url: url,
    responseType: "stream",
  });
};

export default documentDownloader;
