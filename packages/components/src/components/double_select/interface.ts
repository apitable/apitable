import { ISelectProps, ISelectValue } from 'components/select';

type IDoubleSelectPropsBase = Pick<ISelectProps, 'disabled' | 'triggerStyle' | 'triggerCls'>;

export interface IDoubleSelectProps extends IDoubleSelectPropsBase {
  value: ISelectValue;

  /**
   * select list options
   */
  options: IDoubleOptions[];

  /**
   * Selected event callback
   * @param {IDoubleOptions} option
   * @param {number} index
   */
  onSelected: (option: IDoubleOptions, index: number) => void;
}

export interface IDoubleOptions {
  /**
   * current selected option
   */
  value: ISelectValue;

  /**
   * Select list title
   */
  label: string;

  /**
   * Select list subtitle
   */
  subLabel: string

  /**
   * Whether selected option can be selected
   */
  disabled?: boolean;

  /**
   * When the option is not optional, provide a tooltip prompt
   */
  disabledTip?: string;
}

export interface IDoubleOptionsProps {
  /**
   * Select option values
   */
  option: IDoubleOptions;

  /**
   * Select option index
   */
  currentIndex: number;

  /**
   * Selected option value
   */
  selectedValue: ISelectValue;
}
