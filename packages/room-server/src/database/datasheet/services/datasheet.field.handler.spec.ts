import { FieldType, IForeignDatasheetMap, INodeMeta, IRecordMap, SegmentType, ViewType } from '@apitable/core';
import '@apitable/i18n-lang';
import { DatasheetFieldHandler, IFieldAnalysisResult } from './datasheet.field.handler';
import { Logger } from 'winston';
import { DatasheetMetaService } from './datasheet.meta.service';
import { DatasheetRecordService } from './datasheet.record.service';
import { NodeService } from 'node/services/node.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { UserService } from 'user/services/user.service';
import { UnitService } from 'unit/services/unit.service';
import { DatasheetRepository } from '../repositories/datasheet.repository';
import { ComputeFieldReferenceManager } from './compute.field.reference.manager';
import { RoomResourceRelService } from 'database/resource/services/room.resource.rel.service';

describe('forEachRecordMap', () => {

  const mockRecordMap: IRecordMap = {
    rec1w1: {
      id: 'rec1w1',
      data: {
        fld1: ['opt1'],
        fld2: 1479827589235,
        fld3: ['rec2w1', 'rec2w2'],
        fld4: ['rec3w3', 'rec3w6', 'rec3w4'],
        fld5: ['rec2w4'],
      },
      commentCount: 0,
    },
    rec1w2: {
      id: 'rec1w2',
      data: {
        fld1: ['opt2', 'opt3'],
        fld4: ['rec3w4', 'rec3w5'],
        fld5: ['rec2w7', 'rec2w1'],
      },
      commentCount: 0,
    },
    rec1w3: {
      id: 'rec1w3',
      data: {
        fld2: 1478247898322,
        fld3: ['rec2w2'],
        fld4: ['rec3w12', 'rec3w8', 'rec3w6', 'rec3w9'],
        fld5: ['rec2w7', 'rec2w1'],
      },
      commentCount: 0,
    },
  };

  const mockLogger: Logger = {
    info() {},
  } as any as Logger;

  it('should return an empty object when fieldLinkDstMap is empty', () => {
    const result = DatasheetFieldHandler.forEachRecordMap('dst1', mockRecordMap, new Map(), mockLogger);
    expect(result).toStrictEqual({});
  });

  it('should return an empty object when recordMap is empty', () => {
    const result = DatasheetFieldHandler.forEachRecordMap('dst1', {}, new Map([['fld1', 'dst2']]), mockLogger);
    expect(result).toStrictEqual({});
  });

  test('extract linked record IDs for one link field', () => {
    const result = DatasheetFieldHandler.forEachRecordMap('dst1', mockRecordMap, new Map([['fld3', 'dst2']]), mockLogger);
    expect(result).toStrictEqual({
      dst2: new Set(['rec2w1', 'rec2w2']),
    });
  });

  test('extract linked record IDs for two link fields linking distinct datasheets', () => {
    const result = DatasheetFieldHandler.forEachRecordMap(
      'dst1',
      mockRecordMap,
      new Map([
        ['fld3', 'dst2'],
        ['fld4', 'dst3'],
      ]),
      mockLogger,
    );
    expect(result).toStrictEqual({
      dst2: new Set(['rec2w1', 'rec2w2']),
      dst3: new Set(['rec3w3', 'rec3w6', 'rec3w4', 'rec3w5', 'rec3w12', 'rec3w8', 'rec3w9']),
    });
  });

  test('extract linked record IDs for two link fields linking the same datasheet', () => {
    const result = DatasheetFieldHandler.forEachRecordMap(
      'dst1',
      mockRecordMap,
      new Map([
        ['fld3', 'dst2'],
        ['fld4', 'dst3'],
        ['fld5', 'dst2'],
      ]),
      mockLogger,
    );
    expect(result).toStrictEqual({
      dst2: new Set(['rec2w1', 'rec2w2', 'rec2w4', 'rec2w7']),
      dst3: new Set(['rec3w3', 'rec3w6', 'rec3w4', 'rec3w5', 'rec3w12', 'rec3w8', 'rec3w9']),
    });
  });
});

