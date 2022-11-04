import { IRecord, IRecordCellValue } from "store";
import { JsonDataProcessor } from "./json_data_processor.abstractclass"

export class Record extends JsonDataProcessor<IRecord> {
  constructor(record: IRecord) {
    super(record);
  }

  get id(): string {
    return this.getDataSource().id;
  }
}

export interface IRecordCreation {
  viewId: string
  cellValues?: IRecordCellValue
}