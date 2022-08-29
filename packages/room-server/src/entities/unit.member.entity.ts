import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('vika_unit_member')
export class UnitMemberEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    nullable: true,
    comment: '用户ID(关联#vika_user#id)',
    width: 20,
    type: 'bigint',
  })
    userId: number | null;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: '空间ID(关联#vika_space#space_id)',
    length: 50,
    type: 'varchar',
  })
    spaceId: string;

  @Column({
    name: 'member_name',
    nullable: false,
    comment: '成员姓名',
    length: 255,
    type: 'varchar',
  })
    memberName: string | null;

  @Column({
    name: 'job_number',
    nullable: false,
    comment: '工号',
    length: 60,
    type: 'varchar',
  })
    jobNumber: string | null;

  @Column({
    name: 'position',
    nullable: false,
    comment: '职位',
    width: 255,
    type: 'varchar',
  })
    position: string | null;

  @Column({
    name: 'mobile',
    nullable: false,
    comment: '手机号码',
    length: 20,
    type: 'varchar',
  })
    mobile: string | null;

  @Column({
    name: 'email',
    nullable: false,
    comment: '电子邮箱',
    length: 100,
    type: 'varchar',
  })
    email: string | null;

  @Column({
    name: 'ding_user_id',
    nullable: false,
    comment: '钉钉员工ID',
    length: 64,
    type: 'varchar',
  })
    dingUserId: string | null;

  @Column({
    name: 'status',
    nullable: false,
    comment: '用户的空间状态(0:非活跃,1:活跃,2:预删除,3:未激活)',
    width: 2,
    type: 'tinyint',
  })
    status: number | 0;

  @Column({
    name: 'is_social_name_modified',
    nullable: true,
    comment: '是否作为第三方 IM 用户修改过昵称。0：否；1：是；2：不是 IM 第三方用户',
    width: 1,
    type: 'tinyint',
  })
    isSocialNameModified: number | null;

  @Column({
    name: 'is_point',
    nullable: false,
    comment: '是否有小红点(0:否,1:是)',
    width: 1,
    type: 'tinyint',
  })
    isPoint: number | 0;

  @Column({
    name: 'is_active',
    nullable: false,
    comment: '是否激活(0:否,1:是)',
    width: 1,
    type: 'tinyint',
  })
    isActive: number | 0;

  @Column({
    name: 'is_admin',
    nullable: false,
    comment: '是否管理员(0:否,1:是)',
    width: 1,
    type: 'tinyint',
  })
    isAdmin: number | 0;
}
