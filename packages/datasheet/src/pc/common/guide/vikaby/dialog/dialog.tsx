import { Button } from '@vikadata/components';
import { ConfigConstant, Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import parser from 'html-react-parser';
import { ButtonPlus, Emoji } from 'pc/components/common';
import { goToUpgrade } from 'pc/components/subscribe_system';
import { isMobileApp } from 'pc/utils/env';
import { FC } from 'react';
import * as React from 'react';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import StarIcon from 'static/icon/datasheet/share/datasheet_icon_share_star.svg';
import styles from './style.module.less';

export interface IDialog {
  onClose?: ((event?: React.MouseEvent<HTMLElement, MouseEvent>) => void);
  title?: string;
  content?: string;
  btnText?: string;
  onBtnClick?: () => void;
  dialogClx?: string;
}

export const Dialog: FC<IDialog> = (props) => {
  const { onBtnClick, onClose, title, content, btnText, dialogClx } = props;

  return (
    <div className={classNames({
      [styles.billingNotify]: dialogClx === 'billingNotify',
    })}>
      <ButtonPlus.Icon icon={<CloseIcon />} size="x-small" className={styles.close} onClick={onClose} />
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{content && parser(content)}</div>
      {
        // 经济系统-用量与限制的升级按钮
        dialogClx === 'billingNotify' && !isMobileApp() &&
        <div className={styles.upgradeBtn}>
          <Button
            size="small"
            color="primary"
            prefixIcon={<Emoji emoji={'star2'} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />}
            onClick={goToUpgrade}
          >
            {t(Strings.upgrade_now)}
          </Button>
        </div>
      }
      {
        btnText &&
        <div className={styles.btnWrap}>
          <Button
            size="middle"
            color="warning"
            onClick={onBtnClick}
            prefixIcon={<StarIcon fill="#FFEB3A" />}
          >
            {btnText}
          </Button>
        </div>
      }
    </div>
  );
};
