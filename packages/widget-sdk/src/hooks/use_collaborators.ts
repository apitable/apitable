import { useSelector } from 'react-redux';
import { Selectors, IReduxState } from 'core';
import { IWidgetState } from 'interface';
import { useMemo } from 'react';
import { uniqBy } from 'lodash';

const getCurrentCollaborators = (state: IWidgetState) => {
  if (state.pageParams?.dashboardId) {
    return state.dashboard?.collaborators;
  }
  if (state.pageParams?.mirrorId) {
    return Selectors.getMirrorCollaborator(state as any as IReduxState, state.pageParams.mirrorId);
  }
  if (state.pageParams?.datasheetId) {
    return Selectors.collaboratorSocketSelector(state as any as IReduxState);
  }
  return [];
};

/**
 * 获取小程序的当前所在运行环境协同者信息（包括自己），所在运行环境包含仪表盘、维格表、镜像。
 * 
 * 暂不支持使用协作者 ID 写入成员字段单元格
 * 
 * 注意： 由于维格表可以分享出去，所以在未登录的情况下的协同者的id、name、avatar都是 undefined
 *
 * @returns
 *
 * ### 示例
 * ```js
 * import { useCollaborators } from '@vikadata/widget-sdk';
 *
 * // 显示小程序当前环境协同者
 * function Meta() {
 *   const collaborators = useCollaborators();
 *   return (<div>
 *     <div>当前协同者：{collaborators.map(collaborator => {
 *       return <p>{collaborator.name || '外星人'}</p>
 *     })}</div>
 *   </div>);
 * }
 * ```
 *
 */
export function useCollaborators() {
  const collaborators = useSelector(state => {
    return getCurrentCollaborators(state);
  });
  return useMemo(() => {
    return uniqBy(collaborators, 'userId').map(collaborator => ({
      id: collaborator.userId,
      name: collaborator.memberName || collaborator.userName,
      avatar: collaborator.avatar
    }));
  }, [collaborators]);
}
