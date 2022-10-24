import { IServerMirror, ISourceDatasheetInfo, INodeMeta, IMirrorSnapshot } from '@apitable/core';

export class MirrorInfo implements IServerMirror {
  mirror: INodeMeta;
  sourceInfo: ISourceDatasheetInfo;
  snapshot: IMirrorSnapshot;
}
