import { IField, IMemberField, Strings, t } from '@apitable/core';
import { Switch } from 'antd';
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import settingStyles from '../field_setting/styles.module.less';
import styles from './styles.module.less';

interface IFormatmember {
  currentField: IMemberField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormatMember: React.FC<IFormatmember> = (props: IFormatmember) => {
  const handleIsMultiChange = (checked: boolean) => {
    props.setCurrentField({
      ...props.currentField,
      property: {
        ...props.currentField.property,
        isMulti: checked,
      },
    });
  };

  const handleShouldSendMsgChange = (checked: boolean) => {
    props.setCurrentField({
      ...props.currentField,
      property: {
        ...props.currentField.property,
        shouldSendMsg: checked,
      },
    });
  };

  const { isMulti, shouldSendMsg } = props.currentField.property;
  return (
    <div className={styles.section}>
      <section className={settingStyles.section}>
        <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
          {t(Strings.field_member_property_multi)}
          <Switch
            size="small"
            checked={isMulti}
            onChange={handleIsMultiChange}
          />
        </div>
      </section>
      <section className={settingStyles.section}>
        <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
          {t(Strings.field_member_property_notify)}
          <Switch
            size="small"
            checked={shouldSendMsg}
            onChange={handleShouldSendMsgChange}
          />
        </div>
      </section>
    </div>
  );
};
