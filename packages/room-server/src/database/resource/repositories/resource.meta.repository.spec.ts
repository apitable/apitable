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
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial } from 'typeorm';
import { ResourceMetaRepository } from './resource.meta.repository';
import { ResourceMetaEntity } from '../entities/resource.meta.entity';

describe('DatasheetRepositoryTest', () => {
  let module: TestingModule;
  let repository: ResourceMetaRepository;
  let entity: ResourceMetaEntity;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([ResourceMetaRepository]),
      ],
    }).compile();
    repository = module.get<ResourceMetaRepository>(ResourceMetaRepository);
  });

  beforeEach(async() => {
    const resourceMeta: DeepPartial<ResourceMetaEntity> = {
      resourceId: 'resourceId',
      revision: 1,
    };
    const record = repository.create(resourceMeta);
    entity = await repository.save(record);
  });

  afterEach(async() => {
    await repository.delete(entity.id);
  });

  afterAll(async() => {
    await repository.manager.connection.close();
  });

  it('should get revisions by resource ids', async() => {
    const resourceRevisions = await repository.getRevisionByRscIds([entity.resourceId]);
    expect(resourceRevisions.length).toEqual(1);
    expect(resourceRevisions[0]?.resourceId).toEqual(entity.resourceId);
    expect(resourceRevisions[0]?.revision).toEqual(entity.revision);
  });
});