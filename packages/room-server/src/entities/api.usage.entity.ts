import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { IApiRequestDetail, IApiResponseDetail } from 'interfaces';
import { IdWorker } from 'helpers';

/**
 * 工作台-数据表格表
 */
@Entity('vika_api_usage')
export class ApiUsageEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'user_id',
    nullable: false,
    unique: true,
    comment: '用户ID',
    width: 20,
    type: 'bigint',
  })
    userId: bigint;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: '空间ID',
    length: 50,
  })
    spaceId: string | null;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: '数表ID',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'req_path',
    nullable: false,
    comment: 'api的path,域名后面的数据',
    length: 100,
  })
    reqPath: string | null;

  @Column({
    name: 'req_method',
    nullable: false,
    comment: 'api请求方式1 get 2 post 3 patch 4 put',
    width: 2,
    type: 'tinyint',
  })
    reqMethod: number;

  @Column({
    name: 'api_version',
    nullable: false,
    comment: 'api版本',
    length: 10,
  })
    apiVersion: string | null;

  @Column({
    name: 'req_ip',
    nullable: false,
    comment: '客户端IP',
    length: 20,
  })
    reqIp: string | null;

  @Column('json', { name: 'req_detail', nullable: true, comment: 'api调用详细信息,包括ua,refer等信息' })
    reqDetail: IApiRequestDetail | null;

  @Column('json', { name: 'res_detail', nullable: true, comment: 'api调用返回信息，包括code,message等' })
    resDetail: IApiResponseDetail | null;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
