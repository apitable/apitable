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

import { SocketConstants } from 'shared/common/constants/socket.module.constants';
import { getSocketServerAddr } from 'shared/helpers/socket.helper';
import { getIPAddress } from 'shared/helpers/system.helper';
import { RedisService } from './redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { redisProviders } from './redis.provider';

describe.skip('RedisService', () => {
  let moduleFixture: TestingModule;
  let service: RedisService;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      providers: [RedisService, ...redisProviders],
    }).compile();
    service = moduleFixture.get<RedisService>(RedisService);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Redis Set Value', async() => {
    const result = await service.saveValue('jest:redis:set', '123456', 30);
    expect(result).toBe(void 0);
  });

  it('Redis Get Value', async() => {
    const data: string | null = await service.getValue('jest:redis:set');
    expect(data).toEqual('123456');
  });

  it('Redis Save Socket', async() => {
    const userId = '1';

    await removeSocket(userId);

    const result: number = await service.saveSocket('jest:redis:' + SocketConstants.NEST_SERVER_PREFIX, userId, getSocketServerAddr(getIPAddress()));
    expect(result).toEqual(1);
  });

  it('Redis Get Sockets', async() => {
    const result: Record<string, string> = await service.getSockets('jest:redis:' + SocketConstants.NEST_SERVER_PREFIX);

    expect(result).toMatchObject({
      1: expect.any(String),
    });
  });

  it('Redis Remove Socket', async() => {
    const userId = '1';
    await removeSocket(userId);
  });

  async function removeSocket(key: string) {
    const result: number = await service.removeSocket('jest:redis:' + SocketConstants.NEST_SERVER_PREFIX, key);
    expect(result).toStrictEqual(expect.any(Number));
  }
});