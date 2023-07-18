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

import { Controller, Get, Param, Query } from '@nestjs/common';
import { AutomationRunHistoryRepository } from '../repositories/automation.run.history.repository';

@Controller(['nest/v1/robots/run-history', 'nest/v1/automation/run-history'])
export class RobotRunHistoryController {
  constructor(
    private readonly automationRunHistoryRepository: AutomationRunHistoryRepository,
  ) { }

  @Get('/')
  getRunHistory(@Query('robotId') robotId: string, @Query('page') page = 1, @Query('size') size = 20) {
    // max pagesize 20
    const pageSize = Math.min(size, 20);
    const offset = (page - 1) * pageSize;
    return this.automationRunHistoryRepository.getRunHistoryByRobotId(robotId, offset, pageSize);
  }

  @Get('/:taskId')
  getRunHistoryDetail(@Param('taskId') taskId: string) {
    return this.automationRunHistoryRepository.getRunHistoryByTaskId(taskId);
  }
}
