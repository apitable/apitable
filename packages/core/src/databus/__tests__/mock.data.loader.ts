import { IBaseDatasheetPack } from '../../store';
import { IDataLoader, IDataSelector, ILoadDataOptions } from '../data_loader.interface';
import { mockDatasheetMap } from './mock.datasheets';

export class MockDataLoader implements IDataLoader {
  datasheets: Record<string, IBaseDatasheetPack>;

  constructor() {
    this.datasheets = JSON.parse(JSON.stringify(mockDatasheetMap));
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
