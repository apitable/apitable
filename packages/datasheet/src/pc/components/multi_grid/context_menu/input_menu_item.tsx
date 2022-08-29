import * as React from 'react';
import { ChangeEvent, KeyboardEvent, ForwardRefRenderFunction, useImperativeHandle, useState, forwardRef, CSSProperties } from 'react';
import { TextInput } from '@vikadata/components';
import { TComponent } from 'pc/components/common/t_component';
import classnames from 'classnames';
import styles from './styles.module.less';

interface IInputMenuItemProps {
  text: string;
  textKey: string;
  className?: string;
  style?: CSSProperties;
  initValue?: string | number;
  onChange?: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface IInputEditor {
  getValue: () => string;
  setValue: (value: string) => void;
}

const InputMenuItemBase: ForwardRefRenderFunction<IInputEditor, IInputMenuItemProps> = (props, ref) => {
  const { 
    text,
    textKey,
    initValue,
    style, 
    className, 
    onChange: _onChange,
    onKeyDown,
  } = props;
  const [value, setValue] = useState(initValue == null ? '' : String(initValue));

  useImperativeHandle(ref, (): IInputEditor => ({
    getValue() {
      return value;
    },
    setValue(value: string) {
      setValue(value);
    }
  }));

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const curValue = e.target.value;
    return _onChange ? _onChange(curValue) : setValue(curValue);
  };

  return (
    <div className={styles.menuInputItem}>
      <TComponent
        tkey={text}
        params={{
          [textKey]: (
            <TextInput 
              value={value}
              size={'small'}
              style={{ 
                textAlign: 'center',
                ...style
              }}
              className={classnames(styles.menuInput, className)}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          )
        }}
      />
    </div>
  );
};

export const InputMenuItem = forwardRef(InputMenuItemBase);