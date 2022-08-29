import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IResourceMeta, ResourceType } from '@vikadata/core';

/**
 * 资源对应的元数据表，如 Form/Dashboard
 */
@Entity('vika_resource_meta')
export class ResourceMetaEntity extends BaseEntity {
  @Column({
    name: 'resource_id',
    nullable: false,
    comment: '资源ID(关联#vika_node#node_id)',
    length: 50,
  })
    resourceId: string;

  @Column({
    name: 'resource_type',
    nullable: false,
    comment: '资源类型(0:数表;1:神奇表单;2:仪表盘;3:组件)',
    unsigned: true,
    default: () => 0,
  })
    resourceType: ResourceType;

  @Column('json', {
    name: 'meta_data',
    nullable: true,
    comment: '元数据',
  })
    metaData: IResourceMeta | null;

  @Column('bigint', {
    name: 'revision',
    comment: '版本号',
    nullable: false,
    unsigned: true,
    default: () => 0,
  })
    revision: number;
}
