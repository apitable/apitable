import { IField, ISingleTextField, t, Strings } from '@vikadata/core';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import styles from './styles.module.less';
import { Input } from 'antd';
import classNames from 'classnames';

interface IFormatSingleText {
  currentField: ISingleTextField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormatSingleText: React.FC<IFormatSingleText> = props => {
  const { setCurrentField, currentField } = props;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentField({
      ...currentField,
      property: {
        defaultValue: e.target.value,
      },
    });
  }

  return (
    <div className={styles.section}>
      <h2 className={classNames(styles.sectionTitle, styles.singleText)}>
        {t(Strings.default) + ' '}
        <span>
          ({t(Strings.field_configuration_optional)}）
        </span>
      </h2>
      <Input
        value={currentField.property.defaultValue}
        onChange={onChange}
        placeholder={t(Strings.placeholder_add_record_default_complete)}
      />
    </div>
  );
};
