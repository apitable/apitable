import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * Workbench-Datasheet Operation
 */
@Entity('vika_datasheet_operation')
export class DatasheetOperationEntity extends BaseEntity {

  @Column({
    name: 'op_id',
    nullable: true,
    unique: true,
    comment: 'operation ID',
    length: 50,
  })
    opId: string | null;

  @Column({
    name: 'dst_id',
    nullable: true,
    comment: 'datasheet ID(related#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'action_name',
    nullable: true,
    comment: 'action name',
    length: 255,
  })
    actionName: string | null;

  @Column('json', { name: 'actions', nullable: true, comment: 'action collection' })
    actions: object | null;

  @Column({
    name: 'type',
    nullable: true,
    comment: 'action type(1:JOT,2:COT)',
    unsigned: true,
  })
    type: number | null;

  @Column( {
    name: 'member_id',
    nullable: true,
    comment: 'operating member ID(related#vika_organization_member#id)',
  })
    memberId: string | null;

  @Column( {
    name: 'revision',
    comment: 'revision',
    unsigned: true,
    default: () => '\'0\'',
  })
    revision: number;
}
