import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * Organization-Department
 */
@Entity(`unit_team`)
export class UnitTeamEntity extends BaseEntity {
  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#space#space_id)',
    length: 50,
    type: 'varchar',
  })
    spaceId: string;

  @Column({
    name: 'parent_id',
    nullable: false,
    comment: 'parent department ID, if it is the root department, it is 0',
    width: 20,
    type: 'bigint',
  })
    groupId: number | 0;

  @Column({
    name: 'team_name',
    nullable: false,
    comment: 'department name',
    length: 100,
    type: 'varchar',
  })
    teamName: string;

  @Column({
    name: 'team_level',
    nullable: false,
    comment: 'hierarchy, start from 1 by default',
    width: 5,
    type: 'int',
  })
    teamLevel: number | 1;

  @Column({
    name: 'sequence',
    nullable: false,
    comment: 'sort in space (default starting from 1)',
    width: 11,
    type: 'int',
  })
    sequence: number | 1;
}
