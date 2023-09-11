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

import classNames from 'classnames';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Select, Tooltip, useThemeColors } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { CheckOutlined, ChevronDownOutlined, WarnFilled } from '@apitable/icons';
import { IRoleOption, IUnitInfo } from 'pc/components/catalog/permission_settings/permission/unit_item/interface';
import { MobileSelect } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header/wrapper_tooltip';
import styles from './style.module.less';

const Option = Select.Option!;

interface IPermissionSelectProps {
  role: string;
  roleOptions: IRoleOption[];
  onChange?: (unitId: string, role: string) => void;
  unit: IUnitInfo;
  allowRemove?: boolean;
  onRemove?: (unitId: string) => void;
  roleInvalid?: boolean;
}

export const PermissionSelect: React.FC<React.PropsWithChildren<IPermissionSelectProps>> = (props) => {
  const { roleOptions, role, onChange, unit, allowRemove = true, onRemove, roleInvalid } = props;
  const colors = useThemeColors();
  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.selectWrapper}>
          <Select
            value={role}
            onSelected={(option) => {
              if (option.value === 'remove') {
                onRemove?.(unit.id);
                return;
              }
              onChange?.(unit.id, option.value as string);
            }}
            dropdownMatchSelectWidth={false}
            triggerStyle={{
              border: 'none',
            }}
            triggerCls={styles.hoverBg}
            suffixIcon={
              roleInvalid ? (
                <Tooltip content={t(Strings.field_permission_role_valid)}>
                  <span>
                    <WarnFilled />
                  </span>
                </Tooltip>
              ) : null
            }
          >
            {roleOptions.map((option, index) => {
              return (
                <Option key={option.value} value={option.value} disabled={option.disabled} currentIndex={index}>
                  <WrapperTooltip wrapper={Boolean(option.disabled && option.disabledTip)} tip={option.disabledTip || ''}>
                    <span>{option.label}</span>
                  </WrapperTooltip>
                </Option>
              );
            })}
            <Option
              value={'remove'}
              disabled={!allowRemove}
              currentIndex={roleOptions.length}
              className={classNames({
                [styles.delete]: true,
                [styles.disabled]: !allowRemove,
              })}
            >
              {t(Strings.remove_role)}
            </Option>
            ;
          </Select>
        </div>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        {
          <MobileSelect
            triggerComponent={
              <div className={styles.mobileRoleSelect}>
                {ConfigConstant.permissionText[role!]}
                {<ChevronDownOutlined className={styles.arrowIcon} size={16} color={colors.fourthLevelText} />}
              </div>
            }
            renderList={({ setVisible }) => {
              return (
                <>
                  <div className={styles.mobileWrapper}>
                    {roleOptions.map((item) => (
                      <div
                        className={classNames(styles.mobileOption)}
                        key={item.value}
                        onClick={() => {
                          onChange?.(unit.id, item.value);
                          setVisible(false);
                        }}
                      >
                        {item.label}
                        {item.value === role && <CheckOutlined color={colors.primaryColor} />}
                      </div>
                    ))}
                  </div>
                  {onRemove && (
                    <div
                      className={classNames(styles.deleteItem, styles.group)}
                      onClick={() => {
                        onRemove(unit.id);
                      }}
                    >
                      {t(Strings.delete)}
                    </div>
                  )}
                </>
              );
            }}
          />
        }
      </ComponentDisplay>
    </>
  );
};
