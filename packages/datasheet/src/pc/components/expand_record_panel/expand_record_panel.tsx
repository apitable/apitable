import { DATASHEET_ID } from '@vikadata/core';
import { FC } from 'react';
import style from './style.module.less';

export const ExpandRecordPanel: FC = () => {
  return (
    <div className={style.expandRecordPanel} id={DATASHEET_ID.SIDE_RECORD_PANEL} />
  );
};
