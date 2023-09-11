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

import { useState } from 'react';
import * as React from 'react';
import { TextInput, Button, Switch } from '@apitable/components';
import { FieldType, getNewId, getUniqName, IDPrefix, MemberField, Strings, t } from '@apitable/core';
import { useCheckRepeatName } from '../../hooks/use_check_repeat_name';
import { IKanbanOptionProps } from '../kanban_option/kanban_option';
import styles from '../styles.module.less';

type IKanbanMemberProps = IKanbanOptionProps;

export const KanbanMember: React.FC<React.PropsWithChildren<IKanbanMemberProps>> = (props) => {
  const { command, onClose, fieldMap } = props;
  const [notify, setNotify] = useState(true);
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
      type: FieldType.Member,
      property: { ...MemberField.defaultProperty(), isMulti: false },
    };
    command(newField);
    onClose && onClose();
  }

  return (
    <>
      <h3 className={styles.settingTitle}>{t(Strings.kanban_new_member_field)}</h3>
      <TextInput defaultValue={defaultName} onChange={onChange} block />
      {errTip && <p className={styles.error}>{errTip}</p>}
      <div
        className={styles.notifySwitch}
        onClick={() => {
          setNotify(!notify);
        }}
      >
        <Switch
          size="small"
          checked={notify}
          style={{
            marginRight: 8,
          }}
        />
        {t(Strings.field_member_property_notify)}
      </div>
      <Button color="primary" onClick={submit} disabled={Boolean(errTip)} className={styles.submitButton} size={'small'}>
        {t(Strings.submit)}
      </Button>
    </>
  );
};
