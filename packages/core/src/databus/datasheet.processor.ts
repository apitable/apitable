import { IDatasheetPack } from 'store';
import { JsonDataProcessor } from './json_data_processor.abstractclass';

/**
 * When data changed, the type of filter that will be trigger
 */
export type DataChangedFilter = (data: Datasheet) => boolean;

export class Datasheet extends JsonDataProcessor<IDatasheetPack> {

  private onDataChangedList: DataChangedFilter[];

  /**
   * DataBus is a pure data processing library.
   * Any dependencies stuff use filter binding to do more.
   * 
   * @param data 
   * @returns 
   */
  private doDataChangedFilter(data: Datasheet): boolean {

    if (this.onDataChangedList != null && this.onDataChangedList.length > 0) {

      let result: boolean = true;

      for (const dataChangedHandler of this.onDataChangedList) {
        const r = dataChangedHandler(data);
        if (!r) {
          result = false;
        }
        // continue to do all filter
      }

      return result;
    }

    // default true pass
    return true;
  }

  public addRecord(data: Datasheet): boolean {

    if (!this.doDataChangedFilter(data)) { return false; }

    return true;
  }

  public undo() {

  }

  public redo() {

  }

  public doCommand() {

  }

  public createRecord() {

  }

  public calcRefFields() {

  }

  public updateRecord() {

  }
  public deleteRecord() {

  }

}