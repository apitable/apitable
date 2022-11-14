import { generateRandomString, IBaseDatasheetPack, ILocalChangeset, resourceOpsToChangesets, Selectors, StoreActions } from '@apitable/core';
import { IDataLoader, IDataSelector, ILoadDataOptions } from '../data.loader.interface';
import { Datasheet } from '../datasheet';
import { IDatasheetCommandExecutedEvent } from '../event.handler.interface';
import { DatasheetEventType } from '../event.type.enum';
import { mockDatasheetMap } from './mock.datasheets';

export class MockDataLoader implements IDataLoader {
  datasheets: Record<string, IBaseDatasheetPack>;

  constructor() {
    this.reset();
  }

  reset() {
    this.datasheets = JSON.parse(JSON.stringify(mockDatasheetMap));
  }
  
  addDatasheetEventHandlers(dst: Datasheet) {
    dst.addEventHandler({
      type: DatasheetEventType.CommandExecuted,
      handle: async (event: IDatasheetCommandExecutedEvent) => {
        if ('error' in event) {
          throw new Error(JSON.stringify(event.error));
        }

        const { store, collectedResourceOps } = event;
        const changesets = resourceOpsToChangesets(collectedResourceOps, store.getState());
        changesets.forEach(cs => {
          store.dispatch(StoreActions.applyJOTOperations(cs.operations, cs.resourceType, cs.resourceId));
        });

        this.datasheets[dst.id] = {
          datasheet: Selectors.getDatasheet(store.getState()),
          snapshot: Selectors.getSnapshot(store.getState()),
        };
      },
    });
  }

  loadDatasheetPack(dstId: string): Promise<IBaseDatasheetPack> {
    if (this.datasheets.hasOwnProperty(dstId)) {
      return Promise.resolve(this.datasheets[dstId]);
    } else {
      throw new Error('datasheet not found');
    }
  }

  load<T>(selector: IDataSelector<T>, options: ILoadDataOptions): Promise<T> {
    return selector.apply(this, options);
  }
}
