import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('vika_widget')
export class WidgetEntity extends BaseEntity {
  @Column({
    name: 'node_id',
    nullable: false,
    unique: true,
    comment: '节点ID',
    length: 50,
  })
    nodeId: string;

  @Column({
    name: 'space_id',
    nullable: false,
    unique: true,
    comment: '空间ID',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'package_id',
    nullable: false,
    unique: true,
    comment: '组件包ID',
    length: 50,
  })
    packageId: string;

  @Column({
    name: 'widget_id',
    nullable: false,
    unique: true,
    comment: '自定组件ID',
    length: 50,
  })
    widgetId: string;

  @Column({
    name: 'name',
    nullable: true,
    comment: '名称',
    length: 255,
  })
    name: string | null;

  @Column('json', {
    name: 'storage',
    nullable: true,
    comment: '存储配置',
  })
    storage: { [key: string]: any } | null;

  @Column({
    name: 'revision',
    nullable: false,
    unsigned: true,
    comment: '版本号',
    default: () => 0,
    type: 'bigint',
    width: 20,
  })
    revision: number;
}