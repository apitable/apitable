
export interface ICheckboxProps {
  /**
   * 是否勾选
   */
  checked?: boolean;
  /**
   * 大小 单位像素
   */
  size?: number;
  /**
   * 颜色
   */
  color?: string;
  onChange?: (value: boolean) => void;
  children?: React.ReactNode;
  /**
   * 禁用
   */
  disabled?: boolean;
}