import {IGetRecordsConfig} from '@vikadata/vika';

export interface ITableConfig {
    datasheetId: string;

    /*

        ========== 生成「i18n-properties」类型文件 ==========
        自动目录前缀，@see：system-config/src/main/resources/i18n/auto/service_api/exception
        自动生成固定前置目录："system-config/src/main/resources/i18n/auto/"
        自定义模块目录："service_api/exception"
        datasheetName： service_api/exception
     */
    datasheetName: string;
    schema: 'array' | 'object';
    id?: boolean;
    setting?: IGetRecordsConfig;
    create?: boolean;
}

export interface ISetting {
    fileName: string;
    fileType: 'json' | 'properties';
    create?: boolean;
    tables: ITableConfig[];
}

export const settingConfig: ISetting[] = [
    {
        fileName: 'strings.auto.json',
        fileType: 'json',
        create: true,
        tables: [
            {
                datasheetId: 'dstbUhd5coNXQoXFD8',
                datasheetName: 'strings',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
                create: true
            },
        ],
    },
    {
        fileName: 'emojis.auto.json',
        fileType: 'json',
        create: false,
        tables: [
            {
                datasheetId: 'dstTeL2t7v4NRYQYzK',
                datasheetName: 'emojis',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
            },
        ],
    },
    {
        fileName: 'system_config.auto.json',
        fileType: 'json',
        create: true,
        tables: [
            {
                datasheetId: 'dst1ytgGpftLFU4rZ2',
                datasheetName: 'environment',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
            },
            {
                datasheetId: 'dstMtRWCt5mBQfDPbM',
                datasheetName: 'audit',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
                create: true
            },
            {
                datasheetId: 'dst271nYuQMQqfjzfk',
                datasheetName: 'player.trigger',
                schema: 'array',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
            },
            {
                datasheetId: 'dst7Wz9N98PYTpeoHi',
                datasheetName: 'player.action',
                schema: 'array',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
            },
            {
                datasheetId: 'dstMyrDBCfMUXg7sFs',
                datasheetName: 'player.events',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
            },
            {
                datasheetId: 'dstnPV0UZN6joLFKBM',
                datasheetName: 'player.rule',
                schema: 'array',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
            },
            {
                datasheetId: 'dstgkcUKo1CfsSsBFM',
                datasheetName: 'guide.wizard',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
                create: true
            },
            {
                datasheetId: 'dstcVUAsnLwE6yW1VG',
                datasheetName: 'guide.step',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
            },
            {
                datasheetId: 'dstFWarmhW00VVm7D8',
                datasheetName: 'notifications.types',
                id: true,
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
                create: true
            },
            {
                datasheetId: 'dst1kELhW992bWJm4R',
                datasheetName: 'notifications.templates',
                id: true,
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
                create: true
            },
            {
                datasheetId: 'dstsSJaFj4fJ3y5DRi',
                datasheetName: 'notifications.social_templates',
                schema: 'object',
                id: true,
                create: true,
            },
            {
                datasheetId: 'dstCRrGpzT9hATv8fQ',
                datasheetName: 'integral.rule',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                },
                create: true
            },
            {
                datasheetId: 'dsttN9k2oTrB6VmJST',
                datasheetName: 'marketplace',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dstNYwMWRhDooh91iR',
                datasheetName: 'billing.products',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dstB1qp66G50bgiel7',
                datasheetName: 'billing.plans',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dstPk1T9caJRry774J',
                datasheetName: 'billing.features',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dstJm6tMDSaEBl1KpJ',
                datasheetName: 'billing.functions',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dst6kblUmhzvMgqR0E',
                datasheetName: 'billing.prices',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dst6liYqPNjGhKmcvv',
                datasheetName: 'billing.pricelist',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dst1gRYC6pLVeUQa4v',
                datasheetName: 'billing.events',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dstf86rmsfUfG0gACS',
                datasheetName: 'lark.plans',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dst0QVviLFbfYxFBsg',
                datasheetName: 'wecom.plans',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dstbK6FCm5ju42aaTa',
                datasheetName: 'dingtalk.plans',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            },
            {
                datasheetId: 'dstolgtCdbUjXKiH4x',
                datasheetName: 'appstores',
                schema: 'object',
                id: true,
                setting: undefined,
                create: true
            }
        ],
    },
    {
        fileName: 'messages{{ language }}.properties',
        fileType: 'properties',
        create: true,
        tables: [
            {
                datasheetId: 'dstlimDXR10EpPqJuD',
                datasheetName: 'service_api/exception',
                schema: 'object',
                setting: {
                    sort: [JSON.stringify({order: 'asc', field: 'id'}) as any],
                    viewId: 'viwWTAJKZmfta'
                },
                create: true
            },
        ],
    },
];

