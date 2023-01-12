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
import { UserRepository } from 'user/repositories/user.repository';
import { UserService } from './user.service';

describe('user service', () => {
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

  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userService = module.get(UserService);
    userRepository = module.get(UserRepository);

    // TODO: mock a database service instead of connecting to a live database. added by troy
  });

  describe('test getUserInfo', () => {
    const apiKey = 'key1';

    it('should return empty array with an unknown spaceId', async() => {
      const result = await developerService.getUserInfoByApiKey(apiKey);
      expect(result).toBeNull();
    });

    it('should return empty array with unknown uuids', async() => {
      const result = await developerService.getUserInfoByApiKey(apiKey);
      expect(result).toBeNull();
    });

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
