import { IGetRecordsReqParams } from '@vikadata/vika';

export interface ITableConfig {
  datasheetId: string;
  datasheetName: string;
  schema: 'array' | 'object';
  id?: boolean;
  setting?: IGetRecordsReqParams;
}

export interface ISetting {
  dirName: string;
  fileName: string;
  tables: ITableConfig[];
}

export const settingConfig: ISetting[] = [
  {
    dirName: 'packages/i18n-lang/src/config',
    fileName: 'strings.auto.json',
    tables: [
      {
        datasheetId: 'dstbUhd5coNXQoXFD8',
        datasheetName: 'strings',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
    ],
  },
  {
    dirName: 'packages/core/src/config',
    fileName: 'emojis.auto.json',
    tables: [
      {
        datasheetId: 'dstTeL2t7v4NRYQYzK',
        datasheetName: 'emojis',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
    ],
  },
  {
    dirName: 'packages/core/src/config',
    fileName: 'api_tip_config.auto.json',
    tables: [
      {
        datasheetId: 'dstbSPcs8aC7LMjcpE',
        datasheetName: 'api.tips',
        schema: 'object',
        id: true,
        setting: undefined,
      },
    ],
  },
  {
    dirName: 'packages/core/src/config',
    fileName: 'system_config.auto.json',
    tables: [
      {
        datasheetId: 'dst1ytgGpftLFU4rZ2',
        datasheetName: 'environment',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstcUxPbETxX5t8rbZ',
        datasheetName: 'settings',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstEvwXJKVb8cBE02v',
        datasheetName: 'shortcut_keys',
        schema: 'array',
      },
      {
        datasheetId: 'dstyh42c9ELMPAP6g8',
        datasheetName: 'country_code_and_phone_code',
        schema: 'object',
      },
      {
        datasheetId: 'dst3uQsx1lTHEjwdLZ',
        datasheetName: 'api_panel',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstMtRWCt5mBQfDPbM',
        datasheetName: 'audit',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstwZ8nchpQrDw4mfV',
        datasheetName: 'locales',
        schema: 'array',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dst271nYuQMQqfjzfk',
        datasheetName: 'player.trigger',
        schema: 'array',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstMyrDBCfMUXg7sFs',
        datasheetName: 'player.events',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstnPV0UZN6joLFKBM',
        datasheetName: 'player.rule',
        schema: 'array',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dst3VM6j7VvaDziNhm',
        datasheetName: 'player.jobs',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dst7Wz9N98PYTpeoHi',
        datasheetName: 'player.action',
        schema: 'array',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstmCi0wFNmUSXwobM',
        datasheetName: 'player.tips',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstgkcUKo1CfsSsBFM',
        datasheetName: 'guide.wizard',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstcVUAsnLwE6yW1VG',
        datasheetName: 'guide.step',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstFWarmhW00VVm7D8',
        datasheetName: 'notifications.types',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dst1kELhW992bWJm4R',
        datasheetName: 'notifications.templates',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dstCRrGpzT9hATv8fQ',
        datasheetName: 'integral.rule',
        schema: 'object',
        setting: {
          sort: [JSON.stringify({ order: 'asc', field: 'id' }) as any],
        },
      },
      {
        datasheetId: 'dsttN9k2oTrB6VmJST',
        datasheetName: 'marketplace',
        schema: 'object',
        id: true,
        setting: undefined,
      },
      {
        datasheetId: 'dstgzrhclTvhVelEZq',
        datasheetName: 'test_function',
        schema: 'object',
        id: true,
        setting: {
          viewId: 'viwm00oytk6uh',
        },
      },
      {
        datasheetId: 'dstNYwMWRhDooh91iR',
        datasheetName: 'billing.products',
        schema: 'object',
        id: true,
        setting: undefined,
      }
    ],
  },
];

