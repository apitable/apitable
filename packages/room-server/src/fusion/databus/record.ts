import { ApiRecordDto } from 'fusion/dtos/api.record.dto';
import { IRecordTransformOptions } from 'shared/interfaces';

export class Record {
  private readonly voTransformOptions: IRecordTransformOptions;

  constructor(public readonly id: string, options: IRecordOptions) {
    const { voTransformOptions } = options;
    this.voTransformOptions = voTransformOptions;
  }

  getViewObject<O>(transform: RecordViewObjectTransformer<O>): O | null {
    return transform(this.id, this.voTransformOptions);
  }
}

export interface IRecordOptions {
  voTransformOptions: IRecordTransformOptions;
}

export type RecordViewObjectTransformer<O> = (id: string, options: IRecordTransformOptions) => (O | null)
