import { IListBase } from '../list.interface';
import { ISelectFieldOption, IFieldProperty, ICollaCommandExecuteResult } from '@apitable/core';

export interface IOptionListProps extends IListBase<string[], ISelectFieldOption[]> {

  /**
   * @description The data used for the drop-down list tree is the same data structure as the data stored in the column headers
   * @type {ISelectFieldOption[]}
   */
  listData: ISelectFieldOption[];

  /**
   * @description The operation related to dragging, currently after the cell and expand the card has the function, 
   * you can basically use this to determine whether the cell
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
   * @description Set the properties of the column headers
   */
  setCurrentField?: (getNewField: (newField: IFieldProperty) => IFieldProperty) => ICollaCommandExecuteResult<{}>

  /**
   * @description Add a new option
   * @param {string} keyword
   * @param {*} cb
   */
  onAddHandle?(keyword: string, cb): void;

  /**
   * @description Capture the internal Input instance of the component to facilitate triggering focus
   * @type {React.RefObject<HTMLInputElement>}
   */
  inputRef: React.RefObject<HTMLInputElement>

  datasheetId?: string
  placeholder?: string;
}