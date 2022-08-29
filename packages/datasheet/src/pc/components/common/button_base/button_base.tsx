import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import classNames from 'classnames';
import { stylizeIcon } from 'pc/utils/dom';
import * as React from 'react';
import { IButtonBase } from './button_base.interface';
import { ButtonPrefixCls } from './constants';

const DEFAULT_ICON_SIZE = 16;

export const ButtonBase: React.FC<IButtonBase> = (props) => {
  const {
    size, loading, htmlType = 'button', className, shape,
    block, border, icon, children, prefixCls, shadow, ...rest
  } = props;
  const hasIcon = loading || icon;
  const isOnlyIcon = !children && children !== 0 && hasIcon;

  const classKey = prefixCls || ButtonPrefixCls.Btn;

  const classes = classNames(
    {
      [classKey]: true,
      [`${classKey}-block`]: block,
      [`${classKey}-padding`]: !isOnlyIcon,
      [`${classKey}-border`]: border,
      [`${classKey}-icon-only`]: isOnlyIcon,
      [`${classKey}-${size}`]: size,
      [`${classKey}-${shape}`]: shape,
      [`${classKey}-shadow`]: shadow,
    },
    className,
  );
  const finalIcon = stylizeIcon({
    icon,
    defaultSize: DEFAULT_ICON_SIZE,
  });
  const propsNode = finalIcon ? (
    <>
      <span className={`${classKey}-icon`}>
        {finalIcon}
      </span>
      <span>
        {children}
      </span>
    </>
  ) : (
    <>
      {children}
    </>
  );
  const finalKidsNode = loading ? (
    <>
      <LoadingOutlined style={{ marginRight: finalIcon || children ? '4px' : '0px' }} />
      {propsNode}
    </>
  ) : <>{propsNode}</>;
  return (
    <button
      type={htmlType}
      className={classes}
      {...rest}
    >
      {finalKidsNode}
    </button>
  );
};
