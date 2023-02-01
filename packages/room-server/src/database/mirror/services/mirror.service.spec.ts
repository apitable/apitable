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
import { DatasheetMetaRepository } from 'database/datasheet/repositories/datasheet.meta.repository';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { DatasheetRecordService } from 'database/datasheet/services/datasheet.record.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { NodeInfo } from 'database/interfaces';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { WinstonModule } from 'nest-winston';
import { NodeService } from 'node/services/node.service';
import { ServerException, DatasheetException } from 'shared/exception';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { RestService } from 'shared/services/rest/rest.service';
import { MirrorService } from './mirror.service';

describe('MirrorService', () => {
  let app: NestFastifyApplication;
  let module: TestingModule;
  let service: MirrorService;
  let nodeService: NodeService;
  let datasheetMetaService: DatasheetMetaService;
  let datasheetRecordService: DatasheetRecordService;
  let resourceMetaRepository: ResourceMetaRepository;
  let datasheetMetaRepository: DatasheetMetaRepository;
  const knownMirrorId = 'mirqyLwKo4ecDxrM7e';
  const knownRecordId = 'recqedLfdfsad2KDda';
  const relatedDatasheetId = 'dstlljhDwewfds32Dfds';
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
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
      ],
      providers: [
        MirrorService,
        DatasheetMetaService,
        { 
          provide: NodeService, 
          useValue: { 
            getNodeDetailInfo: jest.fn(),
            getMainNodeId: jest.fn() 
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
          provide: DatasheetService, 
          useValue: { 
            processField: jest.fn(()=>{
              return {};
            }), 
          }
        }, 
        { 
          provide: DatasheetRecordService, 
          useValue: { 
            getRecordsByDstId: jest.fn(), 
            getRecordsByDstIdAndRecordIds: jest.fn() 
          }
        }, 
        ResourceMetaRepository,
        DatasheetMetaRepository
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
    datasheetMetaRepository = module.get<DatasheetMetaRepository>(DatasheetMetaRepository);
    jest.spyOn(resourceMetaRepository, 'selectMetaByResourceId').mockImplementation(async(mirrorId) => {
      if (mirrorId === knownMirrorId) {
        return await Promise.resolve(meta);
      }
      return await Promise.resolve({});
    });
    jest.spyOn(datasheetMetaRepository, 'selectMetaByDstId').mockImplementation(async(datasheetId: string) => {
      if (datasheetId === relatedDatasheetId) {
        return await Promise.resolve(Object.assign({ metaData: meta, revision: 1000 }));
      }
      return await Promise.resolve(undefined);
    });
    
    jest.spyOn(nodeService, 'getNodeDetailInfo').mockImplementation(async() => {
      return await Promise.resolve({ node: nodeInfo });
    });
    jest.spyOn(nodeService, 'getMainNodeId').mockImplementation(async(nodeId: string) => {
      if (nodeId === knownMirrorId) {
        return await Promise.resolve(relatedDatasheetId);
      }
      throw new ServerException(DatasheetException.DATASHEET_NOT_EXIST);
    });
    jest.spyOn(datasheetRecordService, 'getRecordsByDstIdAndRecordIds').mockImplementation(async(dstId: string, recordIds: string[]) => {
      if (dstId === relatedDatasheetId && recordIds.includes(knownRecordId)) {
        return await Promise.resolve({ knownRecordId: { id: knownRecordId, data: {}}});
      }
      return await Promise.resolve({});
    });
    jest.spyOn(datasheetRecordService, 'getRecordsByDstId').mockImplementation(async(dstId: string) => {
      if (dstId === relatedDatasheetId) {
        return await Promise.resolve({ knownRecordId: { id: knownRecordId, data: {}}});
      }
      return await Promise.resolve({});
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

    it('should throw error with an unknown/deleted mirror ID', async() => {
      try {
        await service.fetchDataPack(unknownMirrorId, auth, { internal: false });
      } catch (error) {
        expect((error as any).message).toEqual(DatasheetException.DATASHEET_NOT_EXIST.getMessage());
      }
    });

    it('should return empty record map with empty record IDs', async() => {
      const res = await service.fetchDataPack(knownMirrorId, auth, { internal: false, recordIds: [] });
      expect(res.snapshot.recordMap).toEqual({});
    });

    it('should return empty record map with unknown record IDs', async() => {
      const res = await service.fetchDataPack(knownMirrorId, auth, { internal: false, recordIds: ['rec111111'] });
      expect(res.snapshot.recordMap).toEqual({});
    });

    it('should return meta without record IDs', async() => {
      const res = await service.fetchDataPack(knownMirrorId, auth, { internal: false });
      expect(res.snapshot.meta).toEqual(meta);
    });

    it('should return meta with known record ID', async() => {
      const res = await service.fetchDataPack(knownMirrorId, auth, { internal: false, recordIds: [knownRecordId] });
      expect(res.snapshot.meta).toEqual(meta);
    });

  });
  
});
