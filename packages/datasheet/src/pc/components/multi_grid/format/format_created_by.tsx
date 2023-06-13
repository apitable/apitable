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

import { IField, ICreatedByField, Strings, t } from '@apitable/core';
import { Switch } from 'antd';
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import settingStyles from '../field_setting/styles.module.less';
import styles from './styles.module.less';
import { useSelector } from 'react-redux';
import { Message } from '../../common';
import { getEnvVariables } from 'pc/utils/env';

interface IFormatCreatedBy {
  currentField: ICreatedByField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormatCreatedBy: React.FC<React.PropsWithChildren<IFormatCreatedBy>> = (props: IFormatCreatedBy) => {

  const handleSubscription = (checked: boolean) => {
    const updateSubscription = () => {
      props.setCurrentField({
        ...props.currentField,
        property: {
          ...props.currentField.property,
          subscription: checked,
        },
      });
    };

    if (checked) {
      Message.info({
        content: t(Strings.field_member_property_subscription_open_tip)
      });
      updateSubscription();
    } else {
      updateSubscription();
    }
  };

  const { subscription } = props.currentField.property;

  const embedId = useSelector(state => state.pageParams.embedId);

  const { RECORD_WATCHING_VISIBLE } = getEnvVariables();

  if (!RECORD_WATCHING_VISIBLE) {
    return null;
  }

  return <div className={styles.section}>
    <section className={settingStyles.section}>
      {!embedId && <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
        {t(Strings.field_member_property_subscription)}
        <Switch
          size="small"
          checked={subscription}
          onChange={handleSubscription}
        />
      </div>}
    </section>
  </div>;
};
