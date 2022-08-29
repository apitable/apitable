import { TextInput } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import classnames from 'classnames';
import * as React from 'react';
import styles from './styles.module.less';

export interface IFormItem {
  label: string;
  key: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  suffix?: JSX.Element;
}

export interface IFormItemProps {
  formItem: IFormItem;
  formData: {[key: string]: any};
  error?: boolean | undefined;
  onChange?: (e, formItem: IFormItem) => void;
}

export const FormItem: React.FC<IFormItemProps> = (props) => {

  const {
    formItem,
    formData,
    error,
    onChange
  } = props;
  const defaultPlaceholder= t(Strings.placeholder_enter_here);

  return (
    <div className={styles.formItem}>
      <div className={classnames(
        styles.formItemLabel,
        formItem?.required && styles.formItemLabelRequired
      )}>{formItem.label}</div>
      <div className={classnames(
        styles.formItemValue,
        formItem?.suffix && styles.formItemValueSuffix
      )}>
        <TextInput
          className={classnames(
            formItem.readonly && styles.formItemInputReadOnly
          )}
          value={formData[formItem.key]}
          placeholder={formItem.placeholder || defaultPlaceholder}
          readOnly={formItem.readonly}
          onChange={(e) => onChange && onChange(e, formItem)}
          error={error}
          block
        />
        {formItem?.suffix && <div className={styles.formItemSuffix}>{formItem.suffix}</div>}
      </div>
      <div className={styles.formItemError}>{error}</div>
    </div>
  );
};
