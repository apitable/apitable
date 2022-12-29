import * as React from 'react';
import styles from './style.module.less';
import FolderIcon from 'static/icon/datasheet/datasheet_icon_folder_normal.svg';
import ArrowIcon from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import { useThemeColors } from '@apitable/components';

// richContent: Search results are returned as rich text tags for display highlighting
export const Folder: React.FC<{ id: string, onClick?(id: string), richContent?: boolean }> = props => {
  const { children, id, richContent, onClick } = props;
  const colors = useThemeColors();
  return (
    <div className={styles.nodeContainerWrapper}>
      <div className={styles.nodeContainer} onClick={() => onClick && onClick(id)}>
        <FolderIcon className={styles.leftIcon} fill={colors.fourthLevelText} />
        {richContent ?
          <span className={styles.text} dangerouslySetInnerHTML={{ __html: children as string }} /> :
          <span className={styles.text}>{children}</span>
        }
        <ArrowIcon className={styles.rightIcon} fill={colors.thirdLevelText} />
      </div>
    </div>
  );
};