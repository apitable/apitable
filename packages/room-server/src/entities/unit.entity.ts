import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * 组织架构-组织单元表
 */
@Entity('vika_unit')
export class UnitEntity extends BaseEntity {
  @Column({
    name: 'space_id',
    nullable: false,
    comment: '空间ID(关联#vika_space#space_id)',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'unit_type',
    nullable: false,
    comment: '类型(1:部门,2:标签,3:成员)',
    width: 2,
    type: 'tinyint',
  })
    unitType: number;

  @Column({
    name: 'unit_ref_id',
    nullable: false,
    comment: '组织单元关联ID',
    width: 20,
    type: 'bigint',
  })
    unitRefId: number;
}
