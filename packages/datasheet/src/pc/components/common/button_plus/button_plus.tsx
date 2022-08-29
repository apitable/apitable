import classNames from 'classnames';
import { FC } from 'react';
import { ButtonBase } from '../button_base/button_base';
import { IButtonBase } from '../button_base/button_base.interface';
import { ButtonPrefixCls } from '../button_base/constants';
import { IButtonGroup } from './button_plus.interface';

const IconButton: FC<IButtonBase> = props => {
  const { size = 'x-small', shape = 'circle', border = false, className, prefixCls, ...rest } = props;
  const classKey = prefixCls || ButtonPrefixCls.Btn;
  const cla = classNames([`${classKey}-plus-icon`], className);
  const data: IButtonBase = {
    size,
    shape,
    border,
    className: cla,
    ...rest,
  };
  return <ButtonBase {...data} />;
};

const FontButton: FC<IButtonBase> = props => {
  const { size = 'middle', shape = 'round', border = false, className, prefixCls, ...rest } = props;
  const classKey = prefixCls || ButtonPrefixCls.Btn;
  const cla = classNames([`${classKey}-plus-font`], className);
  const data: IButtonBase = {
    size,
    shape,
    border,
    className: cla,
    ...rest,
  };
  return <ButtonBase {...data} />;
};

const TranslucentButton: FC<IButtonBase> = props => {
  const { size = 'middle', shape = 'square', border = true, style, className, prefixCls, ...rest } = props;
  const classKey = prefixCls || ButtonPrefixCls.Btn;
  const cla = classNames([`${classKey}-plus-translucent`], className);
  const data: IButtonBase = {
    size,
    shape,
    border,
    style: { ...style },
    className: cla,
    prefixCls,
    ...rest,
  };
  return <ButtonBase {...data} />;
};

const ButtonGroup: FC<IButtonGroup> = (props) => {
  const { children, className, style } = props;

  return <div
    className={classNames(`${ButtonPrefixCls.Btn}-group`, className)}
    style={style}
  >
    {
      children
    }
  </div>;
};

export const ButtonPlus = {
  Icon: IconButton,
  Font: FontButton,
  Translucent: TranslucentButton,
  Group: ButtonGroup,
};
