export type IButtonType = 'default' | 'danger' | 'primary' | 'warning';
export interface IButtonBaseProps {
  shape?: 'round';
  variant?: 'jelly' | 'fill';
  size?: 'small' | 'middle' | 'large';
  btnColor?: IButtonType | string;
  disabled?: boolean;
  block?: boolean;
}

type IButtonHTMLAttributes = Omit<React.ButtonHTMLAttributes<any>, | 'color'>;

export interface IButtonProps extends IButtonHTMLAttributes {
  htmlType?: 'submit' | 'reset' | 'button';
  /** border shape */
  shape?: 'round';
  /** child elements */
  children?: React.ReactNode;
  /** class name */
  className?: string;
  /** button color default | danger | primary | string */
  color?: IButtonType | string;
  /**
   * prefix icon
   */
  prefixIcon?: React.ReactElement;
  /**
   * suffix icon
   */
  suffixIcon?: React.ReactElement;
  /**
   * whether button should be disabled
   */
  disabled?: boolean;
  /**
   * with 100% width
   */
  block?: boolean;
  /**
   * variant type
   */
  variant?: 'fill' | 'jelly';
  /**
   * button size
   */
  size?: 'small' | 'middle' | 'large';
  /**
   * whether button is loading
   */
  loading?: boolean;
}
