import { Strings, t } from '@apitable/core';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { getShortcutKeyString } from 'pc/common/shortcut_key/keybinding_config';
import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { PageTurn, PageTurnMobile } from 'pc/components/expand_record/page_turn';
import { useUpdateEffect } from 'ahooks';
import EditorTitleContext from '../editor_title_context';

interface IRecordPageTurnProps {
  activeRecordId: string;
  datasheetId: string;
  recordIds: string[];
  switchRecord?: (index: number) => void;
  isMobile?: boolean;
}

export const RecordPageTurn: React.FC<IRecordPageTurnProps> = props => {
  const { activeRecordId, recordIds, switchRecord, isMobile } = props;
  const { updateFocusFieldId } = React.useContext(EditorTitleContext);
  const [expandRecordIndex, setExpandRecordIndex] = useState(-1);

  const curRecordIndex = useMemo(() => {
    return recordIds.findIndex(recordId => recordId === activeRecordId);
  }, [activeRecordId, recordIds]);

  const firstRecordId = recordIds[0];
  const lastRecordId = recordIds[recordIds.length - 1];

  useEffect(() => {
    ShortcutActionManager.bind(ShortcutActionName.PreviousRecord, preRecord);
    ShortcutActionManager.bind(ShortcutActionName.NextRecord, nextRecord);
    return () => {
      ShortcutActionManager.unbind(ShortcutActionName.PreviousRecord);
      ShortcutActionManager.unbind(ShortcutActionName.NextRecord);
    };
  });

  useUpdateEffect(() => {
    switchRecord && switchRecord(expandRecordIndex);
  }, [expandRecordIndex]);

  function getTip(type: 'pre' | 'next') {
    const isAllowClick = allowClick(type);
    if (type === 'pre' && isAllowClick) {
      return t(Strings.previous_record_tips, {
        previous_record: getShortcutKeyString(ShortcutActionName.PreviousRecord),
      });
    }
    if (type === 'pre' && !isAllowClick) {
      return t(Strings.no_previous_record_tips);
    }
    if (type === 'next' && isAllowClick) {
      return t(Strings.next_record_tips, {
        next_record: getShortcutKeyString(ShortcutActionName.NextRecord),
      });
    }
    if (type === 'next' && !isAllowClick) {
      return t(Strings.no_next_record_tips);
    }
    return '';
  }

  function allowClick(type: 'pre' | 'next') {
    if (lastRecordId === firstRecordId) { return false; }
    if (type === 'pre' && activeRecordId === firstRecordId) { return false; }
    if (type === 'next' && activeRecordId === lastRecordId) { return false; }
    return true;
  }

  function nextRecord() {
    if (!allowClick('next')) { return; }
    updateFocusFieldId(null);
    const newExpandRecordIndex = curRecordIndex + 1;
    setExpandRecordIndex(newExpandRecordIndex);
    if (newExpandRecordIndex === expandRecordIndex) {
      switchRecord && switchRecord(newExpandRecordIndex);
    }
  }

  function preRecord() {
    if (!allowClick('pre')) { return; }
    updateFocusFieldId(null);
    const newExpandRecordIndex = curRecordIndex - 1;
    setExpandRecordIndex(newExpandRecordIndex);
    if (newExpandRecordIndex === expandRecordIndex) {
      switchRecord && switchRecord(newExpandRecordIndex);
    }
  }

  if (isMobile) {
    return (
      <PageTurnMobile
        onClickPre={preRecord}
        onClickNext={nextRecord}
        disablePre={allowClick('pre')}
        disableNext={allowClick('next')}
      />
    );
  }

  return (
    <PageTurn
      preButtonTip={getTip('pre')}
      nextButtonTip={getTip('next')}
      onClickPre={preRecord}
      onClickNext={nextRecord}
      disablePre={allowClick('pre')}
      disableNext={allowClick('next')}
      isPlainButtons
    />
  );
};