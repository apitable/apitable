
type IButtonHTMLAttributes = Omit<React.ButtonHTMLAttributes<any>, 'color'>;

export interface ITextButtonProps extends IButtonHTMLAttributes {
  children?: React.ReactNode;
  /**
   * Button type
   */
  color?: 'default' | 'danger' | 'primary';
  size?: 'x-small' | 'small' | 'middle' | 'large';
  /**
   * Prefix icon
   */
  prefixIcon?: React.ReactElement;
  /**
   * Suffix icon
   */
  suffixIcon?: React.ReactElement;
  /**
   * Whether disabled or not
   */
  disabled?: boolean;
  /**
   * Whether full width or not
   */
  block?: boolean;
}
