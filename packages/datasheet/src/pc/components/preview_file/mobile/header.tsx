import { useThemeColors } from '@vikadata/components';
import * as React from 'react';
import { MoreTool } from '../tool_bar/mobile/more_tool';
import IconClose from 'static/icon/common/common_icon_close_small.svg';
import styles from './style.module.less';

interface IHeader {
  fileName: string;
  readonly: boolean;
  downloadSrc: string;
  onDelete(): void;
  onClose(): void;
  disabledDownload?: boolean
}

export const Header: React.FC<IHeader> = props => {
  const {
    fileName,
    readonly,
    downloadSrc,
    onDelete,
    onClose,
    disabledDownload
  } = props;
  const colors = useThemeColors();
  return (
    <header className={styles.previewHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.toolClose} onClick={onClose}>
          <IconClose fill={colors.defaultBg} width={16} height={16} />
        </div>
      </div>
      <span className={styles.fileName}>{fileName}</span>
      <div className={styles.headerRight}>
        <MoreTool
          readonly={readonly}
          onDelete={onDelete}
          downloadSrc={downloadSrc}
          disabledDownload={disabledDownload}
        />
      </div>
    </header>
  );
};
