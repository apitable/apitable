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
import { colorVars } from '@apitable/components';
import { Field, IField } from '@apitable/core';
import { WarnCircleFilled } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import styles from '../styles.module.less';

export function renderComputeFieldError(field: IField, errText: string, isMobile?: boolean, warnText?: string) {
  if (!field) {
    return;
  }
  const isError = Field.bindModel(field).hasError;
  if (isError || warnText) {
    return (
      <Tooltip title={isError ? errText : warnText} placement={isMobile ? 'topLeft' : 'top'} overlayClassName={styles.errorTip}>
        <WarnCircleFilled color={colorVars.warningColor} size={15} className={styles.warningIcon} />
      </Tooltip>
    );
  }
  return;
}

export function compatible(text: string | object) {
  if (typeof text !== 'string') {
    return '';
  }
  return text.trim();
}
