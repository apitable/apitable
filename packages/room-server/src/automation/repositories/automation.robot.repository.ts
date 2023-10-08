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

import { generateRandomString } from '@apitable/core';
import { EntityRepository, In, Repository } from 'typeorm';
import { ResourceRobotDto, RobotBaseInfoDto } from '../dtos/robot.dto';
import { AutomationRobotEntity } from '../entities/automation.robot.entity';
import { RobotCreateRo } from '../ros/robot.create.ro';

@EntityRepository(AutomationRobotEntity)
export class AutomationRobotRepository extends Repository<AutomationRobotEntity> {
  async getActiveRobotsByResourceIds(resourceIds: string[]): Promise<ResourceRobotDto[]> {
    return await this.find({
      where: {
        resourceId: In(resourceIds),
        isDeleted: false,
        isActive: 1,
      },
      select: ['robotId', 'resourceId'],
    });
  }

  async isResourcesHasRobots(resourceIds: string[]) {
    const robotCount = await this.count({
      where: {
        resourceId: In(resourceIds),
        isDeleted: 0,
        isActive: 1,
      },
    });
    return robotCount > 0;
  }

  getResourceIdByRobotId(robotId: string) {
    return this.findOne({ robotId }, { select: ['resourceId'] }).then((res) => res?.resourceId);
  }

  async getRobotCountByResourceId(resourceId: string) {
    return await this.count({
      where: {
        resourceId,
        isDeleted: 0,
      },
    });
  }

  public async selectRobotIdsByResourceId(resourceId: string): Promise<Pick<AutomationRobotEntity, 'robotId'>[]> {
    return await this.find({
      select: ['robotId'],
      where: {
        resourceId,
        isDeleted: 0,
      },
    });
  }

  public async selectRobotBaseInfoDtoByRobotIds(robotIds: string[]): Promise<RobotBaseInfoDto[]> {
    return await this.find({
      select: ['name', 'description', 'isActive', 'robotId'],
      where: {
        robotId: In(robotIds),
        isDeleted: 0,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  public selectRobotSimpleInfoByRobotId(robotId: string): Promise<AutomationRobotEntity | undefined> {
    return this.findOne({ select: ['robotId', 'name', 'resourceId', 'createdBy', 'props'], where: { robotId, isDeleted: 0 } });
  }

  createRobot(robot: RobotCreateRo, userId: string) {
    const newRobot = this.create({
      resourceId: robot.resourceId,
      // Starting with 'arb', followed by 15 random letters and digits ([a-zA-Z0-9])
      robotId: `arb${generateRandomString(15)}`,
      name: robot.name,
      description: robot.description,
      createdBy: userId,
      updatedBy: userId,
    });
    return this.save(newRobot);
  }

  deleteRobot(robotId: string, userId: string) {
    return this.update(
      { robotId },
      {
        isDeleted: true,
        updatedBy: userId,
      },
    );
  }

  activeRobot(robotId: string, userId: string) {
    return this.update(
      { robotId },
      {
        updatedBy: userId,
        isActive: true,
      },
    );
  }

  deActiveRobot(robotId: string, userId: string) {
    return this.update(
      { robotId },
      {
        updatedBy: userId,
        isActive: false,
      },
    );
  }

  updateRobot(robotId: string, robot: { name?: string; description?: string }, userId: string) {
    return this.update({ robotId }, { ...robot, updatedBy: userId });
  }

  public selectRobotIdByResourceId(resourceId: string): Promise<Pick<AutomationRobotEntity, 'robotId'>[]> {
    return this.find({
      select: ['robotId'],
      where: {
        isActive: 1,
        isDeleted: 0,
        resourceId: resourceId,
      },
    });
  }

  selectActiveCountByRobotIds(robotIds: string[]): Promise<number> {
    return this.count({ where: [{ robotId: In(robotIds), isDeleted: 0, isActive: 1 }] });
  }

  async selectActiveRobotIdsByRobotIds(robotIds: string[]): Promise<string[]> {
    const result = await this.find({
      select: ['robotId'],
      where: {
        isActive: 1,
        isDeleted: 0,
        robotId: In(robotIds),
      },
    });
    return result.map((i) => i.robotId);
  }
}
