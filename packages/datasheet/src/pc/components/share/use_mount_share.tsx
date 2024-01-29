import { useMount } from 'ahooks';
import { useEffect, useState } from 'react';
import { ConfigConstant, IShareInfo, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import { useRequest, useSpaceRequest, useUserRequest } from '../../hooks';
import { useAppDispatch } from '../../hooks/use_app_dispatch';
import { deleteStorageByKey, getStorage, StorageName } from '../../utils/storage';
import { Message } from '../common';
import { INodeTree, IShareSpaceInfo } from './interface';

export const useMountShare = (shareInfo: Required<IShareInfo> | undefined) => {
  const [nodeTree, setNodeTree] = useState<INodeTree>();
  const [shareClose, setShareClose] = useState(false);
  const [shareSpace, setShareSpace] = useState<IShareSpaceInfo | undefined>();
  const { getSpaceListReq } = useSpaceRequest();
  const { data: spaceList = [], loading: spaceListLoading, run: getSpaceList } = useRequest(getSpaceListReq, { manual: true });
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus, loading } = useRequest(getLoginStatusReq, { manual: true });
  const { IS_ENTERPRISE } = getEnvVariables();

  const dispatch = useAppDispatch();
  /**
   * Initialization data includes the following three parts：
   * 1. nodeTree
   * 2. shareSpace
   * 3. shareInfo
   * */
  const initShareData = (shareInfo: Required<IShareInfo>) => {
    const { shareNodeTree, ...shareSpaceInfo } = shareInfo;
    const isFolder = shareNodeTree.type === ConfigConstant.NodeType.FOLDER;
    setShareSpace({ ...shareSpaceInfo, isFolder } as IShareSpaceInfo);
    setNodeTree(shareNodeTree);
    if (isFolder && shareNodeTree.children.length === 0) {
      return;
    }
    dispatch(StoreActions.addNodeToMap(Selectors.flatNodeTree([...shareNodeTree.children, shareNodeTree])));
    IS_ENTERPRISE && dispatch(StoreActions.fetchMarketplaceApps(shareSpaceInfo.spaceId as string));
    dispatch(
      StoreActions.setShareInfo({
        spaceId: shareSpaceInfo.spaceId,
        allowCopyDataToExternal: shareSpaceInfo.allowCopyDataToExternal,
        allowDownloadAttachment: shareSpaceInfo.allowDownloadAttachment,
        featureViewManualSave: shareSpaceInfo.featureViewManualSave,
      }),
    );
  };

  useMount(() => {
    if (!shareInfo) {
      setShareClose(true);
      return;
    }
    initShareData(shareInfo);
  });

  const shareLoginFailed = getStorage(StorageName.ShareLoginFailed);

  useEffect(() => {
    if (typeof shareLoginFailed !== 'boolean') {
      return;
    }
    if (shareLoginFailed) {
      Message.error({ content: t(Strings.login_failed) });
    } else {
      Message.success({ content: t(Strings.login) + t(Strings.success) });
    }
    deleteStorageByKey(StorageName.ShareLoginFailed);
  }, [shareLoginFailed]);

  return {
    nodeTree,
    shareSpace,
    shareClose,
    spaceList,
    spaceListLoading,
    loading,
    getSpaceList,
    getLoginStatus,
  };
};
