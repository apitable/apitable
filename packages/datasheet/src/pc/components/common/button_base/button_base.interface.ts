
export type ButtonSize = 'x-small' | 'small' | 'middle' | 'large';

type ButtonShape = 'circle' | 'round' | 'square';

type IAnchorButtonProps = {
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

type INativeButtonProps = {
  htmlType?: 'submit' | 'button' | 'reset';
  onClick?: React.MouseEventHandler<HTMLElement>;
} &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

interface IButtonBaseProps {
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  icon?: React.ReactNode;
  block?: boolean;
  border?: boolean;
  reversal?: boolean;
  shadow?: boolean,
  className?: string,
  prefixCls?: string,
}

export type IButtonBase = IButtonBaseProps & IAnchorButtonProps & INativeButtonProps;