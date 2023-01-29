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
import { NodeInfo } from 'database/interfaces';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { NodeService } from 'node/services/node.service';
import { RestService } from 'shared/services/rest/rest.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let app: NestFastifyApplication;
  let module: TestingModule;
  let service: DashboardService;
  let nodeService: NodeService;
  let restService: RestService;
  let resourceMetaRepository: ResourceMetaRepository;
  const knownDashboardId = 'dstNnnfdsffsbadaOd23';
  const permissions: IPermissions = Object.assign({ allowEditConfigurable: false });
  const nodeInfo: NodeInfo = Object.assign({ id: knownDashboardId, name: 'Test Dashboard', role: Role.Editor, nodeFavorite: false, permissions });
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
  const token = 'token';
  const cookie = '';

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        DashboardService,
        { 
          provide: NodeService, 
          useValue: { 
            getNodeDetailInfo: jest.fn() 
          }
        }, 
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
    // module = await Test.createTestingModule({
    //   imports: [AppModule],
    // }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async() => {
    await app.close();
  });

  beforeEach(() => {
    service = module.get<DashboardService>(DashboardService);
    nodeService = module.get<NodeService>(NodeService);
    restService = module.get<RestService>(RestService);
    resourceMetaRepository = module.get<ResourceMetaRepository>(ResourceMetaRepository);
    jest.spyOn(resourceMetaRepository, 'selectMetaByResourceId').mockImplementation(async(dashboardId) => {
      if (dashboardId === knownDashboardId) {
        return await Promise.resolve(meta);
      }
      return await Promise.resolve({});
    });
    jest.spyOn(nodeService, 'getNodeDetailInfo').mockImplementation(async() => {
      return await Promise.resolve({ node: nodeInfo });
    });

  });

  describe('All services exist', () => {

    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(nodeService).toBeDefined();
      expect(restService).toBeDefined();
      expect(resourceMetaRepository).toBeDefined();
    });

  });

  describe('test fetchDashboardPack', () => {

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const result = await service.fetchDashboardPack(Math.floor(Math.random()*10000).toString(), { token, cookie });
      expect(result.dashboard.snapshot.widgetInstallations).toEqual({});
    });

    it('should return widgetInstallations with an known dashboard ID', async() => {
      const result = await service.fetchDashboardPack(knownDashboardId, { token, cookie });
      console.log(`test log: ${result.dashboard}`);
      expect(result.dashboard.snapshot.widgetInstallations).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const result = await service.fetchDashboardPack(knownDashboardId, { token, cookie });
      expect(result.dashboard.snapshot.widgetInstallations.layout).toBeUndefined();
      expect(result.widgetMap).toEqual({});
    });

  });

  describe('test fetchTemplateDashboardPack', () => {

    const templateId = 'templateId';

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const result = await service.fetchTemplateDashboardPack(templateId, Math.floor(Math.random()*10000).toString(), { token, cookie });
      expect(result.dashboard.snapshot.widgetInstallations).toEqual({});
    });

    it('should return widgetInstallations with an known dashboard ID', async() => {
      const result = await service.fetchTemplateDashboardPack(templateId, knownDashboardId, { token, cookie });
      expect(result.dashboard.snapshot.widgetInstallations).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const result = await service.fetchTemplateDashboardPack(templateId, knownDashboardId, { token, cookie });
      expect(result.dashboard.snapshot.widgetInstallations.layout).toBeUndefined();
      expect(result.widgetMap).toEqual({});
    });

  });

  describe('test fetchShareDashboardPack', () => {

    const sharedId = 'shareId';

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const result = await service.fetchShareDashboardPack(sharedId, Math.floor(Math.random()*10000).toString(), { token, cookie });
      expect(result.dashboard.snapshot.widgetInstallations).toEqual({});
    });

    it('should return widgetInstallations with an known dashboard ID', async() => {
      const result = await service.fetchShareDashboardPack(sharedId, knownDashboardId, { token, cookie });
      expect(result.dashboard.snapshot.widgetInstallations).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const result = await service.fetchShareDashboardPack(sharedId, knownDashboardId, { token, cookie });
      expect(result.dashboard.snapshot.widgetInstallations.layout).toBeUndefined();
      expect(result.widgetMap).toEqual({});
    });

  });

  describe('test fetchPack', () => {

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const result = await service.fetchPack(Math.floor(Math.random()*10000).toString(), { token, cookie }, { node: nodeInfo });
      expect(result.dashboard.snapshot.widgetInstallations).toEqual({});
    });

    it('should return widgetInstallations with an known dashboard ID', async() => {
      const result = await service.fetchPack(knownDashboardId, { token, cookie }, { node: nodeInfo });
      expect(result.dashboard.snapshot.widgetInstallations).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const result = await service.fetchPack(knownDashboardId, { token, cookie }, { node: nodeInfo });
      expect(result.dashboard.snapshot.widgetInstallations.layout).toBeUndefined();
      expect(result.widgetMap).toEqual({});
    });

  });
  
});
