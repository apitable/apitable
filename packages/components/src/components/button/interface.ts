export type IButtonType = 'default' | 'danger' | 'primary' | 'warning';
export interface IButtonBaseProps {
  shape?: 'round';
  variant?: 'jelly' | 'fill'; // type 是 button 自带的属性，避免冲突
  size?: 'small' | 'middle' | 'large';
  btnColor?: IButtonType | string;
  disabled?: boolean;
  block?: boolean;
}

type IButtonHTMLAttributes = Omit<React.ButtonHTMLAttributes<any>, | 'color'>;

export interface IButtonProps extends IButtonHTMLAttributes {
  htmlType?: 'submit' | 'reset' | 'button';
  /** border 形状 */
  shape?: 'round';
  /** 子元素 */
  children?: React.ReactNode;
  /** 覆盖默认样式，应用与最外层组件 */
  className?: string;
  /** 按钮颜色 default | danger | primary | string */
  color?: IButtonType | string;
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
  /**
   * 类型
   */
  variant?: 'fill' | 'jelly';
  /**
   * button 大小
   */
  size?: 'small' | 'middle' | 'large';
  /**
   * 是否在加载中
   */
  loading?: boolean;
}
