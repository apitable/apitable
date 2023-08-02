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
import { NodeService } from './node.service';
import { UnitMemberService } from 'unit/services/unit.member.service';
import { NodePermissionService } from './node.permission.service';
import { NodeRepository } from '../repositories/node.repository';
import { NodeRelRepository } from '../repositories/node.rel.repository';
import { MetaService } from 'database/resource/services/meta.service';
import { DatasheetException, PermissionException, ServerException } from 'shared/exception';
import { Test, TestingModule } from '@nestjs/testing';
import { NodeDescriptionService } from './node.description.service';
import { NodeShareSettingService } from './node.share.setting.service';

describe('Test NodeService', () => {
  let moduleFixture: TestingModule;
  let nodeService: NodeService;
  let nodeRepository: NodeRepository;
  let unitMemberService: UnitMemberService;
  let nodePermissionService: NodePermissionService;
  let nodeRelRepository: NodeRelRepository;
  let metaService: MetaService;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: UnitMemberService,
          useValue: {
            checkUserIfInSpace: jest.fn(),
          },
        },
        {
          provide: NodeDescriptionService,
          useValue: {},
        },
        {
          provide: NodeShareSettingService,
          useValue: {},
        },
        {
          provide: NodePermissionService,
          useValue: {
            getNodeRole: jest.fn(),
            getNodePermission: jest.fn(),
          },
        },
        {
          provide: NodeRepository,
          useValue: {
            selectCountByNodeId: jest.fn(),
            selectSpaceIdByNodeId: jest.fn(),
            selectTemplateCountByNodeId: jest.fn(),
            selectExtraByNodeId: jest.fn(),
          },
        },
        {
          provide: NodeRelRepository,
          useValue: {
            selectMainNodeIdByRelNodeId: jest.fn(),
            selectRelNodeIdByMainNodeId: jest.fn(),
          },
        },
        {
          provide: MetaService,
          useValue: {
            selectRevisionByResourceId: jest.fn(),
          },
        },
        NodeService,
      ],
    }).compile();
    nodeRepository = moduleFixture.get<NodeRepository>(NodeRepository);
    unitMemberService = moduleFixture.get<UnitMemberService>(UnitMemberService);
    nodePermissionService = moduleFixture.get<NodePermissionService>(NodePermissionService);
    nodeRelRepository = moduleFixture.get<NodeRelRepository>(NodeRelRepository);
    metaService = moduleFixture.get<MetaService>(MetaService);
    nodeService = moduleFixture.get<NodeService>(NodeService);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be pass node exist', async() => {
    jest.spyOn(nodeRepository, 'selectCountByNodeId').mockResolvedValue(1);
    await nodeService.checkNodeIfExist('1');
  });

  it('should be throw except check node not exist', async() => {
    jest.spyOn(nodeRepository, 'selectCountByNodeId').mockResolvedValue(0);
    await expect(async() => await nodeService.checkNodeIfExist('1')).rejects.toThrow(PermissionException.NODE_NOT_EXIST.message);
  });

  it('should be return space id by node id', async() => {
    jest.spyOn(nodeRepository, 'selectSpaceIdByNodeId').mockResolvedValue({ spaceId: '1' });
    const spaceId = await nodeService.getSpaceIdByNodeId('1');
    expect(spaceId).toEqual('1');
  });

  it('should be throw when get space id by node id', async() => {
    jest.spyOn(nodeRepository, 'selectSpaceIdByNodeId').mockResolvedValue({} as any);
    await expect(async() => await nodeService.getSpaceIdByNodeId('1')).rejects.toThrow(PermissionException.NODE_NOT_EXIST.message);
  });

  it('should be pass user in space', async() => {
    jest.spyOn(unitMemberService, 'checkUserIfInSpace');
    jest.spyOn(nodeRepository, 'selectSpaceIdByNodeId').mockResolvedValue({ spaceId: '1' });
    const spaceId = await nodeService.checkUserForNode('1', '1');
    expect(spaceId).toEqual('1');
  });

  it('should be throw user no in space', async() => {
    jest.spyOn(unitMemberService, 'checkUserIfInSpace').mockRejectedValue(new ServerException(PermissionException.ACCESS_DENIED));
    jest.spyOn(nodeRepository, 'selectSpaceIdByNodeId').mockResolvedValue({ spaceId: '1' });
    await expect(async() => await nodeService.checkUserForNode('1', '1')).rejects.toThrow(PermissionException.ACCESS_DENIED.message);
  });

  it('should be pass check node permission', async() => {
    jest.spyOn(nodePermissionService, 'getNodeRole').mockResolvedValue({ readable: true } as any);
    await nodeService.checkNodePermission('1', { cookie: 'true' });
  });

  it('should be throw no node permission', async() => {
    jest.spyOn(nodePermissionService, 'getNodeRole').mockResolvedValue({} as any);
    await expect(async() => {
      await nodeService.checkNodePermission('1', { cookie: 'false' });
    }).rejects.toThrow(PermissionException.ACCESS_DENIED.message);
  });

  it('should be return main node id', async() => {
    jest.spyOn(nodeRelRepository, 'selectMainNodeIdByRelNodeId').mockResolvedValue({ mainNodeId: '1' } as any);
    const nodeId = await nodeService.getMainNodeId('1');
    expect(nodeId).toEqual('1');
  });

  it('should be throw node no exist', async() => {
    jest.spyOn(nodeRelRepository, 'selectMainNodeIdByRelNodeId').mockResolvedValue({} as any);
    await expect(async() => {
      await nodeService.getMainNodeId('1');
    }).rejects.toThrow(DatasheetException.DATASHEET_NOT_EXIST.message);
  });

  it('should be return rel node by main node', async() => {
    jest.spyOn(nodeRelRepository, 'selectRelNodeIdByMainNodeId').mockResolvedValue([] as any);
    const nodeIds = await nodeService.getRelNodeIds('1');
    expect(nodeIds.length).toEqual(0);
  });

  it('should be return permission', async() => {
    jest.spyOn(nodePermissionService, 'getNodePermission').mockResolvedValue({} as any);
    const permission = await nodeService.getPermissions('1', { cookie: 'true' }, {} as any);
    expect(permission).toEqual({});
  });

  it('should be return node is template', async() => {
    jest.spyOn(nodeRepository, 'selectTemplateCountByNodeId').mockResolvedValue(1);
    const isTemplate = await nodeService.isTemplate('1');
    expect(isTemplate).toBeTruthy();
  });

  it('should be return node is no template', async() => {
    jest.spyOn(nodeRepository, 'selectTemplateCountByNodeId').mockResolvedValue(0);
    const isTemplate = await nodeService.isTemplate('-1');
    expect(isTemplate).toBeFalsy();
  });

  it('should be return revision', async() => {
    jest.spyOn(metaService, 'selectRevisionByResourceId').mockResolvedValue({ revision: '1' } as any);
    const revision = await nodeService.getRevisionByResourceId('1');
    expect(revision).toEqual(1);
  });

  it('should be return whether record history', async() => {
    jest.spyOn(nodeRepository, 'selectExtraByNodeId').mockResolvedValue({ extra: { showRecordHistory: true }});
    const isShowed = await nodeService.showRecordHistory('1');
    expect(isShowed).toBeTruthy();
  });

  it('should be throw no show record history', async() => {
    jest.spyOn(nodeRepository, 'selectExtraByNodeId').mockResolvedValue({ extra: { showRecordHistory: false }});
    await expect(async() => {
      await nodeService.showRecordHistory('-1', true);
    }).rejects.toThrow(DatasheetException.SHOW_RECORD_HISTORY_NOT_PERMISSION.message);
  });
});
