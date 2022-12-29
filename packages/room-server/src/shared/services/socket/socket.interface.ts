import { IRemoteChangeset } from '@apitable/core';

export interface IWatchRoomMessage {
  roomId: string;
  shareId?: string;
  cookie?: string;
  embedLinkId?: string;
}

export interface IClientRoomChangeResult {
  changeset: IRemoteChangeset;
  roomIds: string[];
}
