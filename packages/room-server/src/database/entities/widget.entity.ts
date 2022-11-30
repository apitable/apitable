import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity(`widget`)
export class WidgetEntity extends BaseEntity {
  @Column({
    name: 'node_id',
    nullable: false,
    unique: true,
    comment: 'node ID',
    length: 50,
  })
    nodeId: string;

  @Column({
    name: 'space_id',
    nullable: false,
    unique: true,
    comment: 'space ID',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'package_id',
    nullable: false,
    unique: true,
    comment: 'package ID',
    length: 50,
  })
    packageId: string;

  @Column({
    name: 'widget_id',
    nullable: false,
    unique: true,
    comment: 'widget ID',
    length: 50,
  })
    widgetId: string;

  @Column({
    name: 'name',
    nullable: true,
    comment: 'name',
    length: 255,
  })
    name: string | null;

  @Column('json', {
    name: 'storage',
    nullable: true,
    comment: 'storage configuration',
  })
    storage: { [key: string]: any } | null;

  @Column({
    name: 'revision',
    nullable: false,
    unsigned: true,
    comment: 'revision',
    default: () => 0,
    type: 'bigint',
    width: 20,
  })
    revision: number;
}