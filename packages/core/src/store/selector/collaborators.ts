import { uniqBy, isEqual } from 'lodash';
import { IReduxState, ICollaboratorCursorMap } from '../interface';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { getDatasheetClient, getActiveDatasheetId } from './resource';

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);

export const collaboratorSocketSelector = (state: IReduxState, datasheetId?: string) => {
  const client = getDatasheetClient(state, datasheetId);
  return client && client.collaborators;
};

/**
 * 用于状态栏的协作头像显示，一个用户可以使用多个客户端进入相同的房间（表格）
 * 但是协作头像的展示，还是显示一个人。这里按用户唯一标识过滤，
 */
export const collaboratorSelector = createDeepEqualSelector(
  collaboratorSocketSelector,
  collaborators => {
    if (collaborators) {
      return uniqBy(collaborators, 'userId');
    }
    return [];
  },
);

export const collaboratorCursorSelector = createSelector(
  [collaboratorSocketSelector, getActiveDatasheetId],
  (collaborators, activeDatasheetId): ICollaboratorCursorMap => {
    const collaboratorCursorMap: ICollaboratorCursorMap = {};
    collaborators!
      .filter(collaborator => collaborator.activeCell)
      .map(collaborator => {
        return {
          fieldId: collaborator.activeCell!.fieldId,
          recordId: collaborator.activeCell!.recordId,
          avatar: collaborator.avatar,
          socketId: collaborator.socketId,
          userId: collaborator.userId,
          userName: collaborator.userName,
          memberName: collaborator.memberName,
          touchTime: collaborator.activeCell!.time, // 激活游标的时间
        };
      }).forEach(r => {
        const key = `${r.fieldId}_${r.recordId}`;
        if (collaboratorCursorMap.hasOwnProperty(key)) {
          collaboratorCursorMap[key].push(r);
        } else {
          collaboratorCursorMap[key] = [r];
        }
      });
    return collaboratorCursorMap;
  },
);
