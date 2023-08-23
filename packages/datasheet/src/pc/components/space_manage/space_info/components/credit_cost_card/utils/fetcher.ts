import axios from 'axios';

export const getCreditStatisticsFetcher = (url: string) => {
  return axios.get(url).then((res) => res.data.data);
};
