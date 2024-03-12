import useSWR from 'swr';
import { ConfigConstant, Url } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { getChildrenNode } from '../api';

const getApiKey = (folderId: string) => {
  return Url.GET_NODE_LIST + `?nodeId=${folderId}`;
};

interface IParams {
  folderId: string;
}

export const useFetchChildren = ({ folderId }: IParams) => {
  const catalogTreeActiveType = useAppSelector((state) => state.catalogTree.activeType);
  const isPrivate = catalogTreeActiveType === ConfigConstant.Modules.PRIVATE;
  const result = useSWR(getApiKey(folderId), () => getChildrenNode(folderId, isPrivate ? 3: undefined), { revalidateOnFocus: false });
  return result;
};
