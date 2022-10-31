import { IdWorker } from 'shared/helpers/snowflake';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Workbench-User
 */
@Entity('vika_user')
export class UserEntity {
  @Column({
    name: 'uuid',
    nullable: true,
    unique: true,
    comment: 'user uuid',
    length: 32,
  })
    uuid: string | null;

  @Column({
    name: 'nick_name',
    nullable: true,
    comment: 'nick name',
    length: 50,
  })
    nikeName: string | null;

  @Column({
    name: 'mobile_phone',
    nullable: true,
    comment: 'mobile phone number',
    length: 50,
  })
    mobilePhone: string | null;

  @Column({
    name: 'email',
    nullable: true,
    comment: 'email',
    length: 100,
  })
    email: string | null;

  @Column({
    name: 'password',
    nullable: true,
    comment: 'password',
    length: 255,
  })
    password: string | null;

  @Column({
    name: 'avatar',
    nullable: true,
    comment: 'avatar',
    length: 255,
  })
    avatar: string | null;

  @Column({
    name: 'gender',
    comment: 'gender',
    length: 1,
    default: '1',
  })
    gender: string;

  @Column({
    name: 'remark',
    nullable: true,
    comment: 'remark',
    length: 255,
  })
    remark: string | null;

  @Column({
    name: 'ding_open_id',
    nullable: true,
    comment: 'The unique ID in the open application',
    length: 255,
  })
    dingOpenId: string | null;

  @Column({
    name: 'ding_union_id',
    nullable: true,
    comment: 'The unique ID in the Dingding developer enterprise',
    length: 255,
  })
    dingUnionId: string | null;

  @Column('timestamp', {
    name: 'last_login_time',
    nullable: true,
    comment: 'updated time',
  })
    lastLoginTime: Date | null;

  @Column({
    name: 'locale',
    nullable: true,
    comment: 'locale',
    length: 50,
  })
    locale: string | null;

  @Column({
    name: 'is_social_name_modified',
    nullable: true,
    comment: 'have you modified the nickname as a third -party IM user? 0: No; 1: Yes; 2: Not third -party users of IM',
    width: 1,
    type: 'tinyint',
  })
    isSocialNameModified: number | null;

  // picked from base entity
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'is_deleted',
    comment: 'deleted mark (0: No, 1: Yes)',
    unsigned: true,
    default: () => false,
  })
    isDeleted: boolean;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: 'updated time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date | null;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
