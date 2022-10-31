import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * Organizational structure-label table
 */
@Entity('vika_unit_tag')
export class UnitTagEntity extends BaseEntity {
  @Column({
    name: 'group_id',
    nullable: true,
    comment: 'organization unit ID',
    width: 20,
    type: 'bigint',
  })
    groupId: number | null;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#vika_space#space_id)',
    length: 50,
    type: 'varchar',
  })
    spaceId: string;

  @Column({
    name: 'tag_name',
    nullable: false,
    comment: 'tag name',
    length: 100,
    type: 'varchar',
  })
    tagName: string;

  @Column({
    name: 'sequence',
    nullable: false,
    comment: 'sort in space (default starting from 1)',
    width: 11,
    type: 'int',
  })
    sequence: number | 1;
}
