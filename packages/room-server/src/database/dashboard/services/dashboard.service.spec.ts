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

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { NodeService } from 'node/services/node.service';
import { RestService } from 'shared/services/rest/rest.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let app: NestFastifyApplication;
  let module: TestingModule;
  let service: DashboardService;
  let nodeService: NodeService;
  let restService: RestService;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
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

  });

  describe('All services exist', () => {

    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(nodeService).toBeDefined();
      expect(restService).toBeDefined();
    });

  });
  
});
