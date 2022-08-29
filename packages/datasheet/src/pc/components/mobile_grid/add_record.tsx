import { appendRow } from 'pc/common/shortcut_key/shortcut_actions/append_row';
import * as React from 'react';
import styles from './styles.module.less';
import AddIcon from 'static/icon/common/common_icon_add_content.svg';
import { useThemeColors } from '@vikadata/components';
import { ExecuteResult } from '@vikadata/core';
import { expandRecordIdNavigate } from '../expand_record';

interface IAddRecordProps {
  recordId?: string;
  size?: 'large' | 'default';
}

export const AddRecord: React.FC<IAddRecordProps> = props => {
  const colors = useThemeColors();
  const {
    recordId,
    size = 'default',
  } = props;

  const onClick = () => {
    const result = appendRow({ recordId });
    if (result.result === ExecuteResult.Success) {
      const _recordId = result.data && result.data[0];
      expandRecordIdNavigate(_recordId);
    }
  };

  const outerSize = size === 'large' ? 60 : 48;
  const innerSize = size === 'large' ? 24 : 16;

  return (
    <div
      className={styles.addRecordContainer}
      onClick={onClick}
      style={{
        width: outerSize,
        height: outerSize,
      }}
    >
      <div className={styles.btnWrapper}>
        <AddIcon width={innerSize} height={innerSize} fill={colors.black[50]} />
      </div>
    </div>
  );
};