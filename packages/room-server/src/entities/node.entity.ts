import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IFormProps } from '@vikadata/core';

/**
 * 工作台-节点表
 */
@Entity('vika_node')
export class NodeEntity extends BaseEntity {
  @Column({
    name: 'type',
    nullable: false,
    comment: '类型 (0:根节点;1:文件夹;2:数表;3:神奇表单)',
    width: 2,
    type: 'tinyint',
  })
    type: number;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: '空间ID(关联#vika_space#space_id)',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'parent_id',
    nullable: false,
    comment: '父节点Id',
    length: 50,
  })
    parentId: string;

  @Column({
    name: 'pre_node_id',
    nullable: true,
    comment: '同级下前一个节点ID',
    length: 50,
  })
    preNodeId: string | null;

  @Column({
    name: 'node_id',
    nullable: false,
    unique: true,
    comment: '数表节点Id(关联#vika_node#node_id)',
    length: 50,
  })
    nodeId: string | null;

  @Column({
    name: 'node_name',
    nullable: true,
    comment: '名称',
    length: 255,
  })
    nodeName: string | null;

  @Column({
    name: 'icon',
    nullable: true,
    comment: '节点图标',
    length: 100,
  })
    icon: string | null;

  @Column({
    name: 'cover',
    nullable: true,
    comment: '封面图TOKEN',
    length: 255,
  })
    cover: string | null;

  @Column({
    name: 'is_template',
    comment: '模版标志(0:否,1:是)',
    unsigned: true,
    default: () => false,
  })
    isTemplate: boolean;

  @Column('json', {
    name: 'extra',
    nullable: true,
    comment: '其他信息'
  })
    extra: IFormProps | null;

  @Column({
    name: 'deleted_path',
    nullable: true,
    comment: '删除时的路径',
    length: 255,
  })
    deletedPath: string | null;

  @Column({
    name: 'is_rubbish',
    comment: '回收站标记(0:否,1:是)',
    unsigned: true,
    default: () => false,
  })
    isRubbish: boolean;

  @Column({
    name: 'is_banned',
    comment: '封禁标志(0:否,1:是)',
    unsigned: true,
    default: () => false,
  })
    isBanned: boolean;
}
