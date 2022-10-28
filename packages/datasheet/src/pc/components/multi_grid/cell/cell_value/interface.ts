import { ICellValue, IField } from '@apitable/core';

export interface ICellComponentProps {
  field: IField;

  /**
   * Note that the readonly here checks for more than just having access to the current count table, e.g.
   * For calculated fields, there are editing permissions for tables, but not for cells
   * For related fields, it is possible to have permissions on this table, but not on the other table
   * So the readonly here is the result of a comprehensive judgment, not just a question of this table's permissions
   */
  readonly?: boolean;

  cellValue: ICellValue;

  isActive?: boolean;

  className?: string;

  /**
   * Provides the ability to edit only the cells within the component.
   * When the cell content is changed, the onChange callback function is called, passing in the changed value, 
   * and the external component handles the command execution matter.
   */
  onChange?: (value: ICellValue) => void;

  /**
   * The component controls itself internally how to start editing.
   * When called, the Editor component corresponding to the cell will receive the editing change parameter.
   */
  toggleEdit?: () => void;

  showAlarm?: boolean;

  recordId?: string;

  /**
   * Why is there no recordId?
   * When rendering cell components, you should only focus on what is being rendered. 
   * It has nothing to do with the exact position of the cell and its id.
   * If the recordId/fieldId is used when writing the cell rendering component, it means that there is a problem with the logic design
   */
}
