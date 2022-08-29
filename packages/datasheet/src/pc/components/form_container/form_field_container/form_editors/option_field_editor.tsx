import { memo, forwardRef, useImperativeHandle } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import classnames from 'classnames';
import { Radio, Checkbox } from 'antd';
import { OptionTag } from 'pc/components/list';
import { IBaseEditorProps, IEditor } from 'pc/components/editors/interface';
import { useState } from 'react';
import { FieldType, t, Strings, ICellValue } from '@vikadata/core';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display/component_display';

interface IOptionFieldEditorProps extends IBaseEditorProps {
  style: React.CSSProperties;
  cellValue: ICellValue
}

const OptionFieldEditorBase: React.ForwardRefRenderFunction<IEditor, IOptionFieldEditorProps> = (props, ref) => {
  const { field, disabled, onSave, onChange: propsOnChange, cellValue } = props;
  const isSingleSelect = field.type === FieldType.SingleSelect;
  const defaultValue = isSingleSelect ? '' : [];
  const [value, setValue] = useState(cellValue);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const optionList = field.property.options;

  useImperativeHandle(ref, (): IEditor => ({
    focus: () => {},
    onEndEdit: (cancel: boolean) => {},
    onStartEdit: (value?: string | string[] | null) => {},
    setValue: (value?: string | string[] | null) => {
      setValue(value || defaultValue);
    },
    saveValue: () => { saveValue(); },
  }));

  const onChange = (e) => {
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
    setValue(null);
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
      {
        optionList.length ?
          <GroupComponent 
            value={value} 
            onChange={onChange}
          >
            {
              optionList.map(option => {
                return (
                  <div 
                    className={styles.optionItemWrapper}
                    key={option.id}
                  >
                    <ChildComponent value={option.id} onClick={(e: any) => {
                      if (disabled) {
                        return;
                      }
                      // 表单单选支持反选
                      if (isSingleSelect && e.target.value === value) {
                        clearSingleSelect();
                      }
                    }}>
                      <OptionTag 
                        option={option} 
                        style={commonStyle} 
                        className="optionFieldTag" 
                        ellipsis={!isMobile}
                      />
                    </ChildComponent>
                  </div>
                );
              })
            }
          </GroupComponent> :
          t(Strings.form_not_configure_options)
      }
    </div>
  );
};

export const OptionFieldEditor = memo(forwardRef(OptionFieldEditorBase));