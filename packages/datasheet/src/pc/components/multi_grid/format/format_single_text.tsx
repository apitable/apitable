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
import { IField, ISingleTextField, t, Strings } from '@apitable/core';
import styles from './styles.module.less';

interface IFormatSingleText {
  currentField: ISingleTextField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormatSingleText: React.FC<React.PropsWithChildren<IFormatSingleText>> = (props) => {
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
        <span>({t(Strings.field_configuration_optional)}）</span>
      </h2>
      <Input value={currentField.property.defaultValue} onChange={onChange} placeholder={t(Strings.placeholder_add_record_default_complete)} />
    </div>
  );
};
