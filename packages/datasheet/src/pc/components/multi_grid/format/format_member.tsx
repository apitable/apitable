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

import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import { Switch } from '@apitable/components';
import { IField, IMemberField, Strings, t } from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import settingStyles from '../field_setting/styles.module.less';
import styles from './styles.module.less';

interface IFormatmember {
  currentField: IMemberField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormatMember: React.FC<React.PropsWithChildren<IFormatmember>> = (props: IFormatmember) => {
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
        content: t(Strings.field_member_property_subscription_open_tip),
      });
      updateSubscription();
    } else {
      updateSubscription();
    }
  };

  const { isMulti, shouldSendMsg, subscription } = props.currentField.property;

  const embedId = useAppSelector((state) => state.pageParams.embedId);

  const { RECORD_WATCHING_VISIBLE } = getEnvVariables();

  return (
    <div className={styles.section}>
      <section className={settingStyles.section}>
        <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
          {t(Strings.field_member_property_multi)}
          <Switch size="small" checked={isMulti} onChange={handleIsMultiChange} />
        </div>
      </section>
      <section className={settingStyles.section}>
        {!embedId && (
          <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
            {t(Strings.field_member_property_notify)}
            <Switch size="small" checked={shouldSendMsg} onChange={handleShouldSendMsgChange} />
          </div>
        )}
      </section>
      {RECORD_WATCHING_VISIBLE && (
        <section className={settingStyles.section}>
          {!embedId && (
            <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
              <div className={styles.subscription}>
                {t(Strings.field_member_property_subscription)}
                <a
                  href={t(Strings.field_help_member_property_subscription)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', cursor: 'pointer' }}
                >
                  <span className={styles.requiredTip}>
                    <QuestionCircleOutlined color="currentColor" />
                  </span>
                </a>
              </div>
              <Switch size="small" checked={subscription} onChange={handleSubscription} />
            </div>
          )}
        </section>
      )}
    </div>
  );
};
