import * as React from 'react';
import { Drawer } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import CloseIcon from 'static/icon/common/common_icon_close_small.svg';
import { useThemeColors } from '@vikadata/components';
import style from './style.module.less';
import classNames from 'classnames';

export const Popup: React.FC<DrawerProps> = props => {
  const colors = useThemeColors();
  return (
    <Drawer
      closeIcon={(
        <div className={style.closeIconWrapper}>
          <CloseIcon fill={colors.secondLevelText} width={16} height={16} />
        </div>
      )}
      push={{ distance: 0 }}
      placement='bottom'
      {...props}
      className={classNames(style.drawerPopup, props.className)}
    >
      {props.children}
    </Drawer>
  );
};