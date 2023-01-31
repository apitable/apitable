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
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { DatasheetRecordService } from 'database/datasheet/services/datasheet.record.service';
import { NodeInfo } from 'database/interfaces';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { NodeService } from 'node/services/node.service';
import { RestService } from 'shared/services/rest/rest.service';
import { MirrorService } from './mirror.service';

describe('DashboardService', () => {
  let app: NestFastifyApplication;
  let module: TestingModule;
  let service: MirrorService;
  let nodeService: NodeService;
  let datasheetMetaService: DatasheetMetaService;
  let datasheetRecordService: DatasheetRecordService;
  let resourceMetaRepository: ResourceMetaRepository;
  const knownMirrorId = 'mirqyLwKo4ecDxrM7e';
  const permissions: IPermissions = Object.assign({ allowEditConfigurable: false });
  const nodeInfo: NodeInfo = Object.assign({ id: knownMirrorId, name: 'Test Mirror', role: Role.Editor, nodeFavorite: false, permissions });
  const unknownMirrorId = `mir${Math.floor(Math.random()*10000).toString()}`;
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

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        MirrorService,
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
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async() => {
    await app.close();
  });

  beforeEach(() => {
    service = module.get<MirrorService>(MirrorService);
    nodeService = module.get<NodeService>(NodeService);
    datasheetMetaService = module.get<DatasheetMetaService>(DatasheetMetaService);
    datasheetRecordService = module.get<DatasheetRecordService>(DatasheetRecordService);
    resourceMetaRepository = module.get<ResourceMetaRepository>(ResourceMetaRepository);
    jest.spyOn(resourceMetaRepository, 'selectMetaByResourceId').mockImplementation(async(mirrorId) => {
      if (mirrorId === knownMirrorId) {
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
      expect(datasheetMetaService).toBeDefined();
      expect(datasheetRecordService).toBeDefined();
      expect(resourceMetaRepository).toBeDefined();
    });

  });

  describe('test fetchDataPack', () => {

    it('should return empty widgetInstallations with an unknown/deleted dashboard ID', async() => {
      const res = await service.fetchDataPack(unknownMirrorId, auth, { internal: false });
      expect(res.snapshot.meta).toEqual({});
    });

    it('should return widgetInstallations with an known dashboard ID', async() => {
      const res = await service.fetchDataPack(knownMirrorId, auth, { internal: false });
      expect(res.snapshot.meta).toEqual(meta);
    });

    it('should return empty widgetMap without layout', async() => {
      const res = await service.fetchDataPack(knownMirrorId, auth, { internal: false });
      expect(res.snapshot.meta).toBeUndefined();
    });

  });
  
});
