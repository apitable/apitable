import { RecordMoveType, Selectors } from '@apitable/core';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export const useIsRecordWillMove = (recordId: string) => {
  const { activeRecordId, recordMoveType } = useSelector(state => {
    return {
      activeRecordId: Selectors.getActiveRecordId(state),
      recordMoveType: Selectors.getRecordMoveType(state),
    };
  }, shallowEqual);

  const [willMove, setWillMove] = useState(false);
  useEffect(() => {
    const _willMove = recordId === activeRecordId && recordMoveType !== RecordMoveType.NotMove;
    setWillMove(_willMove);
  }, [recordId, activeRecordId, recordMoveType]);
  return willMove;
};