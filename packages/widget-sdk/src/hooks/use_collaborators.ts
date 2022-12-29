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
 * Get information(including yourself) about collaborators of the environment where the widget is currently running, 
 * which include dashboard, datasheet, mirror.
 * 
 * 
 * Writing to member field cells using collaborator IDs is not supported at this time.
 * 
 * Note: Since the datasheet can be shared, the id, name, and avatar of the collaborator in the case of not being logged in are undefined.
 *
 * @returns
 *
 * ### Example
 * ```js
 * import { useCollaborators } from '@apitable/widget-sdk';
 *
 * // show the currently environment collaborator of the widget
 * function Meta() {
 *   const collaborators = useCollaborators();
 *   return (<div>
 *     <div>Current collaborator: {collaborators.map(collaborator => {
 *       return <p>{collaborator.name || 'Aliens'}</p>
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
