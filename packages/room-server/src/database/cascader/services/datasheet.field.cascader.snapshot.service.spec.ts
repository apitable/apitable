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
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { RestService } from 'shared/services/rest/rest.service';
import { CascaderChildren } from '../models/cascader.children';
import { DatasheetFieldCascaderSnapshotService } from './datasheet.field.cascader.snapshot.service';
import { DatasheetCascaderFieldRepository } from '../repositories/datasheet.cascader.field.repository';
import { IFieldMap, IMeta, IRecordMap, IViewProperty, Role } from '@apitable/core';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { CommandService } from 'database/command/services/command.service';
import { NodeService } from 'node/services/node.service';
import { UnitService } from 'unit/services/unit.service';
import { CascaderDatabusService } from './cascader.databus.service';

function getDepthOfNode(root: CascaderChildren): number {
  let depth = 0;
  const queue: { depth: number; nodes: CascaderChildren[] }[] = [];
  queue.push({
    depth: 0,
    nodes: root.children,
  });
  while (queue.length != 0) {
    const node = queue.shift()!;
    depth = node.depth;
    for (const children of node.nodes) {
      queue.push({
        depth: depth + 1,
        nodes: children.children,
      });
    }
  }
  return depth;
}

describe('DatasheetFieldTreeSelectService', () => {
  let moduleFixture: TestingModule;
  let datasheetFieldCascaderSnapshotService: DatasheetFieldCascaderSnapshotService;
  let restService: RestService;
  let datasheetService: DatasheetService;
  let datasheetCascaderFieldRepository: DatasheetCascaderFieldRepository;

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
          provide: NodeService,
          useValue: {
            getSpaceIdByNodeId: jest.fn(),
          }
        },
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
        DatasheetFieldCascaderSnapshotService,
        {
          provide: DatasheetCascaderFieldRepository,
          useValue: {
            selectRecordData: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            manager: {
              transaction: jest.fn(),
            }
          },
        },
      ],
    }).compile();
    restService = moduleFixture.get<RestService>(RestService);
    datasheetService = moduleFixture.get<DatasheetService>(DatasheetService);
    datasheetFieldCascaderSnapshotService = moduleFixture.get<DatasheetFieldCascaderSnapshotService>(DatasheetFieldCascaderSnapshotService);
    // nodeService = module.get<NodeService>(NodeService);
    datasheetCascaderFieldRepository = moduleFixture.get<DatasheetCascaderFieldRepository>(DatasheetCascaderFieldRepository);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should returns tree select nodes snapshot when given snapshot records', async() => {
    jest.spyOn(datasheetCascaderFieldRepository, 'selectRecordData').mockResolvedValue([
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld35: { text: 'level-2-1' },
          linkedFld24: { text: 'level-3-1' },
        },
        linkedRecordId: 'linked1',
        createdBy: '41',
      },
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld35: { text: 'level-2-2' },
          linkedFld24: { text: 'level-3-2' },
        },
        linkedRecordId: 'linked2',
        createdBy: '41',
      },
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld35: { text: 'level-2-3' },
          linkedFld24: { text: 'level-3-3' },
        },
        linkedRecordId: 'linked3',
        createdBy: '41',
      },
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld35: { text: 'level-2-2' },
          linkedFld24: { text: 'level-3-4' },
        },
        linkedRecordId: 'linked4',
        createdBy: '41',
      },
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld35: { text: 'level-2-3' },
          linkedFld24: { text: 'level-3-5' },
        },
        linkedRecordId: 'linked5',
        createdBy: '41',
      },
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-2' },
          linkedFld35: { text: 'level-2-4' },
          linkedFld24: { text: 'level-3-6' },
        },
        linkedRecordId: 'linked6',
        createdBy: '41',
      },
    ] as any[]);
    const cascaderNodes = await datasheetFieldCascaderSnapshotService.getCascaderSnapshot({
      datasheetId: 'dst41',
      fieldId: 'fld41',
      linkedFieldIds: ['linkedFld41', 'linkedFld35', 'linkedFld24'],
    });
    // have two trees.
    expect(cascaderNodes.treeSelectNodes.length).toEqual(2);
    expect(cascaderNodes.treeSelectNodes[0]!.text).toEqual('level-1-1');
    // the first tree has three children.
    expect(cascaderNodes.treeSelectNodes[0]!.children.length).toEqual(3);
    // depth of the first tree is 2.
    expect(getDepthOfNode(cascaderNodes.treeSelectNodes[0]!)).toEqual(2);
    expect(cascaderNodes.treeSelectNodes[0]!.children[0]!.text).toEqual('level-2-1');
    expect(cascaderNodes.treeSelectNodes[0]!.children[0]!.children[0]!.text).toEqual('level-3-1');
    expect(cascaderNodes.treeSelectNodes[0]!.children[1]!.text).toEqual('level-2-2');
    expect(cascaderNodes.treeSelectNodes[0]!.children[1]!.children[0]!.text).toEqual('level-3-2');
    expect(cascaderNodes.treeSelectNodes[0]!.children[1]!.children[1]!.text).toEqual('level-3-4');
    expect(cascaderNodes.treeSelectNodes[0]!.children[2]!.text).toEqual('level-2-3');
    expect(cascaderNodes.treeSelectNodes[0]!.children[2]!.children[0]!.text).toEqual('level-3-3');
    expect(cascaderNodes.treeSelectNodes[0]!.children[2]!.children[1]!.text).toEqual('level-3-5');
    expect(cascaderNodes.treeSelectNodes[1]!.text).toEqual('level-1-2');
    // the second tree has one child.
    expect(cascaderNodes.treeSelectNodes[1]!.children.length).toEqual(1);
    // depth of the second tree is 2.
    expect(getDepthOfNode(cascaderNodes.treeSelectNodes[1]!)).toEqual(2);
    expect(cascaderNodes.treeSelectNodes[1]!.children[0]!.text).toEqual('level-2-4');
    expect(cascaderNodes.treeSelectNodes[1]!.children[0]!.children[0]!.text).toEqual('level-3-6');
  });

  it('unique branch', async() => {
    jest.spyOn(datasheetCascaderFieldRepository, 'selectRecordData').mockResolvedValue([
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld35: { text: 'level-2-1' },
          linkedFld24: { text: 'level-3-1' },
        },
        linkedRecordId: 'linked1',
        createdBy: '41',
      },
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-2' },
          linkedFld35: { text: 'level-2-1' },
          linkedFld24: { text: 'level-3-2' },
        },
        linkedRecordId: 'linked2',
        createdBy: '41',
      },
      {
        spaceId: 'spc41',
        datasheetId: 'dst41',
        fieldId: 'fld41',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-3' },
          linkedFld35: { text: 'level-2-1' },
          linkedFld24: { text: 'level-3-3' },
        },
        linkedRecordId: 'linked3',
        createdBy: '41',
      },
    ] as any[]);
    const treeSelects = await datasheetFieldCascaderSnapshotService.getCascaderSnapshot({
      datasheetId: 'dst41',
      fieldId: 'fld41',
      linkedFieldIds: ['linkedFld41', 'linkedFld35', 'linkedFld24'],
    });
    expect(treeSelects.treeSelectNodes.length).toEqual(3);
    expect(treeSelects.treeSelectNodes[0]!.children.length).toEqual(1);
    expect(treeSelects.treeSelectNodes[0]!.children[0]!.children.length).toEqual(1);
    expect(treeSelects.treeSelectNodes[1]!.children.length).toEqual(1);
    expect(treeSelects.treeSelectNodes[1]!.children[0]!.children.length).toEqual(1);
    expect(treeSelects.treeSelectNodes[2]!.children.length).toEqual(1);
    expect(treeSelects.treeSelectNodes[2]!.children[0]!.children.length).toEqual(1);
  });

  it('given lack text cell record when given snapshot records', async() => {
    jest.spyOn(datasheetCascaderFieldRepository, 'selectRecordData').mockResolvedValue([
      {
        spaceId: 'spc24',
        datasheetId: 'dst24',
        fieldId: 'fld24',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld35: { text: 'level-2-1' },
          linkedFld24: { text: 'level-3-1' },
          linkedFld21: { text: 'unreachable' },
          linkedFld20: { text: 'unreachable' },
        },
        linkedRecordId: 'linked1',
        createdBy: '41',
      },
      {
        spaceId: 'spc24',
        datasheetId: 'dst24',
        fieldId: 'fld24',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld35: { text: 'level-2-2' },
          linkedFld21: { text: 'unreachable' },
        },
        linkedRecordId: 'linked2',
        createdBy: '41',
      },
      {
        spaceId: 'spc24',
        datasheetId: 'dst24',
        fieldId: 'fld24',
        linkedRecordData: {
          linkedFld41: { text: 'level-1-1' },
          linkedFld24: { text: 'level-3-2' },
          linkedFld21: { text: 'unreachable' },
        },
        linkedRecordId: 'linked3',
        createdBy: '41',
      },
    ] as any[]);
    const cascaderNodes = await datasheetFieldCascaderSnapshotService.getCascaderSnapshot({
      datasheetId: 'dst24',
      fieldId: 'fld24',
      linkedFieldIds: ['linkedFld41', 'linkedFld35', 'linkedFld24', 'linkedFld22', 'linkedFld21'],
    });
    // have one root tree.
    expect(cascaderNodes.treeSelectNodes.length).toEqual(1);
    // the first tree has two children.
    expect(cascaderNodes.treeSelectNodes[0]!.children.length).toEqual(2);
    // depth of the first tree is 2.
    expect(getDepthOfNode(cascaderNodes.treeSelectNodes[0]!)).toEqual(2);
    // the first tree's second tree has empty children.
    expect(cascaderNodes.treeSelectNodes[0]!.children[1]!.children.length).toEqual(0);
  });

  it('should be pass when save snapshot', async() => {
    jest.spyOn(datasheetService, 'getBasePacks').mockResolvedValue([
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
    jest.spyOn(restService, 'getFieldPermission').mockResolvedValue({
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
    await datasheetFieldCascaderSnapshotService.updateCascaderSnapshot({}, '2023', {
      spaceId: 'spaceId',
      datasheetId: 'datasheetId',
      fieldId: 'fieldId',
      linkedDatasheetId: 'datasheetId',
      linkedViewId: 'viewId',
    });
  });
});
