import { Dispatch, SetStateAction } from 'react';
import { Switch } from 'antd';
import classNames from 'classnames';
import { IURLField, IField, Strings, t } from '@vikadata/core';

import styles from './styles.module.less';
import settingStyles from '../field_setting/styles.module.less';

interface IFormURLProps {
  currentField: IURLField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormatURL = ({
  currentField,
  setCurrentField,
}: IFormURLProps): JSX.Element => {
  const onRecogURLChange = (newFlag: boolean) => {
    setCurrentField({
      ...currentField,
      property: {
        isRecogURLFlag: newFlag
      }
    });
  };

  return (
    <div className={styles.section} style={{ marginBottom: 10, marginTop: 17 }}>
      <section className={settingStyles.section} style={{ marginBottom: 0 }}>
        <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)} style={{ display: 'flex', marginBottom: 0 }}>
          <Switch
            size="small"
            checked={currentField.property?.isRecogURLFlag}
            onChange={onRecogURLChange}
            style={{ marginRight: 8 }}
          />
          {t(Strings.url_preview_setting)}
        </div>
      </section>
    </div>
  );
};
