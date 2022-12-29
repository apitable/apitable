import { FC } from 'react';
import { ITextInputProps, TextInput } from '@apitable/components';
import styles from './style.module.less';

export interface IWithTipTextInputProps extends ITextInputProps {
  helperText?: string;
}

export const WithTipTextInput: FC<IWithTipTextInputProps> = ({
  className,
  helperText,
  ...rest
}) => {

  return (
    <div className={className}>
      <TextInput {...rest} />
      {Boolean(helperText) && (
        <div className={styles.err}>
          {helperText}
        </div>
      )}
    </div>
  );
};
