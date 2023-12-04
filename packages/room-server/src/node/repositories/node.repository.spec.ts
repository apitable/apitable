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
import { NodeRepository } from './node.repository';
import { NodeEntity } from '../entities/node.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from '../../shared/services/config/database.config.service';
import { clearDatabase } from 'shared/testing/test-util';

describe('Test NodeRepository', () => {
  let moduleFixture: TestingModule;
  let repository: NodeRepository;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([NodeRepository]),
      ],
    }).compile();
    // clear database
    await clearDatabase(getConnection());
    repository = moduleFixture.get<NodeRepository>(NodeRepository);
    const nodes: DeepPartial<NodeEntity>[] = [{
      type: 1,
      spaceId: 'spaceId',
      parentId: '0',
      nodeId: 'folderId',
      nodeName: 'folder',
    }, {
      type: 2,
      spaceId: 'spaceId',
      parentId: 'folderId',
      nodeId: 'datasheetId',
      nodeName: 'datasheet',
      extra: {},
    }, {
      type: 2,
      spaceId: 'spaceId',
      parentId: 'folderId',
      nodeId: 'templateId',
      nodeName: 'template',
      isTemplate: true,
    }];
    const record = repository.create(nodes);
    await repository.save(record);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be return node one count', async() => {
    const count = await repository.selectCountByNodeId('datasheetId');
    expect(count).toEqual(1);
  });

  it('should be return node zero count', async() => {
    const count = await repository.selectCountByNodeId('');
    expect(count).toEqual(0);
  });

  it('should be return template one count', async() => {
    const count = await repository.selectTemplateCountByNodeId('templateId');
    expect(count).toEqual(1);
  });

  it('should be return template zero count', async() => {
    const count = await repository.selectTemplateCountByNodeId('datasheetId');
    expect(count).toEqual(0);
  });

  it('should be return count under parent node', async() => {
    const count = await repository.selectCountByParentId('folderId');
    expect(count).toEqual(2);
  });

  it('should be return zero count under parent node', async() => {
    const count = await repository.selectCountByParentId('');
    expect(count).toEqual(0);
  });

  it('should be return node', async() => {
    const node = await repository.getNodeInfo('datasheetId');
    expect(node?.nodeId).toEqual('datasheetId');
  });

  it('should be return extra', async() => {
    const extra = await repository.selectExtraByNodeId('datasheetId');
    expect(extra?.extra).toBeDefined();
  });
});