import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * 组织架构-部门表
 */
@Entity('vika_unit_team')
export class UnitTeamEntity extends BaseEntity {
  @Column({
    name: 'space_id',
    nullable: false,
    comment: '空间ID(关联#vika_space#space_id)',
    length: 50,
    type: 'varchar',
  })
    spaceId: string;

  @Column({
    name: 'parent_id',
    nullable: false,
    comment: '父级ID,如果是根部门,则为0',
    width: 20,
    type: 'bigint',
  })
    groupId: number | 0;

  @Column({
    name: 'team_name',
    nullable: false,
    comment: '部门名称',
    length: 100,
    type: 'varchar',
  })
    teamName: string;

  @Column({
    name: 'team_level',
    nullable: false,
    comment: '层级，默认1开始',
    width: 5,
    type: 'int',
  })
    teamLevel: number | 1;

  @Column({
    name: 'sequence',
    nullable: false,
    comment: '空间内排序(默认从1开始)',
    width: 11,
    type: 'int',
  })
    sequence: number | 1;
}
