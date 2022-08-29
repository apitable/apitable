import { appendRow, Direction } from 'pc/common/shortcut_key/shortcut_actions/append_row';
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
      // 这里要防止被 multi_grid 监听到引起状态的不断更改
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
