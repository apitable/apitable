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

import { Injectable } from '@nestjs/common';
import { NodeDescRepository } from '../repositories/node.desc.repository';
import { NodeDescEntity } from '../entities/node.desc.entity';
import { IdWorker } from '../../shared/helpers';

@Injectable()
export class NodeDescriptionService {
  constructor(private readonly repository: NodeDescRepository) {}
  
  async getNodeDesc(nodeId: string): Promise<NodeDescEntity | undefined> {
    return await this.repository.findOne({
      where: {
        nodeId: nodeId
      }
    });
  }

  async recoverNodeDesc(descs: NodeDescEntity[]) {
    if (descs) {
      descs.forEach(desc => {
        desc.id = IdWorker.nextId() + '';
      }
      );
      await this.repository
        .createQueryBuilder()
        .insert()
        .values(descs)
        .execute();
    }
  }

  async getDescription(nodeId: string): Promise<string | null> {
    const rawData = await this.repository.selectDescriptionByNodeId(nodeId);
    if (rawData) return rawData.description;
    return null;
  }
}
