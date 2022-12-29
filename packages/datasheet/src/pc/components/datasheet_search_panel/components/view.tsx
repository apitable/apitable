import * as React from 'react';
import classNames from 'classnames';
import styles from './style.module.less';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import { useThemeColors } from '@apitable/components';

export const View: React.FC<{ 
  id: string,
  active?: boolean, 
  viewType,
  onClick?(id: string) 
}> = props => {
  const { 
    children, 
    id, 
    active,
    viewType, 
    onClick,
  } = props;
  const colors = useThemeColors();
  return (
    <div className={styles.nodeContainerWrapper}>
      <div 
        className={classNames(styles.nodeContainer, styles.viewNodeContainer, {
          [styles.active]: active,
        })}
        onClick={() => onClick && onClick(id)}
      >
        <ViewIcon viewType={viewType} fill={active ? colors.primaryColor : colors.fourthLevelText} />
        <span className={classNames(styles.text, styles.rightText)}>{children}</span>
      </div>
    </div>
  );
};