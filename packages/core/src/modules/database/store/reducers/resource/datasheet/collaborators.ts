import {
  ICollaborator, IActiveDatasheetCollaboratorAction, IDeActiveDatasheetCollaborator,
  ICursorMove, IRoomInfoSync,
} from '../../../../../../store/interfaces';
import * as actions from '../../../../../shared/store/action_constants';

export type ICollaboratorAction = IActiveDatasheetCollaboratorAction | IDeActiveDatasheetCollaborator |
  IRoomInfoSync | ICursorMove;

function activeCollaborator(state: ICollaborator[], { payload }: IActiveDatasheetCollaboratorAction): ICollaborator[] {
  if (state.find(user => user.socketId === payload.socketId)) {
    console.warn('! ' + 'warning user enter with same socketid');
    return state;
  }
  return [...state, payload];
}

function deactivateCollaborator(state: ICollaborator[], { payload }: IDeActiveDatasheetCollaborator): ICollaborator[] {
  return state.filter(user => user.socketId !== payload.socketId);
}

function userCursorMove(state: ICollaborator[], { payload }: ICursorMove): ICollaborator[] {
  const { socketId, ...rest } = payload;
  return state.map(user => {
    if (user.socketId === socketId) {
      return { ...user, activeCell: rest };
    }
    return user;
  });
}

export const collaborators = (state: ICollaborator[] = [], action: ICollaboratorAction) => {
  switch (action.type) {
    case actions.DATASHEET_ACTIVE_COLLABORATOR: {
      return activeCollaborator(state, action as IActiveDatasheetCollaboratorAction);
    }
    case actions.DATASHEET_DEACTIVATE_COLLABORATOR: {
      return deactivateCollaborator(state, action);
    }
    case actions.DATASHEET_ROOM_INFO_SYNC: {
      return action.payload;
    }
    case actions.CURSOR_MOVE: {
      return userCursorMove(state, action as ICursorMove);
    }
    default:
      return state;
  }
};
