
export interface ICheckboxProps {
  /**
   * whether the checkbox should be checked
   */
  checked?: boolean;
  /**
   * checkbox size
   */
  size?: number;
  /**
   * checkbox color
   */
  color?: string;
  onChange?: (value: boolean) => void;
  children?: React.ReactNode;
  /**
   * disabled
   */
  disabled?: boolean;
}