import { Field, FieldType, IField, IMemberField, ISelectField, Selectors, SingleSelectField, Strings, t } from '@apitable/core';
import produce from 'immer';
import { size } from 'lodash';
import { useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { MemberFieldHead, OptionFieldHead } from '../group_header';
import { useCommand } from '../hooks/use_command';
import styles from '../styles.module.less';
import { AddOutlined } from '@apitable/icons';
import { useThemeColors } from '@apitable/components';
import { useClickAway } from 'ahooks';

interface IAddGroup {
  kanbanFieldId: string;
}

export const AddGroup: React.FC<IAddGroup> = props => {
  const colors = useThemeColors();
  const { kanbanFieldId } = props;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const recordMap = useSelector(state => {
    const sanpshot = Selectors.getSnapshot(state)!;
    return sanpshot.recordMap;
  });
  const ref = React.useRef<HTMLDivElement>(null);
  const kanbanField = fieldMap[kanbanFieldId];
  const [editing, setEditing] = useState(false);
  const command = useCommand();

  function setFieldAttr(newField: IField) {
    command.setFieldAttr(kanbanFieldId, newField);
    setEditing(false);
  }

  function addRecord(unitIds: string[]) {
    command.addRecords(size(recordMap), 1, [{ [kanbanFieldId]: unitIds }]);
    setEditing(false);
  }

  function onClick() {
    if (editing) {
      return;
    }
    setEditing(true);
  }

  const commonProps = {
    editing,
    setEditing,
    isAdd: true,
  };

  // Implemented at the top of the member column so that the member column can go beyond displaying ellipses and 
  // adapts to the width of the statistics on the right
  useClickAway(() => {
    kanbanField.type !== FieldType.SingleSelect && setEditing(false);
  }, ref, 'mousedown');

  function HeadOption() {
    const option = (Field.bindModel(kanbanField) as SingleSelectField).createNewOption('');
    const newField = produce(kanbanField as ISelectField, draft => {
      draft.property.options.push(option);
      return draft;
    });
    return <OptionFieldHead cellValue={option.id} field={newField} onCommand={setFieldAttr} {...commonProps} />;
  }

  return <div ref={ref} className={styles.addNewBoard} onClick={onClick}>
    {
      !editing ? <div className={styles.addTip}>
        <AddOutlined color={colors.thirdLevelText} />
        {t(Strings.kanban_add_new_group)}
      </div> :
        kanbanField.type === FieldType.SingleSelect ?
          <HeadOption /> :
          <MemberFieldHead
            cellValue={['']}
            field={kanbanField as any as IMemberField}
            onCommand={addRecord} {...commonProps}
            isNewBoard
          />
    }
  </div>;
};
