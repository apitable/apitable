import { IDatasheetPermission } from 'core';
import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IWidgetContext } from 'interface';
import { WidgetContext } from '../../context';
import { useMeta } from 'hooks/use_meta';
import { Selectors } from '@vikadata/core';

/**
 * 小程序的创建、删除、重命名、位置变更等权限都是依附于小程序所在的数表或者仪表盘。这些操作的权限判断在顶层已经处理过。
 * 小程序本身只有一个权限，即是否可以往 storage 里面写数据。这个权限是根据小程序当前所处的环境动态计算的。
 */
interface IWidgetPermission {
  storage: {
    editable: boolean; // 可以写
  },
  datasheet?: IDatasheetPermission;
}

/**
 * @private
 * 只暴露给 sdk 中 hooks 使用
 */
export const usePermission = () => {
  const context = useContext<IWidgetContext>(WidgetContext);
  const globalState = context.globalStore.getState();
  const datasheetId = useSelector(state => state.widget?.snapshot.datasheetId)!;
  const { sourceId } = useMeta();
  const dstPermission = useSelector(state => {
    return Selectors.getPermissions(
      globalState,
      datasheetId,
      undefined,
      (sourceId?.startsWith('mir') && sourceId) || globalState.pageParams.mirrorId
    );
  });
  // FIXME: dashboard 权限变更时，这里不会即时刷新，但写入数据会校验。
  // 离开 dashboard 时，dashboardPack 未被销毁，这里多加一层判断。
  const dashboardPermission = useSelector(state => state.dashboard?.permissions);

  return useMemo(() => {
    const permission: IWidgetPermission = {
      storage: {
        editable: Boolean(dstPermission?.editable),
      },
      datasheet: dstPermission,
    };

    if (dashboardPermission) {
      permission.storage.editable = Boolean(dstPermission?.readable && dashboardPermission?.editable);
    }
    return permission;
  }, [dstPermission, dashboardPermission]);
};
