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
import { NodeInfo } from 'database/interfaces';
import { MetaService } from 'database/resource/services/meta.service';
import { NodeService } from 'node/services/node.service';
import { RestService } from 'shared/services/rest/rest.service';
import { DashboardService } from './dashboard.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('DashboardService', () => {
  let moduleFixture: TestingModule;
  let service: DashboardService;
  let nodeService: NodeService;
  let restService: RestService;
  let resourceMetaService: MetaService;
  const knownDashboardId = 'dstNnnfdsffsbadaOd23';
  const permissions: IPermissions = Object.assign({ allowEditConfigurable: false });
  const nodeInfo: NodeInfo = Object.assign({ id: knownDashboardId, name: 'Test Dashboard', role: Role.Editor, nodeFavorite: false, permissions });
  const unknownDashboard = `dst${Math.floor(Math.random()*10000).toString()}`;
  const token = process.env.BEARER_TOKEN||'';
  const cookie = 'lang=en-US;';
  const auth = { token, cookie };
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
  
  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
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
        {
          provide: MetaService,
          useValue: {
            selectMetaByResourceId: jest.fn()
          }
        },
      ],
    }).compile();
    service = moduleFixture.get<DashboardService>(DashboardService);
    nodeService = moduleFixture.get<NodeService>(NodeService);
    restService = moduleFixture.get<RestService>(RestService);
    resourceMetaService = moduleFixture.get<MetaService>(MetaService);
    jest.spyOn(resourceMetaService, 'selectMetaByResourceId').mockImplementation((dashboardId) => {
      if (dashboardId === knownDashboardId) {
        return Promise.resolve(meta);
      }
      return Promise.resolve({});
    });
    jest.spyOn(nodeService, 'getNodeDetailInfo').mockImplementation(() => {
      return Promise.resolve({ node: nodeInfo });
    });

  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  describe('All services exist', () => {

    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(nodeService).toBeDefined();
      expect(restService).toBeDefined();
      expect(resourceMetaService).toBeDefined();
    });

  });

  describe('test fetchDashboardPack', () => {

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const result = await service.fetchDashboardPack(unknownDashboard, auth);
      expect(result.dashboard.snapshot.widgetInstallations).toEqual({});
    });

    it('should return widgetInstallations with an known dashboard ID', async() => {
      const result = await service.fetchDashboardPack(knownDashboardId, auth);
      expect(result.dashboard.snapshot.widgetInstallations).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const result = await service.fetchDashboardPack(knownDashboardId, auth);
      expect(result.dashboard.snapshot.widgetInstallations.layout).toBeUndefined();
      expect(result.widgetMap).toEqual({});
    });

  });

  describe('test fetchTemplateDashboardPack', () => {

    const templateId = 'templateId';

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const result = await service.fetchTemplateDashboardPack(templateId, unknownDashboard, auth);
      expect(result.dashboard.snapshot.widgetInstallations).toEqual({});
      expect(result.widgetMap).toEqual({});
    });

    it('should return meta with an known dashboard ID', async() => {
      const result = await service.fetchTemplateDashboardPack(templateId, knownDashboardId, auth);
      expect(result.widgetMap).toEqual({});
      expect(result.dashboard.snapshot.widgetInstallations).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const result = await service.fetchTemplateDashboardPack(templateId, knownDashboardId, auth);
      expect(result.dashboard.snapshot.widgetInstallations.layout).toBeUndefined();
      expect(result.widgetMap).toEqual({});
    });

  });

  describe('test fetchShareDashboardPack', () => {

    const sharedId = 'shareId';

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const result = await service.fetchShareDashboardPack(sharedId, unknownDashboard, auth);
      expect(result.dashboard.snapshot.widgetInstallations).toEqual({});
    });

    it('should return widgetInstallations with an known dashboard ID', async() => {
      const result = await service.fetchShareDashboardPack(sharedId, knownDashboardId, auth);
      expect(result.dashboard.snapshot.widgetInstallations).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const result = await service.fetchShareDashboardPack(sharedId, knownDashboardId, auth);
      expect(result.dashboard.snapshot.widgetInstallations.layout).toBeUndefined();
      expect(result.widgetMap).toEqual({});
    });

  });

  describe('test fetchPack', () => {

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const res = await service.fetchPack(unknownDashboard, auth, { node: nodeInfo });
      expect(res.dashboard.snapshot.widgetInstallations).toEqual({});
    });

    it('should return widgetInstallations with an known dashboard ID', async() => {
      const res = await service.fetchPack(knownDashboardId, auth, { node: nodeInfo });
      expect(res.dashboard.snapshot.widgetInstallations).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const res = await service.fetchPack(knownDashboardId, auth, { node: nodeInfo });
      expect(res.dashboard.snapshot.widgetInstallations.layout).toBeUndefined();
      expect(res.widgetMap).toEqual({});
    });

  });
  
});
