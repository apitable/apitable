/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import {
  FieldType,
  IBaseDatasheetPack,
  IFieldMap,
  IFieldPermissionMap,
  IMeta,
  IRecordMap,
  IViewProperty,
  Role
} from '@apitable/core';
import { RestService } from 'shared/services/rest/rest.service';
import { DatasheetFieldCascaderService } from './datasheet.field.cascader.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { CascaderDatabusService } from './cascader.databus.service';
import { IAuthHeader } from '../../../shared/interfaces';
import { CommonException, ServerException } from 'shared/exception';
import { slice } from 'lodash';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { CommandService } from 'database/command/services/command.service';
import { UnitService } from 'unit/services/unit.service';

describe('DatasheetFieldTreeSelectService', () => {
  let moduleFixture: TestingModule;
  let datasheetFieldCascaderService: DatasheetFieldCascaderService;
  let restService: RestService;
  let datasheetService: DatasheetService;
  let cascaderDataBusService: CascaderDatabusService;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
      ],
      providers: [
        CommandService,
        {
          provide: RestService,
          useValue: {
            getFieldPermission: jest.fn(),
          },
        },
        {
          provide: DatasheetService,
          useValue: {
            getBasePacks: jest.fn(),
            getDatasheet: jest.fn(),
          },
        },
        {
          provide: UnitService,
          useValue: {
            getUnitInfo: jest.fn(),
          }
        },
        CascaderDatabusService,
        DatasheetFieldCascaderService,
      ],
    }).compile();
    cascaderDataBusService = moduleFixture.get<CascaderDatabusService>(CascaderDatabusService);
    restService = moduleFixture.get<RestService>(RestService);
    datasheetService = moduleFixture.get<DatasheetService>(DatasheetService);
    datasheetFieldCascaderService = moduleFixture.get<DatasheetFieldCascaderService>(DatasheetFieldCascaderService);
    jest.spyOn(datasheetService, 'getBasePacks').mockImplementation(
      (dstId: string): Promise<IBaseDatasheetPack[]> => {
        if (dstId === 'datasheetId') {
          return Promise.resolve([
            {
              datasheet: {
                id: 'datasheetId',
                name: 'datasheet name',
                revision: 1,
              } as any,
              snapshot: {
                meta: {
                  views: [
                    {
                      id: 'viewId',
                      name: 'Grid View',
                      rows: [{ recordId: 'recA' }, { recordId: 'recB' }, { recordId: 'recC' }, { recordId: 'recD' }],
                      type: 1,
                      columns: [{ fieldId: 'fldA' }, { fieldId: 'fldB' }, { fieldId: 'fldC' }],
                      autoSave: false,
                      frozenColumnCount: 1,
                    },
                  ] as IViewProperty[],
                  fieldMap: {
                    fldC: {
                      id: 'fldC',
                      name: 'level-3',
                      type: 19,
                      property: {},
                    },
                    fldA: {
                      id: 'fldA',
                      name: 'level-1',
                      type: 19,
                      property: {},
                    },
                    fldB: {
                      id: 'fldB',
                      name: 'level-2',
                      type: 19,
                      property: {},
                    },
                  } as IFieldMap,
                } as IMeta,
                recordMap: {
                  recA: {
                    id: 'recA',
                    data: {
                      fldC: [{ text: 'node-3-1', type: 1 }],
                      fldA: [{ text: 'node-1-1', type: 1 }],
                      fldB: [{ text: 'node-2-1', type: 1 }],
                    },
                    commentCount: 0,
                  },
                  recB: {
                    id: 'recB',
                    data: {
                      fldC: [{ text: 'node-3-4', type: 1 }],
                      fldA: [{ text: 'node-1-2', type: 1 }],
                      fldB: [{ text: 'node-2-3', type: 1 }],
                    },
                    commentCount: 0,
                  },
                  recC: {
                    id: 'recC',
                    data: {
                      fldC: [{ text: 'node-3-3', type: 1 }],
                      fldA: [{ text: 'node-1-1', type: 1 }],
                      fldB: [{ text: 'node-2-2', type: 1 }],
                    },
                    commentCount: 0,
                  },
                  recD: {
                    id: 'recD',
                    data: {
                      fldC: [{ text: 'node-3-2', type: 1 }],
                      fldA: [{ text: 'node-1-1', type: 1 }],
                      fldB: [{ text: 'node-2-1', type: 1 }],
                    },
                    commentCount: 0,
                  },
                } as IRecordMap,
                datasheetId: 'datasheetId',
              },
            },
          ]);
        }
        if(dstId === 'advancedDatasheet') {
          return Promise.resolve([
            {
              datasheet: {
                id: 'advancedDatasheet',
                name: 'datasheet name',
                revision: 1,
              } as any,
              snapshot: {
                meta: {
                  views: [
                    {
                      id: 'viewId',
                      name: 'Grid View',
                      rows: [],
                      type: 1,
                      columns: [{ fieldId: 'fldA' }, { fieldId: 'fldB' }, { fieldId: 'fldC' }],
                      autoSave: false,
                      frozenColumnCount: 1,
                    },
                    {
                      id: 'viewId02',
                      name: 'Grid View',
                      rows: [],
                      type: 1,
                      columns: [{ fieldId: 'fldA', hidden: true }, { fieldId: 'fldB' }, { fieldId: 'fldC' }],
                      autoSave: false,
                      frozenColumnCount: 1,
                    },
                  ] as IViewProperty[],

                  fieldMap: {
                    fldC: {
                      id: 'fldC',
                      name: 'level-3',
                      type: FieldType.AutoNumber,
                      property: {},
                    } as any,
                    fldA: {
                      id: 'fldA',
                      name: 'level-1',
                      type: 19,
                      property: {},
                    },
                    fldB: {
                      id: 'fldB',
                      name: 'level-2',
                      type: 19,
                      property: {},
                    },
                  } as IFieldMap,
                } as IMeta,
                recordMap: { } as IRecordMap,
                datasheetId: 'advancedDatasheet',
              },
            },
          ]);
        }
        return Promise.resolve([]);
      },
    );
    jest.spyOn(restService, 'getFieldPermission').mockImplementation(
      (headers: IAuthHeader, nodeId: string, _shareId?: string): Promise<IFieldPermissionMap> => {
        if (headers?.token === 'token' && nodeId === 'datasheetId') {
          return Promise.resolve({
            fldA: {
              role: Role.Manager,
              setting: {
                formSheetAccessible: true,
              },
              permission: {
                editable: true,
                readable: true,
              },
              manageable: true,
            },
            fldB: {
              role: Role.Manager,
              setting: {
                formSheetAccessible: true,
              },
              permission: {
                editable: true,
                readable: true,
              },
              manageable: true,
            },
            fldC: {
              role: Role.Manager,
              setting: {
                formSheetAccessible: true,
              },
              permission: {
                editable: true,
                readable: true,
              },
              manageable: true,
            },
          });
        }
        if (headers?.token === 'unreadableToken' && nodeId === 'datasheetId') {
          return Promise.resolve({
            fldA: {
              role: Role.None,
              setting: {
                formSheetAccessible: false,
              },
              permission: {
                editable: false,
                readable: false,
              },
              manageable: false,
            },
            fldB: {
              role: Role.None,
              setting: {
                formSheetAccessible: false,
              },
              permission: {
                editable: false,
                readable: false,
              },
              manageable: false,
            },
            fldC: {
              role: Role.None,
              setting: {
                formSheetAccessible: false,
              },
              permission: {
                editable: false,
                readable: false,
              },
              manageable: false,
            },
          });
        }
        if (headers?.token === 'normalToken' && (nodeId === 'datasheetId' || nodeId === 'advancedDatasheet')) {
          return Promise.resolve(null as any);
        }

        throw new ServerException(CommonException.SERVER_ERROR);
      },
    );
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  describe('provider init', () => {
    it('service--should not null', () => {
      expect(restService).not.toBeNull();
      expect(datasheetService).not.toBeNull();
      expect(datasheetFieldCascaderService).not.toBeNull();
    });
  });

  describe('getCascaderLinkedFields', () => {
    it('get all permission fields - should return all fields', async() => {
      const datasheet = await cascaderDataBusService.getDatasheet('datasheetId');
      const view = await cascaderDataBusService.getView(datasheet!, { auth: { token: 'token' }, viewId: 'viewId' });
      const linkedFields = await datasheetFieldCascaderService.getCascaderLinkedFields(view!.view);
      expect(linkedFields.length).toEqual(3);
    });

    it('have unreadable field--should remove unreadable fields', async() => {
      const datasheet = await cascaderDataBusService.getDatasheet('datasheetId');
      const view = await cascaderDataBusService.getView(datasheet!, { auth: { token: 'unreadableToken' }, viewId: 'viewId' });
      const linkedFields = await datasheetFieldCascaderService.getCascaderLinkedFields(view!.view);
      expect(linkedFields.length).toEqual(0);
    });

    it('without field  permission--should return all fields', async() => {
      const datasheet = await cascaderDataBusService.getDatasheet('datasheetId');
      const view = await cascaderDataBusService.getView(datasheet!, { auth: { token: 'normalToken' }, viewId: 'viewId' });
      const linkedFields = await datasheetFieldCascaderService.getCascaderLinkedFields(view!.view);
      expect(linkedFields.length).toEqual(3);
    });

    it('should be filter advanced field', async() => {
      const datasheet = await cascaderDataBusService.getDatasheet('advancedDatasheet');
      const view = await cascaderDataBusService.getView(datasheet!, { auth: { token: 'normalToken' }, viewId: 'viewId' });
      const linkedFields = await datasheetFieldCascaderService.getCascaderLinkedFields(view!.view);
      expect(linkedFields.length).toEqual(2);
    });

    it('should be filter advanced field', async() => {
      const datasheet = await cascaderDataBusService.getDatasheet('advancedDatasheet');
      const view = await cascaderDataBusService.getView(datasheet!, { auth: { token: 'normalToken' }, viewId: 'viewId' });
      const linkedFields = await datasheetFieldCascaderService.getCascaderLinkedFields(view!.view);
      expect(linkedFields.length).toEqual(2);
    });

    it('should be filter advanced field then only one field', async() => {
      const datasheet = await cascaderDataBusService.getDatasheet('advancedDatasheet');
      const view = await cascaderDataBusService.getView(datasheet!, { auth: { token: 'normalToken' }, viewId: 'viewId02' });
      const linkedFields = await datasheetFieldCascaderService.getCascaderLinkedFields(view!.view);
      const fieldIds: string[] = slice(linkedFields, 0, 2).map(i => i.id);
      expect(linkedFields.length).toEqual(1);
      expect(fieldIds.length).toEqual(1);
    });
  });

  describe('getCascaderLinkedRecords', () => {
    it('should return cascader list', async() => {
      const datasheet = await cascaderDataBusService.getDatasheet('datasheetId');
      const cascaderSourceDataView = await cascaderDataBusService.getView(datasheet!, { auth: { token: 'token' }, viewId: 'viewId' });
      const fieldIds: string[] = ['fldA', 'fldB', 'fldC'];
      const treeSelects = datasheetFieldCascaderService.getCascaderLinkedRecords(datasheet!, cascaderSourceDataView!, fieldIds);
      expect(treeSelects.length).toEqual(2);
      expect(treeSelects[0]!.text).toEqual('node-1-1');
      expect(treeSelects[0]!.children.length).toEqual(2);
      expect(treeSelects[0]!.children[0]!.text).toEqual('node-2-1');
      expect(treeSelects[0]!.children[0]!.children.length).toEqual(2);
      expect(treeSelects[0]!.children[0]!.children[0]!.text).toEqual('node-3-1');
      expect(treeSelects[0]!.children[0]!.children[0]!.children.length).toEqual(0);
      expect(treeSelects[0]!.children[0]!.children[1]!.text).toEqual('node-3-2');
      expect(treeSelects[0]!.children[0]!.children[1]!.children.length).toEqual(0);
      expect(treeSelects[0]!.children[1]!.text).toEqual('node-2-2');
      expect(treeSelects[0]!.children[1]!.children.length).toEqual(1);
      expect(treeSelects[0]!.children[1]!.children[0]!.text).toEqual('node-3-3');
      expect(treeSelects[0]!.children[1]!.children[0]!.children.length).toEqual(0);
      expect(treeSelects[1]!.text).toEqual('node-1-2');
      expect(treeSelects[1]!.children.length).toEqual(1);
      expect(treeSelects[1]!.children[0]!.text).toEqual('node-2-3');
      expect(treeSelects[1]!.children[0]!.children.length).toEqual(1);
      expect(treeSelects[1]!.children[0]!.children[0]!.text).toEqual('node-3-4');
      expect(treeSelects[1]!.children[0]!.children[0]!.children.length).toEqual(0);
    });
  });
});
