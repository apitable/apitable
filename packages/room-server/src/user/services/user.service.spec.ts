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

import { ConfigModule } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { resolve } from 'path';
import { EnvConfigKey } from 'shared/common';
import { CommonException, ServerException } from 'shared/exception';
import { IAuthHeader, IOssConfig, IUserBaseInfo } from 'shared/interfaces';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { RestService } from 'shared/services/rest/rest.service';
import { UnitMemberRepository } from 'unit/repositories/unit.member.repository';
import { UserEntity } from 'user/entities/user.entity';
import { UserRepository } from 'user/repositories/user.repository';
import { UserService } from './user.service';

describe('user service', () => {
  let app: NestFastifyApplication;
  let userService: UserService;
  let restService: RestService;
  let envConfigService: EnvConfigService;
  let userRepo: UserRepository;
  const knownSpaceId = 'spczdmBAQWF';
  const knownUuid = '734efa2b1a1349a29ce2b45f0955f43c';
  const knownUserId = Number(1583386940386963457n);
  const loggedSession = 'NWUzMDIxMmEtYjAyYi00ZDcxLWEzMTMtN2I4NzNmY2QzYTRj';
  const loggedInCookie = `SESSION=${loggedSession}; lang=zh-CN;`;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [resolve(__dirname, '../../../env/.env.defaults')],
          encoding: 'utf-8',
          isGlobal: true,
          expandVariables: true,
        }),
      ],
      providers: [
        UserService,
        EnvConfigService,
        { provide: RestService, useValue: { hasLogin: jest.fn(), fetchMe: jest.fn() } },
        UserRepository,
        UnitMemberRepository,
      ],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();

    userService = app.get<UserService>(UserService);
    restService = app.get<RestService>(RestService);
    envConfigService = app.get<EnvConfigService>(EnvConfigService);
    userRepo = app.get<UserRepository>(UserRepository);
  });

  beforeEach(() => {
    jest.spyOn(userRepo, 'selectUserInfoBySpaceIdAndUuids').mockImplementation((spaceId: string, uuids: string[]) => {
      if (spaceId === knownSpaceId) {
        if (uuids.includes(knownUuid)) {
          return Promise.resolve([
            {
              userId: knownUuid,
              uuid: knownUuid,
              avatarColor: null,
              nickName: 'test000',
              unitId: 1567455154058297346n,
              isDeleted: false,
              type: 1,
              name: 'test000',
              avatar: 'space/2020/09/11/e4d073b1fa674bc884a8c194e9248ecf',
              isMemberNameModified: true,
              isNickNameModified: true,
            },
          ]);
        }
      }
      return Promise.resolve([]);
    });

    jest.spyOn(userRepo, 'selectUserBaseInfoByIds').mockImplementation((userIds: number[]) => {
      if (userIds.includes(knownUserId)) {
        const userEntity = new UserEntity();
        userEntity.avatar = 'space/2020/09/11/e4d073b1fa674bc884a8c194e9248ecf';
        userEntity.id = knownUserId.toString();
        userEntity.nikeName = 'test000';
        userEntity.uuid = knownUuid;
        userEntity.isSocialNameModified = 1;
        return Promise.resolve([userEntity]);
      }
      return Promise.resolve([]);
    });

    jest.spyOn(restService, 'hasLogin').mockImplementation((cookie: string) => {
      if (cookie && cookie.includes(loggedSession)) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });

    jest.spyOn(restService, 'fetchMe').mockImplementation((headers: IAuthHeader) => {
      if (headers && headers.cookie?.includes(loggedSession)) {
        const userBaseInfo: IUserBaseInfo = { userId: knownUserId.toString(), uuid: knownUuid };
        return Promise.resolve(userBaseInfo);
      }
      throw new ServerException(CommonException.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('test getUserInfo', () => {
    it('should return empty array with an unknown spaceId', async () => {
      const result = await userService.getUserInfo('spc123456', [knownUuid]);
      expect(result).toHaveLength(0);
    });

    it('should return empty array with an unknown uuid', async () => {
      const result = await userService.getUserInfo(knownSpaceId, ['123456']);
      expect(result).toHaveLength(0);
    });

    it('should return empty array with empty array of uuids', async () => {
      const result1 = await userService.getUserInfo(knownSpaceId, []);
      expect(result1).toHaveLength(0);
    });

    it('should return userDto with transformed avatar', async () => {
      const result = await userService.getUserInfo(knownSpaceId, [knownUuid]);
      expect(result).toBeDefined();
      const userDto = result.filter((user) => user.uuid === knownUuid)[0];
      const oss = envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
      expect(userDto).toBeDefined();
      expect(userDto?.avatar).toContain(oss.host);
    });
  });

  describe('test getUserBaseInfoMapByUserIds', () => {
    it('should return empty map with an unknown userId', async () => {
      const result = await userService.getUserBaseInfoMapByUserIds([123456]);
      expect(result).toEqual(new Map());
    });

    it('should return INamedUser DTO instance with an known userId', async () => {
      const result = await userService.getUserBaseInfoMapByUserIds([knownUserId]);
      expect(result.keys()).toContain(knownUserId.toString());
      expect(result.get(knownUserId.toString())).toHaveProperty(['isSocialNameModified']);
    });
  });

  describe('test getMeNullable', () => {
    it('should return {} with invalid cookies', async () => {
      const result = await userService.getMeNullable('');
      expect(result).toEqual({});
    });

    it('should return IUserBaseInfo DTO instance with a logged-in cookie', async () => {
      const result = await userService.getMeNullable(loggedInCookie);
      expect(result.userId).toEqual(knownUserId.toString());
    });
  });

  describe('test getMe', () => {
    it('should throw exception with invalid cookie', async () => {
      // const res = async() => {
      //   await userService.getMe({ cookie: '' });
      // };
      // expect(res).toThrow(ServerException);
      try {
        await userService.getMe({ cookie: '' });
      } catch (error) {
        expect((error as any).message).toEqual(CommonException.UNAUTHORIZED.getMessage());
      }
    });

    it('should return IUserBaseInfo DTO instance with a logged-in cookie', async () => {
      const result = await userService.getMe({ cookie: loggedInCookie });
      expect(result.userId).toEqual(knownUserId.toString());
    });
  });

  describe('test session', () => {
    it('should return false with invalid cookie', async () => {
      const result = await userService.session('');
      expect(result).toBeFalsy();
    });

    it('should return true with a logged-in cookie', async () => {
      const result = await userService.session(loggedInCookie);
      expect(result).toBeTruthy();
    });
  });

  /**
   * API tests already implemented
   */
  describe('test getUserInfoBySpaceId', () => {
    it('should be defined', () => {
      expect(userService.getUserInfoBySpaceId).toBeDefined();
    });
  });
});
