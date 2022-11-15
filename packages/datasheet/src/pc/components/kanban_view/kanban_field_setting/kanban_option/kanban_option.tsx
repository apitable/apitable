import {
  Field, FieldType, getNewId, getUniqName, IDPrefix, IField, IFieldMap, ISingleSelectField, SingleSelectField, Strings, t
} from '@apitable/core';
import { TextInput, Button } from '@apitable/components';
import * as React from 'react';
import { useCheckRepeatName } from '../../hooks/use_check_repeat_name';
import styles from '../styles.module.less';

export interface IKanbanOptionProps {
  command(newField: Pick<IField, 'id' | 'name' | 'type' | 'property'>): void;

  onClose: (() => void) | undefined;
  fieldMap: IFieldMap;
}

export const KanbanOption: React.FC<IKanbanOptionProps> = props => {
  const { command, onClose, fieldMap } = props;
  const defaultName = getUniqName(t(Strings.vika_column), Object.keys(fieldMap).map(id => fieldMap[id].name));
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
    ((t(Strings.kanban_new_option_group))
      .split(','))
      .map(item => Field.bindModel(newField as ISingleSelectField).addOption(item));
    command(newField);
    onClose && onClose();
  }

  return <>
    <h3 className={styles.settingTitle}>
      {t(Strings.kanban_new_option_field)}
    </h3>
    <TextInput defaultValue={defaultName} onChange={onChange} block />
    {errTip && <p className={styles.error}>{errTip}</p>}
    <Button
      color="primary"
      onClick={submit}
      disabled={Boolean(errTip)}
      className={styles.submitButton}
      size="small"
    >
      {t(Strings.submit)}
    </Button>
  </>;
};