import { FieldType, getNewId, getUniqName, IDPrefix, MemberField, Strings, t } from '@apitable/core';
import { Switch } from 'antd';
import { TextInput, Button } from '@apitable/components';
import { useState } from 'react';
import * as React from 'react';
import { useCheckRepeatName } from '../../hooks/use_check_repeat_name';
import { IKanbanOptionProps } from '../kanban_option/kanban_option';
import styles from '../styles.module.less';

type IKanbanMemberProps = IKanbanOptionProps;

export const KanbanMember: React.FC<IKanbanMemberProps> = props => {
  const { command, onClose, fieldMap } = props;
  const [notify, setNotify] = useState(true);
  const defaultName = getUniqName(t(Strings.vika_column), Object.keys(fieldMap).map(id => fieldMap[id].name));
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

  return <>
    <h3 className={styles.settingTitle}>
      {t(Strings.kanban_new_member_field)}
    </h3>
    <TextInput defaultValue={defaultName} onChange={onChange} block />
    {
      errTip && <p className={styles.error}>{errTip}</p>
    }
    <div className={styles.notifySwitch} onClick={() => { setNotify(!notify); }}>
      <Switch
        size="small"
        checked={notify}
        style={{
          marginRight: 8,
        }}
      />
      {t(Strings.field_member_property_notify)}
    </div>
    <Button
      color="primary"
      onClick={submit}
      disabled={Boolean(errTip)}
      className={styles.submitButton}
      size={'small'}
    >
      {t(Strings.submit)}
    </Button>
  </>;
};
