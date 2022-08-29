export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;
export interface ISwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  className?: string;
  prefixCls?: string;
  /**
   * 禁用状态
   */
  disabled?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: SwitchChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onClick?: SwitchClickEventHandler;
  tabIndex?: number;
  /**
   * 开启状态
   */
  checked?: boolean;
  /**
   * 默认是否开启
   */
  defaultChecked?: boolean;
  /**
   * 加载状态
   */
  loading?: boolean;
  /**
   * 加载图标
   */
  loadingIcon?: React.ReactNode;
  /**
   * 行内样式
   */
  style?: React.CSSProperties;
  title?: string;
  /**
   * 大小
   */
  size?: 'small' | 'default' | 'large';
}