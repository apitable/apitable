import useSWR from 'swr';
import { Url } from '@apitable/core';
import { getChildrenNode } from '../api';

const getApiKey = (folderId: string) => {
  return Url.GET_NODE_LIST + `?nodeId=${folderId}`;
};

interface IParams {
  folderId: string;
}

export const useFetchChildren = ({ folderId }: IParams) => {
  const result = useSWR(getApiKey(folderId), () => getChildrenNode(folderId), { revalidateOnFocus: false });
  return result;
};
