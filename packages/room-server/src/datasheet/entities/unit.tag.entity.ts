import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * 组织架构-标签表
 */
@Entity('vika_unit_tag')
export class UnitTagEntity extends BaseEntity {
  @Column({
    name: 'group_id',
    nullable: true,
    comment: '组织单元关联ID',
    width: 20,
    type: 'bigint',
  })
    groupId: number | null;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: '空间ID(关联#vika_space#space_id)',
    length: 50,
    type: 'varchar',
  })
    spaceId: string;

  @Column({
    name: 'tag_name',
    nullable: false,
    comment: '标签名称',
    length: 100,
    type: 'varchar',
  })
    tagName: string;

  @Column({
    name: 'sequence',
    nullable: false,
    comment: '空间内排序(默认从1开始)',
    width: 11,
    type: 'int',
  })
    sequence: number | 1;
}
