import { IJOTAction, OTActionName } from 'engine/ot/interface';
import { IWidgetSnapshot } from 'store';

export class WidgetActions {
  static setGlobalStorage2Action(
    snapshot: IWidgetSnapshot,
    payload: {
      key: string,
      value?: any
    },
  ): IJOTAction[] | null {
    const { storage } = snapshot;
    const { value, key } = payload;

    // 如果存在则覆盖，如果不存在则插入, 如果 value 为 null 则 delete
    if (storage && Object.keys(storage).includes(key)) {
      return [{
        n: OTActionName.ObjectReplace,
        p: ['storage', key],
        oi: value,
        od: storage[key],
      }];
    }
    return [{
      n: OTActionName.ObjectInsert,
      p: ['storage', key],
      oi: value,
    }];
  }

  static setWidgetName2Action(
    snapshot: IWidgetSnapshot,
    payload: {
      newWidgetName: string;
    },
  ): IJOTAction[] | null {
    const { newWidgetName } = payload;
    return [
      {
        n: OTActionName.ObjectReplace,
        p: ['widgetName'],
        od: snapshot.widgetName,
        oi: newWidgetName,
      },
    ];
  }

  static setWidgetDepDstId2Action(
    snapshot: IWidgetSnapshot,
    payload: {
      dstId: string;
      sourceId?: string
    },
  ): IJOTAction[] | null {
    const { dstId, sourceId } = payload;
    const action: IJOTAction[] = [
      {
        n: OTActionName.ObjectReplace,
        p: ['datasheetId'],
        od: snapshot.datasheetId,
        oi: dstId,
      }
    ];
    if (sourceId) {
      action.push({
        n: OTActionName.ObjectReplace,
        p: ['sourceId'],
        od: snapshot.sourceId,
        oi: sourceId,
      });
    }
    return action;
  }
}
