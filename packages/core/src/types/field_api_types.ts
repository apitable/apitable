import { IAPIMetaFieldProperty } from 'types/field_api_property_types';
import { APIMetaFieldType } from './field_api_enums';

/**
 * 字段相关
 */
export interface IAPIMetaField {
  id: string;
  name: string;
  type: APIMetaFieldType;
  isPrimary?: boolean;
  desc?: string;
  property?: IAPIMetaFieldProperty;
  /**
   * manage > edit > read
   * manage 管理字段
   * edit 写单元格
   * read 读单元格
   */
  // 暂时不暴露权限等级，后续 meta 可写时再考虑。
  // permissionLevel: APIMetaFieldPermissionLevel;
  // 单元格是否可以编辑
  editable: boolean;
}
