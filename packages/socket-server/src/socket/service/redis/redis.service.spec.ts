import { Test, TestingModule } from '@nestjs/testing';
import { getSocketServerAddr, ipAddress } from '../../common/helper';
import { SocketConstants } from '../../constants/socket-constants';
import { redisProviders } from './redis.provider';
import { RedisService } from './redis.service';

describe.skip('RedisService', () => {
  let service: RedisService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService, ...redisProviders],
    })
      .compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Redis Set Value', async() => {
    const result = await service.saveValue('jest:redis:set', '123456', 30);
    expect(result).toBe(void 0);
  });

  it('Redis Get Value', async() => {
    const data: string = await service.getValue('jest:redis:set');
    expect(data).toEqual('123456');
  });

  it('Redis Save Socket', async() => {
    const userId = '1';

    await removeSocket(userId);

    const result: number = await service.saveSocket('jest:redis:' + SocketConstants.NEST_SERVER_PREFIX, userId, getSocketServerAddr(ipAddress()));
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