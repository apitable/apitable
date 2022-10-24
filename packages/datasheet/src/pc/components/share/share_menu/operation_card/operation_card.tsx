import { Button, IconButton } from '@vikadata/components';
import { AutoTestID } from '@apitable/core';
import classnames from 'classnames';
import Image from 'next/image';
import { FC, useState } from 'react';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import styles from './style.module.less';

export interface IOperationCardProps {
  img: React.ReactNode;
  tipText: string;
  btnText: string;
  onClick: () => void;
}

export const OperationCard: FC<IOperationCardProps> = ({ img, onClick, tipText, btnText }) => {
  // 是否是紧凑模式
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className={classnames(isCompact && styles.toggleAnimation)}>
      <div className={classnames(styles.operationCard, styles.loose)}>
        <IconButton icon={() => <CloseIcon fill="currentColor" />} className={styles.closeBtn} onClick={() => setIsCompact(true)} />
        <div className={styles.paint}>
          <Image src={img as string} alt="" width="74" height="74" />
        </div>
        <p className={styles.saveDesc}>{tipText}</p>
        <Button
          id={AutoTestID.SHARE_MENU_CARD_BTN}
          color={'primary'}
          className={styles.button}
          onClick={onClick}
          block
        >
          {btnText}
        </Button>
      </div>
      <div className={classnames(styles.operationCard, styles.compact)}>
        <Button
          className={styles.button}
          onClick={onClick}
          variant="jelly"
          block
        >
          {btnText}
        </Button>
      </div>
    </div>
  );
};
