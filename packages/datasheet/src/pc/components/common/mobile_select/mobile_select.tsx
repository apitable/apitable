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

import { SelectValue } from 'antd/lib/select';
import { useThemeColors } from '@apitable/components';
import { useCallback, useState } from 'react';
import * as React from 'react';
import ArrowIcon from 'static/icon/common/common_icon_pulldown_line.svg';
import IconChecked from 'static/icon/common/common_icon_select.svg';
import styles from './style.module.less';
import { Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { Popup } from '../mobile/popup';
import { IMobileSelectProps } from './interface';

const MobileSelectBase: React.FC<React.PropsWithChildren<IMobileSelectProps>> = props => {
  const {
    optionData,
    triggerComponent,
    onClose,
    title,
    renderList,
    defaultValue,
    onChange: _onChange,
    className,
    style
  } = props;
  const colors = useThemeColors();
  const onChange = useCallback(
    (value: SelectValue, options?: any) => {
      _onChange && _onChange(value, options);
    },
    [_onChange],
  );

  const [visible, setVisible] = useState(false);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const hasOuterTrigger = Boolean(triggerComponent);

  return (
    <>
      {!hasOuterTrigger && (
        <div
          className={classNames(styles.trigger, className)}
          onClick={() => setVisible(true)}
          style={style}
        >
          <span>{optionData?.find(item => item.value === defaultValue)?.label}</span>
          <ArrowIcon
            className={styles.arrow}
            width={16}
            height={16}
            fill={colors.fourthLevelText}
          />
        </div>
      )}
      {hasOuterTrigger && (
        <div
          className={classNames('outerTrigger', styles.outerTrigger)}
          onClick={() => setVisible(true)}
        >
          {triggerComponent}
        </div>
      )}
      {
        visible &&
        <Popup
          open={visible}
          title={title || t(Strings.please_choose)}
          height={props.height || '50%'}
          onClose={() => {
            setVisible(false);
            onClose?.();
          }}
          className={styles.optionsListMenu}
        >
          <div className={styles.optionsListWrapper}>
            {
              renderList ? renderList({ setVisible }) : (
                optionData?.length ? optionData.map(item => {

                  const selectedVal = selectedValue || defaultValue;
                  const isChecked = item.value === selectedVal;

                  return (
                    <div
                      className={classNames(styles.optionItem, {
                        [styles.active]: isChecked,
                        [styles.disabled]: item.disabled,
                      })}
                      key={item.value}
                      onClick={() => {
                        if (item.disabled) {
                          return;
                        }
                        setSelectedValue(item.value);
                        onChange(item.value, optionData);
                        setVisible(false);
                      }}
                    >
                      <div className={styles.fieldItem}>
                        {item.prefixIcon}
                        <span className={styles.fieldName}>
                          {item.label}
                        </span>
                        {item.suffixIcon}
                      </div>
                      {isChecked && <IconChecked fill={colors.primaryColor} style={{ marginRight: 8 }} />}
                    </div>
                  );
                }
                ) : t(Strings.no_option)
              )
            }
          </div>
        </Popup>
      }
    </>
  );
};

export const MobileSelect = React.memo(MobileSelectBase);
