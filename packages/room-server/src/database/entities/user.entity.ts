import { IdWorker } from 'shared/helpers/snowflake';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 工作台-数据表格表
 */
@Entity('vika_user')
export class UserEntity {
  @Column({
    name: 'uuid',
    nullable: true,
    unique: true,
    comment: '用户uuid',
    length: 32,
  })
    uuid: string | null;

  @Column({
    name: 'nick_name',
    nullable: true,
    comment: '昵称',
    length: 50,
  })
    nikeName: string | null;

  @Column({
    name: 'mobile_phone',
    nullable: true,
    comment: '手机号码',
    length: 50,
  })
    mobilePhone: string | null;

  @Column({
    name: 'email',
    nullable: true,
    comment: '邮箱',
    length: 100,
  })
    email: string | null;

  @Column({
    name: 'password',
    nullable: true,
    comment: '密码',
    length: 255,
  })
    password: string | null;

  @Column({
    name: 'avatar',
    nullable: true,
    comment: '头像',
    length: 255,
  })
    avatar: string | null;

  @Column({
    name: 'gender',
    comment: '性别',
    length: 1,
    default: '1',
  })
    gender: string;

  @Column({
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
    remark: string | null;

  @Column({
    name: 'ding_open_id',
    nullable: true,
    comment: '钉钉开放应用内的唯一标识',
    length: 255,
  })
    dingOpenId: string | null;

  @Column({
    name: 'ding_union_id',
    nullable: true,
    comment: '钉钉开发者企业内的唯一标识',
    length: 255,
  })
    dingUnionId: string | null;

  @Column('timestamp', {
    name: 'last_login_time',
    nullable: true,
    comment: '更新时间',
  })
    lastLoginTime: Date | null;

  @Column({
    name: 'locale',
    nullable: true,
    comment: '语言',
    length: 50,
  })
    locale: string | null;

  @Column({
    name: 'is_social_name_modified',
    nullable: true,
    comment: '是否作为第三方 IM 用户修改过昵称。0：否；1：是；2：不是 IM 第三方用户',
    width: 1,
    type: 'tinyint',
  })
    isSocialNameModified: number | null;

  // picked from base entity
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'is_deleted',
    comment: '删除标记(0:否,1:是)',
    unsigned: true,
    default: () => false,
  })
    isDeleted: boolean;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date | null;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
