import { IFieldMap, IRecordCellValue, IRecordMap, IViewProperty, ViewType } from 'exports/store';
import fc from 'fast-check';
import { FieldType, SegmentType } from 'types';

export type IMockDatasheetSample = [string, number][];

export function arrayToMap<T>(array: T[]): T {
  const result = {};
  array.forEach(item => {
    Object.assign(result, item);
  });
  return (result as unknown) as T;
}

export function mapToArray<Item>(obj: Record<string, Item>): (Item | void)[] {
  return Object.keys(obj).map(key => obj[key]);
}

export interface IMockNewRecord {
  recordValues: IRecordCellValue;
  textFieldId: string;
  optionsFiledId: string;
}

export class MockDatasheetGenerate {
  /**
   * property testing sample
   */
  public sample = fc.sample(
    fc.property(
      fc.string().filter(v => v.length > 1),
      fc.integer().filter(v => v > 0),
      () => {},
    ),
    { numRuns: ~~(Math.random() * 50) + 20 },
  ) as [string, number][];

  private filterFieldKeysCache: null | string[] = null;

  /**
   * Filter the fieldMap keys
   * @returns string[]
   */
  public filterFieldKeys() {
    if (!this.filterFieldKeysCache) {
      const filedMap = this.fieldMap();
      const seed = this.sample[0]![1];

      this.filterFieldKeysCache = Object.keys(filedMap).filter((_, index) => (index + seed) % 3 === 0);
    }
    return this.filterFieldKeysCache;
  }

  /**
   * Use property sample mock fieldMap
   * @returns IFieldMap
   */
  public fieldMap(): IFieldMap {
    return arrayToMap(
      this.sample.map((item, index) => {
        const isMultiSelect = index % 3 === 0 && index > 1;
        const id = 'fld' + index + item[0];
        return {
          [id]: {
            id,
            name: 'filed ' + item[0],
            type: isMultiSelect ? FieldType.MultiSelect : FieldType.Text,
            property: isMultiSelect
              ? {
                options: [
                  { id: 'opt1', name: 'option 1' + item[0], color: 0 },
                  { id: 'opt2', name: 'option 2' + item[0], color: 1 },
                  { id: 'opt3', name: 'option 3' + item[0], color: 2 },
                ],
                defaultValue: ['opt2', 'opt1'],
              }
              : null,
          },
        } as IFieldMap;
      }),
    );
  }

  /**
   * Use property sample mock recordMap
   * @returns IRecordMap
   */
  public recordMap(): IRecordMap {
    return arrayToMap<IRecordMap>(
      this.sample.map((_, index) => {
        return {
          ['rec' + index]: {
            id: 'rec' + index,
            data: arrayToMap(
              this.filterFieldKeys().map(key => {
                return { [key]: [{ type: SegmentType.Text, text: 'text ' + key }] };
              }),
            ),
            commentCount: 1,
            comments: [
              {
                revision: 7,
                createdAt: 1669886283547,
                commentId: 'cmt1001',
                unitId: '100004',
                commentMsg: {
                  type: 'dfs',
                  content: 'foo',
                  html: 'foo',
                },
              },
            ],
          },
        } as IRecordMap;
      }),
    );
  }

  /**
   * Use property sample mock views
   * @returns IViewProperty[]
   */
  public views(): IViewProperty[] {
    const records = Object.keys(this.recordMap());
    return this.sample.map((_, index) => {
      return {
        id: 'viw' + index,
        type: ViewType.Grid,
        columns: this.filterFieldKeys().map(key => ({ fieldId: key })),
        frozenColumnCount: 1,
        name: 'view ' + index,
        rows: records.map(key => ({ recordId: key })),
      };
    });
  }

  /**
   * Create record change item
   * @returns IMockNewRecord
   */
  public createRecord(): IMockNewRecord {
    const fields = mapToArray(this.fieldMap());
    const textFieldId = fields.find(item => !item!.property)!.id;
    const optionsFiledId = fields.find(item => item!.property)!.id;

    return {
      recordValues: {
        [textFieldId]: [{ type: SegmentType.Text, text: 'text4' }],
        [optionsFiledId]: ['opt1'],
      },
      textFieldId,
      optionsFiledId,
    };
  }

  /**
   * Mock database data
   */
  public data = {
    dst1: {
      snapshot: {
        meta: {
          fieldMap: this.fieldMap(),
          views: this.views(),
        },
        recordMap: this.recordMap(),
        datasheetId: 'dst1',
      },
      datasheet: {
        id: 'dst1',
        name: 'datasheet 1',
        description: 'this is datasheet 1',
        parentId: '',
        icon: '',
        nodeShared: false,
        nodePermitSet: false,
        spaceId: 'spc1',
        role: {} as any,
        permissions: {} as any,
        revision: 12,
      },
      fieldPermissionMap: {},
    },
  };
}
