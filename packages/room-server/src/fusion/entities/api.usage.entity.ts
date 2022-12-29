import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { IdWorker } from 'shared/helpers';
import { IApiRequestDetail, IApiResponseDetail } from 'shared/interfaces';
import { BaseEntity } from 'shared/entities/base.entity';

/**
 * Workbench - api request information record form
 */
@Entity(`api_usage`)
export class ApiUsageEntity {
  @PrimaryColumn('bigint')
  id: string;

  @Column({
    name: 'user_id',
    nullable: false,
    unique: true,
    comment: 'user ID(related#user#id)',
    width: 20,
    type: 'bigint',
  })
  userId: bigint;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#space#space_id)',
    length: 50,
  })
  spaceId: string | null;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
  dstId: string | null;

  @Column({
    name: 'req_path',
    nullable: false,
    comment: 'The data behind the path,domain of the api',
    length: 100,
  })
  reqPath: string | null;

  @Column({
    name: 'req_method',
    nullable: false,
    comment: 'api request method:1 get 2 post 3 patch 4 put',
    width: 2,
    type: 'tinyint',
  })
  reqMethod: number;

  @Column({
    name: 'api_version',
    nullable: false,
    comment: 'api version',
    length: 10,
  })
  apiVersion: string | null;

  @Column({
    name: 'req_ip',
    nullable: false,
    comment: 'client ip',
    length: 20,
  })
  reqIp: string | null;

  @Column('json', { name: 'req_detail', nullable: true, comment: 'api call details, including ua, refer and other information' })
  reqDetail: IApiRequestDetail | null;

  @Column('json', { name: 'res_detail', nullable: true, comment: 'api calls return information, including code, message, etc' })
  resDetail: IApiResponseDetail | null;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'creation time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
