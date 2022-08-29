import { NodeEntity } from 'entities/node.entity';
import { INodeExtra } from 'interfaces';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(NodeEntity)
export class NodeRepository extends Repository<NodeEntity> {

  /**
   * 查询指定节点ID 的数量
   */
  selectCountByNodeId(nodeId: string): Promise<number> {
    return this.count({ where: { nodeId, isRubbish: false }});
  }

  /**
   * 查询指定节点ID 的模板数量
   */
  selectTemplateCountByNodeId(nodeId: string): Promise<number> {
    return this.count({ where: { nodeId, isTemplate: true, isRubbish: false }});
  }

  /**
   * 查询指定父节点ID 的数量
   */
  selectCountByParentId(parentId: string): Promise<number> {
    return this.count({ where: { parentId, isRubbish: false }});
  }

  /**
   * 获取节点所在的空间ID
   */
  selectSpaceIdByNodeId(nodeId: string): Promise<{ spaceId: string } | undefined> {
    return this.createQueryBuilder('vn')
      .select('vn.space_id', 'spaceId')
      .where('vn.node_id = :nodeId', { nodeId })
      .andWhere('vn.is_rubbish = 0')
      .getRawOne<{ spaceId: string }>();
  }

  /**
   * 获取节点的所有子节点列表
   */
  async selectAllSubNodeIds(nodeId: string): Promise<string[]> {
    const raws = await this.query(
      `
          WITH RECURSIVE sub_ids (node_id) AS
          (
            SELECT node_id
            FROM vika_node
            WHERE parent_id = ? and is_rubbish = 0
            UNION ALL
            SELECT c.node_id
            FROM sub_ids AS cp
            JOIN vika_node AS c ON cp.node_id = c.parent_id and c.is_rubbish = 0
          )
          SELECT distinct node_id nodeId
          FROM sub_ids;
        `,
      [nodeId],
    );
    return raws.reduce((pre: string[], cur: { nodeId: string; }) => {
      pre.push(cur.nodeId);
      return pre;
    }, []);
  }

  /**
   * 查询节点父级路径
   * 数组结果集包含自己，排除根节点, 就近原则
   * example: 假如当前节点的父级有三层，倒序结果：[nodeId, 第三父级, 第二父级, 第一父级]
   */
  async selectParentPathByNodeId(nodeId: string): Promise<string[]> {
    // 纯SQL递归查询节点父级路径，结果集包含自己
    const raws = await this.query(
      `
          WITH RECURSIVE parent_view (node_id, node_name, parent_id, lvl) AS
          (
            SELECT n.node_id, n.node_name, n.parent_id, 0 lvl
            FROM vika_node n
            WHERE n.node_id = ? AND n.is_rubbish = 0
            UNION ALL
            SELECT c.node_id, c.node_name, c.parent_id, pv.lvl + 1
            FROM parent_view AS pv
            JOIN vika_node AS c ON pv.parent_id = c.node_id AND c.is_rubbish = 0
          )
          SELECT node_id nodeId
          FROM parent_view
          WHERE parent_id != '0'
          ORDER BY lvl ASC
        `,
      [nodeId],
    );
    return raws.reduce((pre: string[], cur: { nodeId: string; }) => {
      pre.push(cur.nodeId);
      return pre;
    }, []);
  }

  /**
   * 获取节点信息
   */
  getNodeInfo(nodeId: string): Promise<NodeEntity | undefined> {
    return this.findOne({
      select: ['nodeId', 'nodeName', 'spaceId', 'parentId', 'icon', 'extra', 'type'],
      where: [{ nodeId, isRubbish: false }],
    });
  }

  selectExtraByNodeId(nodeId: string): Promise<{ extra: INodeExtra }> {
    return this.createQueryBuilder('vn')
      .select('CONVERT(vn.extra, JSON) as extra')
      .where('vn.node_id = :nodeId', { nodeId })
      .andWhere('vn.is_rubbish = 0')
      .getRawOne();
  }
}
