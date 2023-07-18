import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('datasheet_tablebundle')
export class TableBundleEntity extends BaseEntity{

    @Column({
      name: 'space_id',
      nullable: false,
      unique: false,
      comment: 'space ID',
      length: 50,
    })
    spaceId!: string;

    @Column({
      name: 'dst_id',
      nullable: true,
      comment: 'datasheet ID(related#datasheet#dst_id)',
      length: 50,
    })
    dstId!: string;

    @Column({
      name: 'tbd_id',
      nullable: false,
      comment: 'unique identifier of a tablebundle file',
      length: 255,
    })
    tbdId!: string;

    @Column({
      name: 'tablebundle_url',
      nullable: false,
      comment: 'tablebundle file url',
      length: 128,
    })
    tablebundleUrl!: string;

    @Column({
      name: 'name',
      nullable: false,
      comment: 'tablebundle name',
      length: 128,
    })
    name!: string;

    @Column('integer', {
      name: 'type',
      nullable: false,
      comment: 'tablebundle type，0: template 1: snapshot'
    })
    type!: number;

    @Column('integer', {
      name: 'status_code',
      nullable: false,
      comment: 'tablebundle status，0: generation tablebundle initiation 1:generation tablebundle complete 2: tablebundle deleted'
    })
    statusCode!: number;

    @Column('bigint', {
      name: 'deleted_by',
      comment: 'ID of use who delete record',
    })
    deletedBy!: string;

    @Column('timestamp', {
      name: 'deleted_at',
      comment: 'delete time',
      nullable: true
    })
    deletedAt!: Date;

    @Column('bigint', {
      name: 'expired_at',
      comment: 'expired time',
      nullable: true
    })
    expiredAt!: string;
}