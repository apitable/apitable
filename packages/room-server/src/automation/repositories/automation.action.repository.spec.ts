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
import { AutomationActionRepository } from './automation.action.repository';
import { AutomationActionEntity } from '../entities/automation.action.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { clearDatabase } from 'shared/testing/test-util';

describe('AutomationActionRepository', () => {
  let moduleFixture: TestingModule;
  let repository: AutomationActionRepository;
  const theActionId = 'actionId';
  const theRobotId = 'robotId';
  const theActionTypeId = 'actionTypeId';
  const theUserId = '123456';
  let entity: AutomationActionEntity;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([AutomationActionRepository]),
      ],
      providers: [AutomationActionRepository],
    }).compile();

    repository = moduleFixture.get<AutomationActionRepository>(AutomationActionRepository);
    // clear database
    await clearDatabase(getConnection());
    const action: DeepPartial<AutomationActionEntity> = {
      actionId: theActionId,
      robotId: theRobotId,
      actionTypeId: theActionTypeId,
      input: {},
      createdBy: theUserId,
    };
    const record = repository.create(action);
    entity = await repository.save(record);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be return robotId and preActionId', async() => {
    const robotRel = await repository.selectRobotRelByActionId(theActionId);
    expect(robotRel).toBeDefined();
    expect(robotRel.robotId).toEqual(theRobotId);
    expect(robotRel.prevActionId).toEqual(null);
  });

  it("should be update the action's pre action id", async() => {
    const newAction: DeepPartial<AutomationActionEntity> = {
      actionId: 'newActionId',
      robotId: theRobotId,
      actionTypeId: theActionTypeId,
      prevActionId: entity.actionId,
      createdBy: theUserId,
    };
    const record = repository.create(newAction);
    const theNewAction = await repository.save(record);
    const theUpdatedResult = await repository.updateRobotPrevActionIdByOldPrevActionId(theUserId, theRobotId, entity.prevActionId, entity.actionId);
    expect(theUpdatedResult).toBeDefined();
    expect(theUpdatedResult.affected).toEqual(1);
    await repository.delete(theNewAction.id);
  });

  it('should be update delete flag', async() => {
    const theUpdateResult = await repository.deleteActionByActionId(theUserId, theActionId);
    expect(theUpdateResult).toBeDefined();
    expect(theUpdateResult.affected).toEqual(1);
    const theDeletedEntity = await repository.findOneOrFail({
      where: {
        actionId: theActionId,
      },
    });
    expect(theDeletedEntity).toBeDefined();
    expect(theDeletedEntity.isDeleted).toBeTruthy();
  });

  it('should get the action base infos by robot ids', async() => {
    const actionBaseInfoDtos = await repository.selectActionBaseInfosByRobotIds([theRobotId]);
    expect(actionBaseInfoDtos).toBeDefined();
    expect(actionBaseInfoDtos.length).toEqual(1);
    expect(actionBaseInfoDtos[0]!.actionId).toEqual(theActionId);
    expect(actionBaseInfoDtos[0]!.actionTypeId).toEqual(theActionTypeId);
    expect(actionBaseInfoDtos[0]!.robotId).toEqual(theRobotId);
    expect(actionBaseInfoDtos[0]!.prevActionId).toEqual(null);
  });

  it('should be get the action infos by robot id', async() => {
    const robotActionInfoDtos = await repository.selectActionInfosByRobotId(theRobotId);
    expect(robotActionInfoDtos).toBeDefined();
    expect(robotActionInfoDtos.length).toEqual(1);
    expect(robotActionInfoDtos[0]!.actionId).toEqual(theActionId);
    expect(robotActionInfoDtos[0]!.actionTypeId).toEqual(theActionTypeId);
    expect(robotActionInfoDtos[0]!.prevActionId).toEqual(null);
    expect(robotActionInfoDtos[0]!.input).toEqual({});
  });
});
