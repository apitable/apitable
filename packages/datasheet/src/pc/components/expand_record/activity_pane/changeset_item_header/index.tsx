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

import cls from 'classnames';
import * as React from 'react';
import { IField } from '@apitable/core';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { stopPropagation } from 'pc/utils';
import EditorTitleContext from '../../editor_title_context';
import styles from './style.module.less';

export interface IChangesetItemHeader {
  field?: IField;
  old?: boolean;
  inline?: boolean;
  block?: boolean;
}

const ChangesetItemHeader: React.FC<React.PropsWithChildren<IChangesetItemHeader>> = (props) => {
  const { field, old, inline = true, block } = props;
  const { updateFocusFieldId } = React.useContext(EditorTitleContext);
  if (!field) return null;
  return (
    <div
      className={cls(styles.changesetItemHeader, {
        [styles.old]: old,
        [styles.inline]: inline,
      })}
      onMouseDown={(e) => {
        if (!old) {
          updateFocusFieldId(field.id);
          stopPropagation(e);
        }
      }}
    >
      <div className={styles.iconType}>{getFieldTypeIcon(field.type, 'currentcolor')}</div>
      <div className={cls(styles.text, { [styles.block]: block })}>{field.name}</div>
    </div>
  );
};

export default ChangesetItemHeader;
