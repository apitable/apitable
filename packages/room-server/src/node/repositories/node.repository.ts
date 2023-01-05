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

import { NodeEntity } from 'node/entities/node.entity';
import { NodeBaseInfo } from 'database/interfaces';
import { INodeExtra } from 'shared/interfaces';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(NodeEntity)
export class NodeRepository extends Repository<NodeEntity> {
  /**
   * Obtain the number of nodes with the given node ID
   */
  selectCountByNodeId(nodeId: string): Promise<number> {
    return this.count({ where: { nodeId, isRubbish: false }});
  }

  /**
   * Obtain the number of templates with the given node ID
   */
  selectTemplateCountByNodeId(nodeId: string): Promise<number> {
    return this.count({ where: { nodeId, isTemplate: true, isRubbish: false }});
  }

  /**
   * Obtain the number of nodes with the given parent node ID
   */
  selectCountByParentId(parentId: string): Promise<number> {
    return this.count({ where: { parentId, isRubbish: false }});
  }

  /**
   * Obtain the ID of the space which the given node belongs to
   */
  selectSpaceIdByNodeId(nodeId: string): Promise<{ spaceId: string } | undefined> {
    return this.createQueryBuilder('vn')
      .select('vn.space_id', 'spaceId')
      .where('vn.node_id = :nodeId', { nodeId })
      .andWhere('vn.is_rubbish = 0')
      .getRawOne<{ spaceId: string }>();
  }

  /**
   * Obtain the children node list of a given node
   */
  async selectAllSubNodeIds(nodeId: string): Promise<string[]> {
    const raws = await this.query(
      `
          WITH RECURSIVE sub_ids (node_id) AS
          (
            SELECT node_id
            FROM ${this.manager.connection.options.entityPrefix}node
            WHERE parent_id = ? and is_rubbish = 0
            UNION ALL
            SELECT c.node_id
            FROM sub_ids AS cp
            JOIN ${this.manager.connection.options.entityPrefix}node AS c ON cp.node_id = c.parent_id and c.is_rubbish = 0
          )
          SELECT distinct node_id nodeId
          FROM sub_ids;
        `,
      [nodeId],
    );
    return raws.reduce((pre: string[], cur: { nodeId: string }) => {
      pre.push(cur.nodeId);
      return pre;
    }, []);
  }

  /**
   * Obtain the path to the root node of a given node.
   *
   * The returned node ID array includes the given node and does not include the root node.
   *
   * Example: for a path of 3 nodes, the returned array is `[nodeId, parentId, grandparentId, great-grandparentId]`
   */
  async selectParentPathByNodeId(nodeId: string): Promise<string[]> {
    // Query the path with recursive SQL, the result set includes the given node.
    const raws = await this.query(
      `
          WITH RECURSIVE parent_view (node_id, node_name, parent_id, lvl) AS
          (
            SELECT n.node_id, n.node_name, n.parent_id, 0 lvl
            FROM ${this.manager.connection.options.entityPrefix}node n
            WHERE n.node_id = ? AND n.is_rubbish = 0
            UNION ALL
            SELECT c.node_id, c.node_name, c.parent_id, pv.lvl + 1
            FROM parent_view AS pv
            JOIN ${this.manager.connection.options.entityPrefix}node AS c ON pv.parent_id = c.node_id AND c.is_rubbish = 0
          )
          SELECT node_id nodeId
          FROM parent_view
          WHERE parent_id != '0'
          ORDER BY lvl ASC
        `,
      [nodeId],
    );
    return raws.reduce((pre: string[], cur: { nodeId: string }) => {
      pre.push(cur.nodeId);
      return pre;
    }, []);
  }

  getNodeInfo(nodeId: string): Promise<NodeEntity | undefined> {
    return this.findOne({
      select: ['nodeId', 'nodeName', 'spaceId', 'parentId', 'icon', 'extra', 'type'],
      where: [{ nodeId, isRubbish: false }],
    });
  }

  selectExtraByNodeId(nodeId: string): Promise<{ extra: INodeExtra } | undefined> {
    return this.createQueryBuilder('vn')
      .select('CONVERT(vn.extra, JSON) as extra')
      .where('vn.node_id = :nodeId', { nodeId })
      .andWhere('vn.is_rubbish = 0')
      .getRawOne();
  }

  selectNodeNameAndIconByNodeId(nodeId: string): Promise<NodeBaseInfo | undefined> {
    return this.findOne({
      select: ['nodeName', 'icon'],
      where: [{ nodeId, isRubbish: false }],
    }).then(result => {
      if (result) {
        return {
          id: nodeId,
          nodeName: result.nodeName,
          icon: result.icon || '',
        };
      }
      return undefined;
    });
  }
}
