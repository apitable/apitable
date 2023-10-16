import useSWR from 'swr';
import { Url } from '@apitable/core';
import { getParentNode } from '../api';

const getApiKey = (folderId: string) => {
  return Url.GET_PARENTS + `?nodeId=${folderId}`;
};

interface IParams {
  folderId: string
}

export const useFetchParent = ({ folderId }: IParams) => {
  const result = useSWR(getApiKey(folderId), () => getParentNode(folderId), { revalidateOnFocus: false });
  return result;
};
