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

import { IPermissions, IResourceMeta, Role } from '@apitable/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { DatasheetRepository } from 'database/datasheet/repositories/datasheet.repository';
import { NodeInfo } from 'database/interfaces';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { NodeRelRepository } from 'node/repositories/node.rel.repository';
import { NodeRepository } from 'node/repositories/node.repository';
import { PermissionException } from 'shared/exception';
import { RestService } from 'shared/services/rest/rest.service';
import { UnitMemberService } from 'unit/services/unit.member.service';
import { NodeDescriptionService } from './node.description.service';
import { NodePermissionService } from './node.permission.service';
import { NodeService } from './node.service';
import { NodeShareSettingService } from './node.share.setting.service';

describe('NodeService', () => {
  let app: NestFastifyApplication;
  let module: TestingModule;
  let nodeService: NodeService;
  let memberService: UnitMemberService;
  let nodeDescService: NodeDescriptionService;
  let nodeShareSettingService: NodeShareSettingService;
  let nodePermissionService: NodePermissionService;
  let nodeRepository: NodeRepository;
  let nodeRelRepository: NodeRelRepository;
  let datasheetRepository: DatasheetRepository;
  let resourceMetaRepository: ResourceMetaRepository;
  const knownNodeId = 'dstNnnfdsffsbadad23';
  const permissions: IPermissions = Object.assign({ allowEditConfigurable: false });
  const nodeInfo: NodeInfo = Object.assign({ id: knownNodeId, name: 'Test Datasheet/Mirror', role: Role.Editor, nodeFavorite: false, permissions });
  const unknownNodeId = `dstxa${Math.floor(Math.random()*10000).toString()}`;
  // const token = process.env.BEARER_TOKEN||'';
  // const cookie = 'lang=en-US;';
  // const auth = { token, cookie };
  const meta: IResourceMeta = {
    views: [
      {
        id: 'viwfUrzVmzKEr',
        name: 'Grid view',
        rows: [
          {
            recordId: 'recEnPLc1slnN'
          },
        ],
        type: 1,
        columns: [
          {
            fieldId: 'fldG1da3GclFc',
            statType: 1
          },
        ],
        autoSave: false,
        frozenColumnCount: 1
      }
    ],
    fieldMap: {
      fldG1da3GclFc: {
        id: 'fldG1da3GclFc',
        name: 'Title',
        type: 19,
        property: {
          defaultValue: ''
        }
      },
    }
  };

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        NodeService,
        { 
          provide: RestService, 
          useValue: { 
            hasLogin: jest.fn(), 
            fetchMe: jest.fn() 
          }
        }, 
        ResourceMetaRepository
      ],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async() => {
    await app.close();
  });

  beforeEach(() => {
    nodeService = module.get<NodeService>(NodeService);
    memberService = module.get<UnitMemberService>(UnitMemberService);
    nodeDescService = module.get<NodeDescriptionService>(NodeDescriptionService);
    nodeShareSettingService = module.get<NodeShareSettingService>(NodeShareSettingService);
    nodePermissionService = module.get<NodePermissionService>(NodePermissionService);
    nodeRepository = module.get<NodeRepository>(NodeRepository);
    nodeRelRepository = module.get<NodeRelRepository>(NodeRelRepository);
    datasheetRepository = module.get<DatasheetRepository>(DatasheetRepository);
    resourceMetaRepository = module.get<ResourceMetaRepository>(ResourceMetaRepository);
    jest.spyOn(resourceMetaRepository, 'selectMetaByResourceId').mockImplementation(async(dashboardId) => {
      if (dashboardId === knownNodeId) {
        return await Promise.resolve(meta);
      }
      return await Promise.resolve({});
    });
    jest.spyOn(nodeRepository, 'selectCountByNodeId').mockImplementation(async(nodeId: string) => {
      if (nodeId === knownNodeId) {
        return await Promise.resolve(1);
      }
      return await Promise.resolve(0);

    });
    jest.spyOn(nodeService, 'getNodeDetailInfo').mockImplementation(async() => {
      return await Promise.resolve({ node: nodeInfo });
    });

  });

  describe('All services exist', () => {

    it('should be defined', () => {
      expect(nodeService).toBeDefined();
      expect(memberService).toBeDefined();
      expect(nodeDescService).toBeDefined();
      expect(nodeShareSettingService).toBeDefined();
      expect(nodePermissionService).toBeDefined();
      expect(nodeRepository).toBeDefined();
      expect(nodeRelRepository).toBeDefined();
      expect(datasheetRepository).toBeDefined();
      expect(resourceMetaRepository).toBeDefined();
    });

  });

  describe('test checkNodeIfExist', () => {

    it('should execute success with an known node ID', async() => {
      expect(await nodeService.checkNodeIfExist(knownNodeId)).not.toThrowError();
    });

    it('should throw error with an unknown node ID', async() => {
      try {
        await nodeService.checkNodeIfExist(unknownNodeId);
      } catch (error) {
        expect((error as any).message).toEqual(PermissionException.NODE_NOT_EXIST.getMessage());
      }
    });

  });

});
