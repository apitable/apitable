import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Workbench-Datasheet Changeset Source
 */
@Entity(`datasheet_changeset_source`)
export class DatasheetChangesetSourceEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID (associated#datasheet#dst_id)',
    length: 50,
  })
    dstId: string;

  @Column({
    name: 'resource_id',
    nullable: false,
    comment: 'source ID(generally is nodeId)',
    length: 50,
  })
    resourceId: string;

  @Column({
    name: 'message_id',
    nullable: false,
    comment: 'Unique identifier of a changeset request',
    length: 255,
  })
    messageId: string;

  @Column({
    name: 'source_id',
    nullable: true,
    comment: 'source ID',
    length: 50,
  })
    sourceId: string | undefined;

  @Column({
    name: 'source_type',
    nullable: false,
    comment: 'source type (0: user_interface, 1: Openapi, 2: related_effect)',
    width: 2,
    type: 'tinyint',
  })
    sourceType: number;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: 'creator ID',
    default: null,
  })
    createdBy: string | undefined;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;
}
