import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * Organizational structure-Organization unit table
 */
@Entity(`unit`)
export class UnitEntity extends BaseEntity {
  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#vika_space#space_id)',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'unit_type',
    nullable: false,
    comment: 'unit type(1: department, 2: tag, 3:member)',
    width: 2,
    type: 'tinyint',
  })
    unitType: number;

  @Column({
    name: 'unit_ref_id',
    nullable: false,
    comment: 'organization unit association ID',
    width: 20,
    type: 'bigint',
  })
    unitRefId: number;
}
