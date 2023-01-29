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

import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperRepository } from '../repositories/developer.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { DeveloperService } from './developer.service';
import { UserEntity } from 'user/entities/user.entity';
import { AppModule } from 'app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('developer service', () => {
  let app: NestFastifyApplication;
  let module: TestingModule;
  let developerService: DeveloperService;
  let developerRepo: DeveloperRepository;
  let userRepository: UserRepository;
  const knownAPIKey = 'key1';
  const knownExpiredAPIKey= 'key2';
  const knownUserId = 12345;

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
    developerService = module.get<DeveloperService>(DeveloperService);
    developerRepo = module.get<DeveloperRepository>(DeveloperRepository); 
    userRepository = module.get<UserRepository>(UserRepository);
    jest.spyOn(developerRepo, 'selectUserIdByApiKey').mockImplementation(async(apiKey) => {
      if (apiKey === knownAPIKey) {
        return await Promise.resolve({ userId: BigInt(knownUserId) });
      } else if (apiKey === knownExpiredAPIKey) {
        return await Promise.resolve({ userId: BigInt(Math.floor(Math.random()*10000)) });
      }
      return await Promise.resolve(undefined);
    });
    jest.spyOn(userRepository, 'selectUserBaseInfoById').mockImplementation(async(userId) => {
      if (userId === knownUserId.toString()) {
        const nikeName = 'xiaoming';
        const userEntity = new UserEntity();
        userEntity.nikeName = nikeName;
        return Promise.resolve(userEntity);
      }
      return await Promise.resolve(undefined);
    });
  });

  describe('test getUserInfoByApiKey', () => {

    it('should return null with an unknown API key', async() => {
      const result = await developerService.getUserInfoByApiKey(Math.floor(Math.random()*10000).toString());
      expect(result).toBeNull();
    });

    it('should return user entity with a known API key', async() => {
      const nikeName = 'xiaoming';
      const result = (await developerService.getUserInfoByApiKey(knownAPIKey))!;
      expect(result.nikeName).toEqual(nikeName);
    });

    it('should return undefined with an expired API key', async() => {
      const result = (await developerService.getUserInfoByApiKey(knownExpiredAPIKey))!;
      expect(result).toBeUndefined();
    });

  });

});
