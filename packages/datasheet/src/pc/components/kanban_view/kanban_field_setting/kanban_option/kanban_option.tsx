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
import { TextInput, Button } from '@apitable/components';
import {
  Field,
  FieldType,
  getNewId,
  getUniqName,
  IDPrefix,
  IField,
  IFieldMap,
  ISingleSelectField,
  SingleSelectField,
  Strings,
  t,
} from '@apitable/core';
import { useCheckRepeatName } from '../../hooks/use_check_repeat_name';
import styles from '../styles.module.less';

export interface IKanbanOptionProps {
  command(newField: Pick<IField, 'id' | 'name' | 'type' | 'property'>): void;

  onClose: (() => void) | undefined;
  fieldMap: IFieldMap;
}

export const KanbanOption: React.FC<React.PropsWithChildren<IKanbanOptionProps>> = (props) => {
  const { command, onClose, fieldMap } = props;
  const defaultName = getUniqName(
    t(Strings.view_filed),
    Object.keys(fieldMap).map((id) => fieldMap[id].name),
  );
  const { errTip, onChange, value } = useCheckRepeatName();

  function submit() {
    const inputName = value;
    const name = !errTip && inputName.length ? inputName : defaultName;
    const newField = {
      id: getNewId(IDPrefix.Field),
      name,
      type: FieldType.SingleSelect,
      property: SingleSelectField.defaultProperty(),
    };
    t(Strings.kanban_new_option_group)
      .split(',')
      .map((item) => Field.bindModel(newField as ISingleSelectField).addOption(item));
    command(newField);
    onClose && onClose();
  }

  return (
    <>
      <h3 className={styles.settingTitle}>{t(Strings.kanban_new_option_field)}</h3>
      <TextInput defaultValue={defaultName} onChange={onChange} block />
      {errTip && <p className={styles.error}>{errTip}</p>}
      <Button color="primary" onClick={submit} disabled={Boolean(errTip)} className={styles.submitButton} size="small">
        {t(Strings.submit)}
      </Button>
    </>
  );
};
