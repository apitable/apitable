import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * Workbench-Datasheet
 */
@Entity('vika_datasheet')
export class DatasheetEntity extends BaseEntity {
  @Column({
    name: 'dst_id',
    nullable: true,
    unique: true,
    comment: 'datasheet ID',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'node_id',
    nullable: true,
    comment: 'node ID (association#vika_node#node_id)',
    length: 50,
  })
    nodeId: string | null;

  @Column({
    name: 'dst_name',
    nullable: true,
    comment: 'datasheet name',
    length: 255,
  })
    dstName: string | null;

  @Column({
    name: 'space_id',
    nullable: true,
    comment: 'space ID(related#vika_space#space_id)',
    length: 50,
  })
    spaceId: string | null;

  @Column({
    name: 'creator',
    nullable: true,
    comment: 'creator ID',
  })
    creator: string | null;

  @Column({
    name: 'revision',
    nullable: true,
    comment: 'revision',
    unsigned: true,
    default: () => 0,
    type: 'bigint',
    width: 20,
  })
    revision: number | null;
}
