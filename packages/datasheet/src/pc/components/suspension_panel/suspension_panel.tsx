import { FC } from 'react';
import { ReportWeb } from '../feedback';
import { DATASHEET_ID } from '@vikadata/core';
import styles from './style.module.less';

interface IProps {
  shareId?: string;
  datasheetId?: string;
}

export const SuspensionPanel: FC<IProps> = ({ shareId, datasheetId }) => {

  return (
    <div className={styles.suspensionPanel}>
      <div id={DATASHEET_ID.APPLICATION_JOIN_SPACE_BTN} />
      {shareId && datasheetId && <ReportWeb nodeId={datasheetId} />}
      <div id={DATASHEET_ID.ADD_RECORD_BTN} />
    </div>
  );
};
