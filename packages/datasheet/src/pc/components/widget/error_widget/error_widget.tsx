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

import * as React from 'react';
import { LinkButton } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { WarnCircleFilled } from '@apitable/icons';
import styles from './styles.module.less';

interface IErrorWidget {
  title?: string;
  content: string | React.ReactNode;
  actionText?: string;
  action?: () => void;
}

export const ErrorWidget = ({ title = t(Strings.widget_load_error_title), content, actionText, action }: IErrorWidget) => (
  <div className={styles.errorWidgetWrap}>
    <div className={styles.title}>
      <WarnCircleFilled size={16} />
      <span>{title}</span>
    </div>
    <div className={styles.content}>{content}</div>
    {action && (
      <LinkButton className={styles.actionBtn} onClick={() => action()}>
        <span className={styles.linkText}>{actionText}</span>
      </LinkButton>
    )}
  </div>
);
