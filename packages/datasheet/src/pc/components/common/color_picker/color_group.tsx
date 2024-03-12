/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Tooltip } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { Box, FloatUiTooltip, Typography, TooltipBase } from '@apitable/components';
import { ButtonStyleType, ISelectFieldOption, Selectors, Strings, t } from '@apitable/core';
import { AutomationConstant } from 'pc/components/automation/config';
import { setColor, useColorColorWheel } from 'pc/components/multi_grid/format';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { OptionSetting } from './enum';
import styles from './style.module.less';

export interface IColorGroupProps {
  colorGroup: number[];
  option: ISelectFieldOption;
  onChange?: (type: OptionSetting, id: string, value: string | number) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  itemStyle?: React.CSSProperties;
  options?: {
    style?: ButtonStyleType;
    content?: string;
  };
}

const StyledFloatUiTooltip = styled(FloatUiTooltip)`
  padding: 0 !important;
`;

const StyledTooltipBase = styled(TooltipBase)`
`;

export const ColorGroup: FC<React.PropsWithChildren<IColorGroupProps>> = (props) => {
  const { colorGroup, options, option, onChange, style, disabled, itemStyle } = props;
  const [colorIdx, setColorIdx] = useState<number>();
  const colors = useCssColors();
  const cacheTheme = useAppSelector(Selectors.getTheme);

  const colorList = useColorColorWheel(cacheTheme);
  const getTextColor = (color: number) => {
    let textColor: string = colors.textStaticPrimary;
    if (cacheTheme === 'dark') {
      if (color === AutomationConstant.whiteColor) {
        textColor = colors.textReverseDefault;
      }
    }
    return textColor;
  };

  return (
    <ul className={styles.colorGroup} style={style}>
      {colorGroup.map((colorIndex) => {
        const selected = colorIndex === option.color;
        const textColor = getTextColor(colorIndex);
        const li = (
          <li className={styles.item} style={itemStyle} key={option.id + colorIndex}>
            {!props?.options?.content ? (
              <div
                className={classNames(styles.outer, {
                  [styles.disabled]: disabled,
                  [styles.colorSelected]: selected,
                  [styles.active]: selected && colorIdx,
                })}
                onClick={(e: React.MouseEvent) => {
                  stopPropagation(e);
                  onChange?.(OptionSetting.SETCOLOR, option.id, colorIndex);
                  setColorIdx(colorIndex);
                }}
                onMouseDown={stopPropagation}
                key={colorIndex}
              >
                <div className={styles.borderWhite}>
                  <div
                    className={styles.inner}
                    style={{
                      background: colorIndex === -1 ? colors.defaultBg : setColor(colorIndex, cacheTheme),
                      border: colorIndex === -1 ? `1px solid ${colors.textCommonTertiary}` : 'none',
                    }}
                  />
                </div>
              </div>
            ) : (
              <StyledFloatUiTooltip
                placement={'top'}
                content={
                  <StyledTooltipBase>
                    {options?.style === ButtonStyleType.Background ? (
                      <Box backgroundColor={colorList[colorIndex]} padding={'6px 12px'} borderRadius={'4px'}>
                        <Typography variant={'body4'} color={textColor}>
                          {props?.options?.content}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        backgroundColor={colors.bgCommonDefault}
                        padding={'6px 12px'}
                        borderRadius={'4px'}
                      >
                        <Typography variant={'body4'} color={colorList[colorIndex]}>
                          {props?.options?.content}
                        </Typography>
                      </Box>
                    )}
                  </StyledTooltipBase>
                }
              >
                <div
                  className={classNames(styles.outer, {
                    [styles.disabled]: disabled,
                    [styles.colorSelected]: selected,
                    [styles.active]: selected && colorIdx,
                  })}
                  onClick={(e: React.MouseEvent) => {
                    stopPropagation(e);
                    onChange?.(OptionSetting.SETCOLOR, option.id, colorIndex);
                    setColorIdx(colorIndex);
                  }}
                  onMouseDown={stopPropagation}
                  key={colorIndex}
                >
                  <div className={styles.borderWhite}>
                    <div
                      className={styles.inner}
                      style={{
                        background: colorIndex === -1 ? colors.defaultBg : setColor(colorIndex, cacheTheme),
                        border: colorIndex === -1 ? `1px solid ${colors.textCommonTertiary}` : 'none',
                      }}
                    />
                  </div>
                </div>
              </StyledFloatUiTooltip>
            )}
          </li>
        );
        return disabled ? <Tooltip title={t(Strings.view_lock_setting_desc)}>{li}</Tooltip> : <>{li}</>;
      })}
    </ul>
  );
};
