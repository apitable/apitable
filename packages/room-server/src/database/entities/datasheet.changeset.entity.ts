import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { IOperation } from '@apitable/core';

/**
 * Workbench-Digital table operation change collection table
 */
@Entity('vika_datasheet_changeset')
export class DatasheetChangesetEntity extends BaseEntity {

  @Column({
    name: 'message_id',
    nullable: true,
    comment: 'Unique identifier of a changeset request',
    length: 255,
  })
    messageId: string | null;

  @Column( {
    name: 'dst_id',
    nullable: true,
    comment: 'datasheet ID',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'member_id',
    nullable: true,
    comment: 'Operating member ID (associated#vika_organization_member#ID)',
  })
    memberId: string | null;

  @Column('json', {
    name: 'operations',
    nullable: true,
    comment: 'Operation Action collection',
  })
    operations: IOperation[] | null;

  @Column( {
    name: 'revision',
    nullable: true,
    comment: 'revision',
    unsigned: true,
    default: () => '\'0\'',
  })
    revision: number | null;
}
