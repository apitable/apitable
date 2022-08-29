import { IResourceRevision } from '@vikadata/core';
import { WidgetEntity } from 'entities/widget.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(WidgetEntity)
export class WidgetRepository extends Repository<WidgetEntity> {
  /**
   * 查询节点ID
   */
  selectNodeIdByWidgetId(widgetId: string): Promise<{ nodeId: string } | undefined> {
    return this.findOne({
      select: ['nodeId'],
      where: [{ widgetId, isDeleted: false }],
    });
  }

  selectStorageByWidgetId(widgetId: string): Promise<WidgetEntity | undefined> {
    return this.findOne({
      select: ['storage'],
      where: [{ widgetId, isDeleted: false }],
    });
  }

  selectWidgetIdsByNodeIdAndIsDeleted(nodeId: string, isDeleted?: boolean): Promise<WidgetEntity[]> {
    return this.find({
      select: ['widgetId'],
      where: [{ nodeId, isDeleted }],
    });
  }

  /**
   * 查询多个组件对应的版本号
   */
  getRevisionByWdtIds(widgetIds: string[]): Promise<IResourceRevision[]> {
    return this.query(
      `
          SELECT widget_id resourceId, revision
          FROM vika_widget
          WHERE widget_id IN (?) AND is_deleted = 0
        `,
      [widgetIds],
    );
  }

  /**
   * 查询节点ID和版本号
   */
  getNodeIdAndRevision(widgetId: string): Promise<{ nodeId: string; revision: number } | undefined> {
    return this.findOne({
      select: ['nodeId', 'revision'],
      where: [{ widgetId }],
    });
  }
}
