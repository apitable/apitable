import { DatasheetWidgetEntity } from '../entities/datasheet.widget.entity';
import { EntityRepository, In, Repository } from 'typeorm';

@EntityRepository(DatasheetWidgetEntity)
export class DatasheetWidgetRepository extends Repository<DatasheetWidgetEntity> {
  async selectDstIdsByWidgetIds(widgetIds: string[]): Promise<string[] | null> {
    return await this.find({
      select: ['dstId'],
      where: [{ widgetId: In(widgetIds) }],
    }).then(entities => {
      return entities.map(entity => entity.dstId);
    });
  }

  async selectDstIdsByNodeId(nodeId: string): Promise<string[] | null> {
    const raws = await this.createQueryBuilder('vdw')
      .select('vdw.dst_id', 'dstId')
      .innerJoin(`${this.manager.connection.options.entityPrefix}widget`, 'vw', 'vdw.widget_id = vw.widget_id')
      .andWhere('vw.node_id = :nodeId', { nodeId })
      .andWhere('vw.is_deleted = 0')
      .getRawMany();
    return raws.reduce<string[]>((pre, cur) => {
      pre.push(cur.dstId);
      return pre;
    }, []);
  }
}
