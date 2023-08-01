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
import { AutomationRobotRepository } from './automation.robot.repository';
import { AutomationRobotEntity } from '../entities/automation.robot.entity';
import { DeepPartial, getConnection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { clearDatabase } from 'shared/testing/test-util';

describe('AutomationRobotRepository', () => {
  let moduleFixture: TestingModule;
  let automationRobotRepository: AutomationRobotRepository;
  const theRobotResourceId = 'theRobotResourceId';
  const theRobotId = 'theRobotId';
  const theUserId = 'theUserId';
  let entity: AutomationRobotEntity;
  let addRobot: Function;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([AutomationRobotRepository]),
      ],
      providers: [AutomationRobotRepository],
    }).compile();

    automationRobotRepository = moduleFixture.get<AutomationRobotRepository>(AutomationRobotRepository);
    // clear database
    await clearDatabase(getConnection());
    addRobot = async(robotId: string): Promise<AutomationRobotEntity> => {
      const robot: DeepPartial<AutomationRobotEntity> = {
        resourceId: theRobotResourceId,
        robotId,
        name: 'robot',
        description: 'the test robot',
        isActive: true,
        createdBy: theUserId,
        updatedBy: theUserId,
      };
      const record = automationRobotRepository.create(robot);
      return await automationRobotRepository.save(record);
    };
    entity = await addRobot(theRobotId);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(automationRobotRepository).toBeDefined();
    expect(entity).toBeDefined();
  });

  it('given one active robot entity when get active robots by resource id', async() => {
    const resourceRobotDtos = await automationRobotRepository.getActiveRobotsByResourceIds([theRobotResourceId]);
    expect(resourceRobotDtos).toBeDefined();
    expect(resourceRobotDtos.length).toEqual(1);
    expect(resourceRobotDtos[0]!.resourceId).toEqual(theRobotResourceId);
    expect(resourceRobotDtos[0]!.robotId).toEqual(theRobotId);
  });

  it('given one active robot entity when get robot id by resource id', async() => {
    const robotIds = await automationRobotRepository.selectRobotIdByResourceId(theRobotResourceId);
    expect(robotIds).toBeDefined();
    expect(robotIds.length).toEqual(1);
    expect(robotIds[0]!.robotId).toEqual(theRobotId);
  });

  it('should be get the resource\'s robotIds info', async() => {
    const robots = {};
    for (let i = 0; i < 3; i++) {
      const robot = await addRobot(`test-${i}`);
      robots[robot.robotId] = robot;
    }
    const wrappedRobotIds = await automationRobotRepository.selectRobotIdsByResourceId(theRobotResourceId);
    expect(wrappedRobotIds).toBeDefined();
    expect(wrappedRobotIds.length).toEqual(4);
    const robotIds = wrappedRobotIds.map(wrappedRobotId => wrappedRobotId.robotId);
    for (let i = 0; i < 4; i++) {
      if (robotIds[i] === theRobotId) continue;
      expect(robots[robotIds[i]!]).toBeDefined();
      await automationRobotRepository.delete(robots[robotIds[i]!].id);
    }
  });

  it('should be get robots by robot ids', async() => {
    const testRobot = await addRobot('test');
    const robot = await automationRobotRepository.selectRobotBaseInfoDtoByRobotIds([theRobotId, testRobot.robotId]);
    expect(robot).toBeDefined();
    expect(robot.length).toEqual(2);
    await automationRobotRepository.delete(testRobot.id);
  });
});