describe('extend main datasheet records', () => {
  let moduleFixture: TestingModule;
  let fieldHandler: DatasheetFieldHandler;
  let nodeService: NodeService;
  let metaService: DatasheetMetaService;
  let recordService: DatasheetRecordService;
  
  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
      ],
      providers: [
        DatasheetFieldHandler,
        {
          provide: NodeService,
          useValue: {
            getNodeDetailInfo: jest.fn(),
          },
        },
        {
          provide: DatasheetMetaService,
          useValue: {
            getMetaDataMaybeNull: jest.fn(),
          },
        },
        {
          provide: DatasheetMetaService,
          useValue: {
            getMetaDataMaybeNull: jest.fn(),
          },
        },
        {
          provide: DatasheetRecordService,
          useValue: {
            getRecordsByDstIdAndRecordIds: jest.fn(),
          },
        },
        {
          provide: DatasheetRecordService,
          useValue: {
            getRecordsByDstIdAndRecordIds: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: UnitService,
          useValue: {},
        },
        {
          provide: DatasheetRepository,
          useValue: {},
        },
        {
          provide: ComputeFieldReferenceManager,
          useValue: {
            createReference: jest.fn(),
          },
        },
        {
          provide: RoomResourceRelService,
          useValue: {},
        },
      ],
    }).compile();
    
    fieldHandler = moduleFixture.get(DatasheetFieldHandler);
    nodeService = moduleFixture.get(NodeService);
    metaService = moduleFixture.get(DatasheetMetaService);
    recordService = moduleFixture.get(DatasheetRecordService);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  const filterRecordMap = (recordMap: IRecordMap, recordIds: string[]): IRecordMap =>
    Object.fromEntries(Object.entries(recordMap).filter(([recordId]) => recordIds.includes(recordId)));

  it('should contain extended records referenced by foreign datasheets if needExtendMainDstRecords is true', async() => {
    const mockDatasheets: IForeignDatasheetMap['foreignDatasheetMap'] = {
      dst1: {
        datasheet: {
          id: 'dst1',
          name: 'dst 1',
          revision: 10,
        } as INodeMeta,
        snapshot: {
          datasheetId: 'dst1',
          meta: {
            fieldMap: {
              fld1w1: {
                id: 'fld1w1',
                name: 'fld1-1',
                type: FieldType.Text,
                property: null,
              },
              fld1w2: {
                id: 'fld1w2',
                name: 'fld1-2',
                type: FieldType.Link,
                property: {
                  foreignDatasheetId: 'dst2',
                  brotherFieldId: 'fld2w2',
                },
              },
              fld1w3: {
                id: 'fld1w3',
                name: 'fld1-3',
                type: FieldType.LookUp,
                property: {
                  datasheetId: 'dst1',
                  relatedLinkFieldId: 'fld1w2',
                  lookUpTargetFieldId: 'fld2w3',
                },
              },
            },
            views: [
              {
                id: 'viw1w1',
                name: 'view 1',
                type: ViewType.Grid,
                columns: [{ fieldId: 'fld1w1' }, { fieldId: 'fld1w2' }, { fieldId: 'fld1w3' }],
                rows: [{ recordId: 'rec1w1' }, { recordId: 'rec1w2' }, { recordId: 'rec1w3' }],
                frozenColumnCount: 1,
              },
            ],
          },
          recordMap: {
            rec1w1: {
              id: 'rec1w1',
              data: {
                fld1w1: [{ type: SegmentType.Text, text: 'a' }],
                fld1w2: ['rec2w1'],
              },
              commentCount: 0,
            },
            rec1w2: {
              id: 'rec1w2',
              data: {
                fld1w1: [{ type: SegmentType.Text, text: 'b' }],
                fld1w2: ['rec2w1'],
              },
              commentCount: 0,
            },
            rec1w3: {
              id: 'rec1w3',
              data: {
                fld1w1: [{ type: SegmentType.Text, text: 'c' }],
              },
              commentCount: 0,
            },
          },
        },
        fieldPermissionMap: undefined,
      },
      dst2: {
        datasheet: {
          id: 'dst2',
          name: 'dst 2',
          revision: 13,
        } as INodeMeta,
        snapshot: {
          datasheetId: 'dst2',
          meta: {
            fieldMap: {
              fld2w1: {
                id: 'fld2w1',
                name: 'fld2-1',
                type: FieldType.Text,
                property: null,
              },
              fld2w2: {
                id: 'fld2w2',
                name: 'fld2-2',
                type: FieldType.Link,
                property: {
                  foreignDatasheetId: 'dst1',
                  brotherFieldId: 'fld1w2',
                },
              },
              fld2w3: {
                id: 'fld2w3',
                name: 'fld2-3',
                type: FieldType.LookUp,
                property: {
                  datasheetId: 'dst2',
                  relatedLinkFieldId: 'fld2w2',
                  lookUpTargetFieldId: 'fld1w1',
                },
              },
            },
            views: [
              {
                id: 'viw2w1',
                name: 'view 1',
                type: ViewType.Grid,
                columns: [{ fieldId: 'fld2w1' }, { fieldId: 'fld2w2' }, { fieldId: 'fld2w3' }],
                rows: [{ recordId: 'rec2w1' }],
                frozenColumnCount: 1,
              },
            ],
          },
          recordMap: {
            rec2w1: {
              id: 'rec2w1',
              data: {
                fld2w1: [{ type: SegmentType.Text, text: 'A' }],
                fld2w2: ['rec1w1', 'rec1w2'],
              },
              commentCount: 0,
            },
          },
        },
        fieldPermissionMap: undefined,
      },
    };

    jest.spyOn(nodeService, 'getNodeDetailInfo').mockImplementationOnce(() => Promise.resolve({ node: mockDatasheets['dst2']!.datasheet as any }));
    jest.spyOn(metaService, 'getMetaDataMaybeNull').mockImplementationOnce(() => Promise.resolve(mockDatasheets['dst2']!.snapshot.meta));
    jest
      .spyOn(recordService, 'getRecordsByDstIdAndRecordIds')
      .mockImplementation((dstId, recordIds) => Promise.resolve(filterRecordMap(mockDatasheets[dstId]!.snapshot.recordMap, recordIds)));

    const result = await fieldHandler.analyze('dst1', {
      auth: {},
      origin: {
        internal: true,
      },
      mainDstMeta: mockDatasheets['dst1']!.snapshot.meta,
      mainDstRecordMap: filterRecordMap(mockDatasheets['dst1']!.snapshot.recordMap, ['rec1w1']),
      needExtendMainDstRecords: true,
    });

    expect(result).toStrictEqual({
      mainDstRecordMap: filterRecordMap(mockDatasheets['dst1']!.snapshot.recordMap, ['rec1w1', 'rec1w2']),
      foreignDatasheetMap: {
        dst2: mockDatasheets['dst2']!,
      },
    } as IFieldAnalysisResult);
  });

  describe('self linking', () => {
    const mockDatasheets: IForeignDatasheetMap['foreignDatasheetMap'] = {
      dst1: {
        datasheet: {
          id: 'dst1',
          name: 'dst 1',
          revision: 10,
        } as INodeMeta,
        snapshot: {
          datasheetId: 'dst1',
          meta: {
            fieldMap: {
              fld1w1: {
                id: 'fld1w1',
                name: 'fld1-1',
                type: FieldType.Text,
                property: null,
              },
              fld1w2: {
                id: 'fld1w2',
                name: 'fld1-2',
                type: FieldType.Link,
                property: {
                  foreignDatasheetId: 'dst1',
                },
              },
            },
            views: [
              {
                id: 'viw1w1',
                name: 'view 1',
                type: ViewType.Grid,
                columns: [{ fieldId: 'fld1w1' }, { fieldId: 'fld1w2' }],
                rows: [{ recordId: 'rec1w1' }, { recordId: 'rec1w2' }, { recordId: 'rec1w3' }, { recordId: 'rec1w4' }],
                frozenColumnCount: 1,
              },
            ],
          },
          recordMap: {
            rec1w1: {
              id: 'rec1w1',
              data: {
                fld1w1: [{ type: SegmentType.Text, text: 'a' }],
                fld1w2: ['rec1w2'],
              },
              commentCount: 0,
            },
            rec1w2: {
              id: 'rec1w2',
              data: {
                fld1w1: [{ type: SegmentType.Text, text: 'b' }],
                fld1w2: ['rec1w3'],
              },
              commentCount: 0,
            },
            rec1w3: {
              id: 'rec1w3',
              data: {
                fld1w1: [{ type: SegmentType.Text, text: 'c' }],
              },
              commentCount: 0,
            },
            rec1w4: {
              id: 'rec1w4',
              data: {
                fld1w1: [{ type: SegmentType.Text, text: 'd' }],
              },
              commentCount: 0,
            },
          },
        },
        fieldPermissionMap: undefined,
      },
    };

    it('should contain extended records referenced by self linking if needExtendMainDstRecords is true', async() => {
      jest
        .spyOn(recordService, 'getRecordsByDstIdAndRecordIds')
        .mockImplementation((dstId, recordIds) => Promise.resolve(filterRecordMap(mockDatasheets[dstId]!.snapshot.recordMap, recordIds)));

      const result = await fieldHandler.analyze('dst1', {
        auth: {},
        origin: {
          internal: true,
        },
        mainDstMeta: mockDatasheets['dst1']!.snapshot.meta,
        mainDstRecordMap: filterRecordMap(mockDatasheets['dst1']!.snapshot.recordMap, ['rec1w1']),
        needExtendMainDstRecords: true,
      });

      expect(result).toStrictEqual({
        mainDstRecordMap: filterRecordMap(mockDatasheets['dst1']!.snapshot.recordMap, ['rec1w1', 'rec1w2']),
        foreignDatasheetMap: {},
      } as IFieldAnalysisResult);
    });

    it('should not contain extended records referenced by self linking if needExtendMainDstRecords is false', async() => {
      jest
        .spyOn(recordService, 'getRecordsByDstIdAndRecordIds')
        .mockImplementation((dstId, recordIds) => Promise.resolve(filterRecordMap(mockDatasheets[dstId]!.snapshot.recordMap, recordIds)));

      const result = await fieldHandler.analyze('dst1', {
        auth: {},
        origin: {
          internal: true,
        },
        mainDstMeta: mockDatasheets['dst1']!.snapshot.meta,
        mainDstRecordMap: filterRecordMap(mockDatasheets['dst1']!.snapshot.recordMap, ['rec1w1']),
        needExtendMainDstRecords: false,
      });

      expect(result).toStrictEqual({
        mainDstRecordMap: filterRecordMap(mockDatasheets['dst1']!.snapshot.recordMap, ['rec1w1']),
        foreignDatasheetMap: {},
      } as IFieldAnalysisResult);
    });
  });
});
