import { Navigation, Selectors, StatusCode, Strings, t } from '@vikadata/core';
import { Skeleton } from '@vikadata/components';
import { ServerError } from 'pc/components/invalid_page/server_error';
import { Mirror } from 'pc/components/mirror/mirror';
import styles from 'pc/components/mirror/style.module.less';
import { NoPermission } from 'pc/components/no_permission';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';

export const MirrorRoute = () => {
  const { mirrorId, shareId, datasheetId, templateId, categoryId } = useSelector(state => state.pageParams)!;
  const mirrorSourceInfo = useSelector(state => {
    return Selectors.getMirrorSourceInfo(state, mirrorId!);
  });
  const recordId = useSelector(state => {
    return state.pageParams.recordId;
  });
  const navigationTo = useNavigation();
  const mirror = useSelector(state => {
    return Selectors.getMirror(state, mirrorId!);
  });
  const sourceDatasheet = useSelector(state => {
    if (!mirror) {
      return;
    }
    return Selectors.getDatasheet(state, mirror.sourceInfo.datasheetId);
  });

  useEffect(() => {
    if (!mirrorSourceInfo) {
      return;
    }
    // mirror 的路由和其他节点相比比较特殊，为了保持映射关系，会在路由上多显示一个 datasheetId ，所以这里对于 mirror 的跳转会做特殊处理
    if (shareId) {
      navigationTo({
        path: Navigation.SHARE_SPACE,
        params: { shareId, nodeId: mirrorId, datasheetId: mirrorSourceInfo?.datasheetId, viewId: mirrorSourceInfo?.viewId, recordId },
      });
      return;
    }
    if (templateId) {
      navigationTo({
        path: Navigation.TEMPLATE,
        params: { categoryId, templateId, nodeId: mirrorId, datasheetId: mirrorSourceInfo?.datasheetId, viewId: mirrorSourceInfo?.viewId, recordId },
      });
      return;
    }
    navigationTo({
      path: Navigation.WORKBENCH,
      params: { nodeId: mirrorId, datasheetId: mirrorSourceInfo?.datasheetId, viewId: mirrorSourceInfo?.viewId, recordId },
    });
  }, [mirrorSourceInfo, mirrorId, categoryId, shareId, templateId, navigationTo, recordId, datasheetId]);

  const errorCode = useSelector(state => {
    return Selectors.getMirrorErrorCode(state, mirrorId!) ||
      (mirrorSourceInfo?.datasheetId && Selectors.getDatasheetErrorCode(state, mirrorSourceInfo.datasheetId));
  });

  /**
   * 这里主要针对异常状态做处理
   * 1. mirror 节点被删除
   * 2. mirror 依赖的源表被删除
   */
  const isNoPermission = errorCode === StatusCode.NODE_NOT_EXIST ||
    errorCode === StatusCode.NOT_PERMISSION || errorCode === StatusCode.NODE_DELETED || errorCode === StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST;

  if (errorCode) {
    return (isNoPermission ? <NoPermission
      desc={errorCode === StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST ? t(Strings.mirror_resource_dst_been_deleted) : undefined}
    /> : <ServerError />);
  }
  if (!mirror || !sourceDatasheet || !datasheetId || sourceDatasheet.isPartOfData) {
    return <AutoSizer style={{ width: '100%', height: '100%' }}>
      {({ width, height }) => {
        return <div className={styles.skeletonWrapper} style={{ width, height }}>
          <Skeleton height="24px" />
          <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
        </div>;
      }}
    </AutoSizer>;
  }

  // 源表没被删除，mirror 节点没有被删除，但是源表生成 mirror 的视图被删除
  if (sourceDatasheet && !sourceDatasheet.snapshot.meta.views.find(item => item.id === mirrorSourceInfo?.viewId)) {
    return <NoPermission desc={t(Strings.mirror_resource_view_been_deleted)} />;
  }

  return <Mirror mirror={mirror} />;
};
