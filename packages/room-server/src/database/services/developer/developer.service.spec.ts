//TODO: stop copy-paste this line, should remove

import { INestApplication } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DeveloperRepository } from '../../repositories/developer.repository';
import { DeveloperService } from './developer.service';
import { IdWorker } from '../../../shared/helpers';
import { UserRepository } from '../../repositories/user.repository';
import { AppModule } from 'app.module';

describe('developer service', () => {
  let app: INestApplication;
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
      expect(entities[0].apiKey).toEqual(apiKey);
      expect(entities[0].userId).toEqual(userId.toString());
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

      const result = await developerService.getUserInfoByApiKey(apiKey);
      expect(result.nikeName).toEqual(nikeName);
      await userRepo.delete(userEntity.id);
      await developerRepo.delete(developerEntity.id);
    });
  });

});
