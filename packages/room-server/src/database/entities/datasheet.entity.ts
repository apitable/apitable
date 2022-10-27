import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * 工作台-数据表格表
 */
@Entity('vika_datasheet')
export class DatasheetEntity extends BaseEntity {
  @Column({
    name: 'dst_id',
    nullable: true,
    unique: true,
    comment: '数表ID',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'node_id',
    nullable: true,
    comment: '数表节点Id(关联#vika_node#node_id)',
    length: 50,
  })
    nodeId: string | null;

  @Column({
    name: 'dst_name',
    nullable: true,
    comment: '名称',
    length: 255,
  })
    dstName: string | null;

  @Column({
    name: 'space_id',
    nullable: true,
    comment: '空间ID(关联#vika_space#space_id)',
    length: 50,
  })
    spaceId: string | null;

  @Column({
    name: 'creator',
    nullable: true,
    comment: '创建者',
  })
    creator: string | null;

  @Column({
    name: 'revision',
    nullable: true,
    comment: '版本号',
    unsigned: true,
    default: () => 0,
    type: 'bigint',
    width: 20,
  })
    revision: number | null;
}
