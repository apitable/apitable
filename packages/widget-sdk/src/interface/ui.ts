import { Datasheet } from 'model';
import { FieldType } from './field_types';
import { ViewType } from './view_types';

export interface IFieldPicker {
  /** 指定可以选择的字段类型 */
  allowedTypes?: FieldType[];
  /** 选项值发生改变的时候回调 */
  onChange?: (option: IOption) => void;
  /** 对应的视图ID，指定视图后，字段选择器中的选项顺序将按该视图中的字段顺序，该视图隐藏的字段也会出现在选项中 */
  viewId: string | undefined;
  /** 选中的fieldId */
  fieldId?: string;
  /** 未选择字段时的占位符文本。默认为 “请选择” */
  placeholder?: string;
  /** 如果设置为 true，则用户无法进行选择交互 */
  disabled?: boolean;
  /** 从哪个维格表中选择字段，默认为小程序绑定的关联表 */
  datasheet?: Datasheet;
}

export interface IOption {
  label: string;
  value: string
}

export interface IViewPicker {
  /** 指定可以选择的视图类型 */
  allowedTypes?: ViewType[];
  /** 未选择视图时的占位符文本。默认为 “请选择” */
  placeholder?: string;
  /** 选项值发生改变的时候回调 */
  onChange?: (option: IOption) => void;
  /** 选中的视图ID */
  viewId?: string;
  /** 如果设置为 true，则用户无法进行选择交互 */
  disabled?: boolean;
  /** 从哪个维格表中选择视图，默认为小程序绑定的关联表 */
  datasheet?: Datasheet;
  /**
   * `Beta API`, 未来可能会有变更
   * 
   * 如果开启此选项，该 ViewPicker 中所选择的视图将作为在仪表盘中「跳转到关联表」的目标视图。
   * 
   * 跳转到的关联表只能是该小程序绑定的维格表
   * 
   * 注意：同一个小程序中，只能在一个 ViewPicker 中设置 controlJump 选项；如果在多个 ViewPicker 中设置 controlJump 选项，将无法保证该功能正常。
   * 
   * 建议：开启此功能后，应该对选择的视图使用 useCloudStorage 做持久化存储，否则可能将造成异常情况。
  */
  controlJump?: boolean;
}