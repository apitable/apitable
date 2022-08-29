
type IButtonHTMLAttributes = Omit<React.ButtonHTMLAttributes<any>, 'color'>;

export interface ITextButtonProps extends IButtonHTMLAttributes {
  children?: React.ReactNode;
  /**
   * 颜色
   */
  color?: 'default' | 'danger' | 'primary';
  size?: 'x-small' | 'small' | 'middle' | 'large';
  /**
   * 前置 icon
   */
  prefixIcon?: React.ReactElement;
  /**
   * 后置 icon
   */
  suffixIcon?: React.ReactElement;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 占满容器的宽度的 100%
   */
  block?: boolean;
}
