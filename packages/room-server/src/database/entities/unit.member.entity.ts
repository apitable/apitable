import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity(`unit_member`)
export class UnitMemberEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    nullable: true,
    comment: 'user ID(related#user#id)',
    width: 20,
    type: 'bigint',
  })
    userId: number | null;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#space#space_id)',
    length: 50,
    type: 'varchar',
  })
    spaceId: string;

  @Column({
    name: 'member_name',
    nullable: false,
    comment: 'member name',
    length: 255,
    type: 'varchar',
  })
    memberName: string | null;

  @Column({
    name: 'job_number',
    nullable: false,
    comment: 'job number',
    length: 60,
    type: 'varchar',
  })
    jobNumber: string | null;

  @Column({
    name: 'position',
    nullable: false,
    comment: 'position',
    width: 255,
    type: 'varchar',
  })
    position: string | null;

  @Column({
    name: 'mobile',
    nullable: false,
    comment: 'mobile number',
    length: 20,
    type: 'varchar',
  })
    mobile: string | null;

  @Column({
    name: 'email',
    nullable: false,
    comment: 'email',
    length: 100,
    type: 'varchar',
  })
    email: string | null;

  @Column({
    name: 'ding_user_id',
    nullable: false,
    comment: 'DingDing user ID',
    length: 64,
    type: 'varchar',
  })
    dingUserId: string | null;

  @Column({
    name: 'status',
    nullable: false,
    comment: 'user status(0: Non -active, 1: active, 2: pre -delete, 3: No activation)',
    width: 2,
    type: 'tinyint',
  })
    status: number | 0;

  @Column({
    name: 'is_social_name_modified',
    nullable: true,
    comment: 'Have you modified the nickname as a third -party IM user? 0: No; 1: Yes; 2: Not third -party users of IM',
    width: 1,
    type: 'tinyint',
  })
    isSocialNameModified: number | null;

  @Column({
    name: 'is_point',
    nullable: false,
    comment: 'are there little red dots (0: no, 1: yes)',
    width: 1,
    type: 'tinyint',
  })
    isPoint: number | 0;

  @Column({
    name: 'is_active',
    nullable: false,
    comment: 'is it activated (0: No, 1: Yes)',
    width: 1,
    type: 'tinyint',
  })
    isActive: number | 0;

  @Column({
    name: 'is_admin',
    nullable: false,
    comment: 'whether the administrator (0: no, 1: yes)',
    width: 1,
    type: 'tinyint',
  })
    isAdmin: number | 0;
}
