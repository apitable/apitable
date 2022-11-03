import { appendRow, Direction } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import styles from './styles.module.less';

interface IQuickAppendProps {
  left: number;
  top: number;
  length: number;
  hoverRecordId?: string;
}

export const QuickAppend: React.FC<IQuickAppendProps> = React.memo(props => {

  const {
    top,
    left,
    length,
    hoverRecordId,
  } = props;

  const addNewRecord = () => {
    appendRow({ recordId: hoverRecordId, direction: Direction.Up });
  };
  return (
    <div
      className={styles.quickAppend}
      style={{
        top,
        left,
      }}
      onClick={addNewRecord}
      // This is to prevent constant state changes caused by multi_grid listening
      onMouseOver={stopPropagation}
    >
      <div
        className={styles.quickAppendToolsWrap}
      >
        <div className={styles.iconAddWrap}>
          <IconAdd />
        </div>
        <div
          className={styles.quickAppendLine}
          style={{
            width: `calc(${length + 16}px - 100%)`,
          }}
        />
      </div>
    </div>
  );
});
