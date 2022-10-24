import { IListBase } from '../list.interface';
import { ISelectFieldOption, IFieldProperty, ICollaCommandExecuteResult } from '@apitable/core';

export interface IOptionListProps extends IListBase<string[], ISelectFieldOption[]> {

  /**
   * @description 下拉列表树妖用的数据，数据结构和列头存储的数据一致
   * @type {ISelectFieldOption[]}
   */
  listData: ISelectFieldOption[];

  /**
   * @description 和拖动相关的操作，目前之后单元格和展开卡片有该功能，
   * 基本可以用此判断是否在单元格内
   * @type {({
   *     draggingId: string | undefined
   *     setDraggingId: any
   *     afterDrag (trulyOldIndex, trulyNewIndex): void
   *   })}
   */
  dragOption?: {
    draggingId: string | undefined
    setDraggingId: any
    afterDrag (trulyOldIndex, trulyNewIndex): void
  };

  /**
   * @description 设置列头的属性
   */
  setCurrentField?: (getNewField: (newField: IFieldProperty) => IFieldProperty) => ICollaCommandExecuteResult<{}>

  /**
   * @description 新增一条新的选项
   * @param {string} keyword
   * @param {*} cb
   */
  onAddHandle?(keyword: string, cb): void;

  /**
   * @description 捕获组件内部的 Input 实例，方便触发 focus
   * @type {React.RefObject<HTMLInputElement>}
   */
  inputRef: React.RefObject<HTMLInputElement>

  datasheetId?: string
  placeholder?: string;
}