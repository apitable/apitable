import { ISegment, SegmentType } from 'types/field_types';

export function str2text(value: string): ISegment[] | null {
  if (!value) {
    return null;
  }
  return [{
    type: SegmentType.Text,
    text: value,
  }];
}
