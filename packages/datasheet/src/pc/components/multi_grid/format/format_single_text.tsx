/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Input } from 'antd';
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import { Switch } from '@apitable/components';
import { IField, ISingleTextField, t, Strings } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import settingStyles from '../field_setting/styles.module.less';
import styles from './styles.module.less';

interface IFormatSingleText {
  currentField: ISingleTextField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  // Only self-hosted deployments expose the primary field's "unique value" switch.
  isPrimaryField?: boolean;
}

export const FormatSingleText: React.FC<React.PropsWithChildren<IFormatSingleText>> = (props) => {
  const { setCurrentField, currentField, isPrimaryField } = props;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        defaultValue: e.target.value,
      },
    });
  }

  function onUniqueChange(checked: boolean) {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        unique: checked,
      },
    });
  }

  return (
    <>
      <div className={styles.section}>
        <h2 className={classNames(styles.sectionTitle, styles.singleText)}>
          {t(Strings.default) + ' '}
          <span>({t(Strings.field_configuration_optional)}）</span>
        </h2>
        <Input value={currentField.property.defaultValue} onChange={onChange} placeholder={t(Strings.placeholder_add_record_default_complete)} />
      </div>
      {isPrimaryField && getEnvVariables().IS_SELFHOST && (
        <div className={styles.section} style={{ marginBottom: 10, marginTop: 17 }}>
          <section className={settingStyles.section} style={{ marginBottom: 0 }}>
            <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)} style={{ display: 'flex', marginBottom: 0 }}>
              <Switch
                size="small"
                checked={Boolean(currentField.property?.unique)}
                onChange={onUniqueChange}
                style={{ marginRight: 8, marginTop: 2 }}
              />
              值不允许重复
            </div>
          </section>
        </div>
      )}
    </>
  );
};
