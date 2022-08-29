import { Input, Tooltip } from 'antd';
import { InputProps } from 'antd/lib/input';
import classNames from 'classnames';
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from 'react';
import styles from './style.module.less';

export interface IRenameInputProps extends InputProps {
  // 显示错误信息
  errorMsg?: string;
  customStyle?: string;
}

export interface IRenameRef {
  focus (): void;
}

const RenameInputBase: ForwardRefRenderFunction<any, IRenameInputProps> = (props, ref) => {
  const inputRef = useRef<Input>(null);

  useImperativeHandle(ref, () => ({
    focus: () => { inputRef.current && inputRef.current.focus(); },
  }));

  const { errorMsg, customStyle, ...rest } = props;
  // 警告样式
  const returnInputClass = (errorMsg?: string, customStyle?: string) => {
    const hasIcon = Boolean(rest.prefix || rest.suffix);
    if (errorMsg) {
      return classNames(customStyle, {
        [styles.inputError]: hasIcon,
        error: !hasIcon,
      });
    }
    return classNames(customStyle);

  };
  return (
    <div className={styles.viewItemInput}>
      <Tooltip title={errorMsg} placement="top" visible={Boolean(errorMsg)} >
        <Input
          ref={inputRef}
          className={returnInputClass(errorMsg, customStyle)}
          {...rest}
        />
      </Tooltip>
    </div>
  );
};

export const RenameInput = forwardRef(RenameInputBase);
