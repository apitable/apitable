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
import { NodeDescRepository } from './node.desc.repository';
import { NodeDescEntity } from '../entities/node.desc.entity';

describe('Test NodeDescRepository', () => {
  let module: TestingModule;
  let repository: NodeDescRepository;
  let entity: NodeDescEntity;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([NodeDescRepository]),
      ],
    }).compile();
    repository = module.get<NodeDescRepository>(NodeDescRepository);
  });

  beforeEach(async() => {
    const nodeDesc: DeepPartial<NodeDescEntity> = {
      id: '2023',
      nodeId: 'nodeId',
      description: 'description',
    };
    const record = repository.create(nodeDesc);
    entity = await repository.save(record);
  });

  afterEach(async() => {
    await repository.delete(entity.id);
  });

  afterAll(async() => {
    await repository.manager.connection.close();
  });

  it('should be return description', async() => {
    const description = await repository.selectDescriptionByNodeId('nodeId');
    expect(description?.description).toEqual(entity.description);
  });
});
