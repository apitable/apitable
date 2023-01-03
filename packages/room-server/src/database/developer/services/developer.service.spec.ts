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
import { IdWorker } from 'shared/helpers';
import { DeveloperRepository } from '../repositories/developer.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { DeveloperService } from './developer.service';

describe('developer service', () => {
  let app: NestFastifyApplication;
  let module: TestingModule;

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

  let developerService: DeveloperService;
  let developerRepo: DeveloperRepository;

  beforeEach(() => {
    developerService = module.get(DeveloperService);
    developerRepo = module.get(DeveloperRepository);

    // TODO: mock a database service instead of connecting to a live database. added by troy
  });

  describe('developerRepo', () => {
    it('save then find', async() => {
      const apiKey = 'key';

      const userId = IdWorker.nextId();
      const entity = developerRepo.create({
        userId,
        apiKey,
      });
      await developerRepo.insert(entity);

      const entities = await developerRepo.find();
      expect(entities.length).toEqual(1);
      expect(entities[0]!.apiKey).toEqual(apiKey);
      expect(entities[0]!.userId).toEqual(userId.toString());
      await developerRepo.delete(entity.id);
    });
  });

  describe('getUserInfoByApiKey', () => {
    const apiKey = 'key1';

    it('returns null when no entities', async() => {
      const result = await developerService.getUserInfoByApiKey(apiKey);
      expect(result).toBeNull();
    });

    it('returns user entity with given api key', async() => {
      const userRepo = module.get(UserRepository);
      const nikeName = 'xiaoming';
      const userEntity = userRepo.create({ nikeName });
      await userRepo.insert(userEntity);

      const developerEntity = developerRepo.create({ userId: BigInt(userEntity.id), apiKey });
      await developerRepo.insert(developerEntity);

      const result = (await developerService.getUserInfoByApiKey(apiKey))!;
      expect(result.nikeName).toEqual(nikeName);
      await userRepo.delete(userEntity.id);
      await developerRepo.delete(developerEntity.id);
    });
  });

});
