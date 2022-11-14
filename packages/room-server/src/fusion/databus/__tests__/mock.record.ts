import { IRecord, IRecordCellValue, SegmentType } from '@apitable/core';
import { IRecordTransformOptions } from 'shared/interfaces';

export const mockRecordVoTransformer = (() => {
  return (id: string, options: IRecordTransformOptions) => {
    return options.recordMap[id];
  };
})();

export const mockRecordCellValues: IRecordCellValue = {
  fld1: [{ type: SegmentType.Text, text: 'text4' }],
  fld2: ['opt2'],
};

export const mockRecordValue: IRecord = {
  id: 'rec4',
  data: mockRecordCellValues,
  comments: [],
  commentCount: 0,
  recordMeta: {},
};
