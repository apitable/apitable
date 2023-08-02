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
import { DeepPartial, getConnection } from 'typeorm';
import { NodeRelRepository } from './node.rel.repository';
import { NodeRelEntity } from '../entities/node.rel.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { clearDatabase } from 'shared/testing/test-util';

describe('Test NodeRelRepository', () => {
  let moduleFixture: TestingModule;
  let repository: NodeRelRepository;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([NodeRelRepository]),
      ],
    }).compile();
    // clear database
    await clearDatabase(getConnection());
    repository = moduleFixture.get<NodeRelRepository>(NodeRelRepository);
    const nodeRel: DeepPartial<NodeRelEntity> = {
      id: '2023',
      mainNodeId: 'mainNodeId',
      relNodeId: 'nodeId',
    };
    const record = repository.create(nodeRel);
    await repository.save(record);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be return main node id', async() => {
    const mainNodeId = await repository.selectMainNodeIdByRelNodeId('nodeId');
    expect(mainNodeId?.mainNodeId).toEqual('mainNodeId');
  });

  it('should be return undefined main node id', async() => {
    const mainNodeId = await repository.selectMainNodeIdByRelNodeId('');
    expect(mainNodeId).toBeUndefined();
  });

  it('should be return rel node by main node id', async() => {
    const relNode = await repository.selectRelNodeIdByMainNodeId('mainNodeId');
    expect(relNode.length).toEqual(0);
  });

  it('should be return undefined rel node by rel node id', async() => {
    const relNode = await repository.selectNodeRelInfo('nodeId');
    expect(relNode).toBeUndefined();
  });
});