import { FC } from 'react';
import { ITextInputProps, TextInput } from '@vikadata/components';
import { EyeCloseOutlined, EyeNormalOutlined, LockFilled } from '@vikadata/icons';
import { useBoolean } from 'ahooks';
import styles from './style.module.less';

export const PasswordInput: FC<ITextInputProps> = props => {
  const [isVisible, { toggle }] = useBoolean(false);

  return (
    <TextInput
      type={isVisible ? 'text' : 'password'}
      prefix={<LockFilled />}
      suffix={
        <div
          className={styles.suffixIcon}
          onClick={() => toggle()}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          {isVisible ? <EyeNormalOutlined /> : <EyeCloseOutlined />}
        </div>
      }
      {...props}
    />
  );
};
