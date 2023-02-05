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
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationTriggerRepository } from './automation.trigger.repository';
import { AutomationTriggerEntity } from '../entities/automation.trigger.entity';
import { DeepPartial } from 'typeorm';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { ConfigModule } from '@nestjs/config';

describe('AutomationTriggerRepository', () => {
  let module: TestingModule;
  let repository: AutomationTriggerRepository;
  const theTriggerId = 'theTriggerId';
  const theTriggerTypeId = 'theTriggerTypeId';
  const theRobotId = 'theRobotId';
  let entity: AutomationTriggerEntity;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([AutomationTriggerRepository]),
      ],
      providers: [AutomationTriggerRepository],
    }).compile();

    repository = module.get<AutomationTriggerRepository>(AutomationTriggerRepository);

    const trigger: DeepPartial<AutomationTriggerEntity> = {
      triggerId: theTriggerId,
      triggerTypeId: theTriggerTypeId,
      robotId: theRobotId,
      input: {},
    };
    const record = repository.create(trigger);
    entity = await repository.save(record);
  });

  afterAll(async () => {
    await repository.delete(entity.id);
    await repository.manager.connection.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('given a trigger entity when get trigger by the robot id and the trigger type id', async () => {
    const resourceRobotTriggerDtos = await repository.getTriggerByRobotIdAndTriggerTypeId(theRobotId, theTriggerTypeId);
    expect(resourceRobotTriggerDtos).toBeDefined();
    expect(resourceRobotTriggerDtos.length).toEqual(1);
    expect(resourceRobotTriggerDtos[0]!.triggerId).toEqual(theTriggerId);
  });
});
