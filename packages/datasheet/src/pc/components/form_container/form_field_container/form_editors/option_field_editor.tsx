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

import { Checkbox, Radio } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import classnames from 'classnames';
import * as React from 'react';
import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { FieldType, ICellValue, ISelectFieldOption, Strings, t } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { IBaseEditorProps, IEditor } from 'pc/components/editors/interface';
import { OptionTag } from 'pc/components/list';
import { useResponsive } from 'pc/hooks';
import styles from './style.module.less';

interface IOptionFieldEditorProps extends IBaseEditorProps {
  style: React.CSSProperties;
  cellValue: ICellValue;
}

const OptionFieldEditorBase: React.ForwardRefRenderFunction<IEditor, IOptionFieldEditorProps> = (props, ref) => {
  const { field, disabled, onSave, onChange: propsOnChange, cellValue } = props;
  const isSingleSelect = field.type === FieldType.SingleSelect;
  const defaultValue = isSingleSelect ? '' : [];
  const [value, setValue] = useState<CheckboxValueType[] | undefined>(cellValue as CheckboxValueType[]);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const optionList = field.property.options;

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => {},
      onEndEdit: () => {},
      onStartEdit: () => {},
      setValue: (value?: string | string[] | null) => {
        setValue((value || defaultValue) as CheckboxValueType[]);
      },
      saveValue: () => {
        saveValue();
      },
    }),
  );

  const onChange = (e: any) => {
    if (disabled) {
      return;
    }
    const tempVal = isSingleSelect ? e.target.value : e;
    propsOnChange && propsOnChange(tempVal);
    setValue(tempVal);
    onSave && onSave(tempVal);
  };

  const clearSingleSelect = () => {
    propsOnChange && propsOnChange(null);
    setValue(undefined);
    onSave && onSave(null);
  };

  const saveValue = () => {
    onSave && onSave(value);
  };

  const commonStyle = {
    height: isMobile ? 'auto' : 24,
    marginLeft: 8,
    padding: '0 16px',
    borderRadius: 22,
    maxWidth: isMobile ? 'calc(100vw - 80px)' : 560,
  };

  const GroupComponent = isSingleSelect ? Radio.Group : Checkbox.Group;
  const ChildComponent = isSingleSelect ? Radio : Checkbox;

  return (
    <div
      className={classnames(styles.optionEditor, {
        [styles.disabled]: disabled,
        [styles.empty]: !optionList.length,
      })}
    >
      {optionList.length ? (
        <GroupComponent value={isSingleSelect && value?.length === 1 ? (value[0] as any) : value} onChange={onChange}>
          {optionList.map((option: ISelectFieldOption) => {
            return (
              <div className={styles.optionItemWrapper} key={option.id}>
                <ChildComponent
                  value={option.id}
                  onClick={(e: any) => {
                    if (disabled) {
                      return;
                    }
                    // Form radio support for inverse selection
                    if (isSingleSelect && e.target.value === value) {
                      clearSingleSelect();
                    }
                  }}
                >
                  <OptionTag option={option} style={commonStyle} className="optionFieldTag" ellipsis={!isMobile} />
                </ChildComponent>
              </div>
            );
          })}
        </GroupComponent>
      ) : (
        t(Strings.form_not_configure_options)
      )}
    </div>
  );
};

export const OptionFieldEditor = memo(forwardRef(OptionFieldEditorBase));
