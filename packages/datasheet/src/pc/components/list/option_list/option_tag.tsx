import * as React from 'react';
import styles from './style.module.less';
import { useThemeColors } from '@vikadata/components';
import classnames from 'classnames';
import { Tooltip } from 'pc/components/common';
import { ISelectFieldOption, Selectors, ThemeName } from '@vikadata/core';
import { setColor } from 'pc/components/multi_grid/format';
import { COLOR_INDEX_THRESHOLD } from 'pc/utils';
import { useSelector } from 'react-redux';

interface IOptionTagProps {
  option: ISelectFieldOption;
  style?: React.CSSProperties;
  className?: string;
  ellipsis?: boolean;
}

export const OptionTag: React.FC<IOptionTagProps> = (props) => {
  const colors = useThemeColors();
  const cacheTheme = useSelector(Selectors.getTheme);
  const { option, style = {}, className, ellipsis = true } = props;
  // 透明度为 0.8 或 1 的深色要换成白色字体
  const optionNameColor = cacheTheme === ThemeName.Dark ? colors.staticWhite0 : 
    (option.color >= COLOR_INDEX_THRESHOLD ? colors.defaultBg : 'inherit');

  return (
    <div
      className={classnames(styles.itemContainer, className)}
      style={{ background: setColor(option.color, cacheTheme), ...style }}
    >
      <Tooltip
        title={option.name}
        textEllipsis
      >
        <span 
          className={classnames(styles.itemName, ellipsis && styles.itemNameEllipsis)} 
          style={{ color: optionNameColor }}
        >
          {option.name}
        </span>
      </Tooltip>
    </div>
  );
};
