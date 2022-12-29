import { FC } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import styles from './style.module.less';
import classNames from 'classnames';

export interface ITextInputProps extends InputProps {
  err?: string;
}

export const TextInput: FC<ITextInputProps> = props => {
  const { err, width = 330, height = 50, ...rest } = props;
  return (
    <div
      className={classNames({
        [styles.textInput]: true,
      })}
    >
      <Input
        {...rest}
        className={err ? 'err' : ''}
        style={{ height, width }}
      />
      <div className={styles.errmsg}>
        {err}
      </div>
    </div>
  );
};
