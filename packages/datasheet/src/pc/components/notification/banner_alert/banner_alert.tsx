/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import classNames from 'classnames';
import Image from 'next/image';
import { createRoot } from 'react-dom/client';
import { Button, LinkButton, Typography, useThemeColors } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { Emoji } from 'pc/components/common/emoji';
import Vikaby from 'static/icon/workbench/vikaby-good.png';
import styles from './style.module.less';

export interface IAlertProps {
  content: string;
  closable?: boolean;
  onClose?: any;
  btnText?: string; // Refresh page button text, set to empty string or don't pass this parameter then don't show this button
  onBtnClick?: any;
  showVikaby?: boolean; // Whether to show Vikaby's avatar, default is false
  upgrade?: boolean;
}

interface IShowBannerAlert extends IAlertProps {
  destroyPrev?: boolean;
  duration?: number;
  id?: string;
}

export const AlertUi = (props: IAlertProps) => {
  const colors = useThemeColors();
  const { showVikaby = true, content, btnText, onBtnClick, closable, onClose, upgrade } = props;
  return (
    <div className={classNames(styles.alert, { [styles.hasUpgradeBtn!]: upgrade })}>
      {showVikaby && (
        <span className={styles.img}>
          <Image src={Vikaby} alt="" />
        </span>
      )}
      <div className={styles.body}>
        <Typography variant="h7" color={colors.primaryColor}>
          {content}
        </Typography>
      </div>
      {btnText && (
        <LinkButton className={styles.reloadBtn} color={colors.primaryColor} onClick={onBtnClick}>
          {btnText}
        </LinkButton>
      )}
      {upgrade && (
        <Button color="primary" size={'middle'} className={styles.upgradeBtn} onClick={onBtnClick}>
          <span style={{ position: 'relative', top: 3 }}>
            <Emoji emoji={'star2'} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />
          </span>
          <span style={{ position: 'relative', left: 3 }}>{t(Strings.upgrade)}</span>
        </Button>
      )}
      {closable && (
        <span onClick={onClose} className={styles.close}>
          <CloseOutlined />
        </span>
      )}
    </div>
  );
};

export const showBannerAlert = (config: IShowBannerAlert) => {
  const { duration = 0, destroyPrev = true, onClose, ...rest } = config;
  const BANNER_ALERT_ID = config.id || 'BANNER_ALERT';

  if (destroyPrev) {
    // unmount previous alert ui
    const prev = document.getElementById(BANNER_ALERT_ID);
    prev && prev.parentNode && prev.parentNode.removeChild(prev);
  } else {
    if (document.getElementById(BANNER_ALERT_ID)) {
      return;
    }
  }
  const div = document.createElement('div');
  div.setAttribute('class', styles.funcAlert!);
  div.setAttribute('id', BANNER_ALERT_ID);
  document.body.appendChild(div);
  const root = createRoot(div);

  function destroy() {
    root.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function render() {
    setTimeout(() => {
      root.render(
        <AlertUi
          onClose={() => {
            onClose && onClose();
            destroy();
          }}
          {...rest}
        />,
      );
    });
  }

  const start = () => {
    render();
    if (duration !== 0) {
      setTimeout(() => {
        destroy();
      }, duration * 1000);
    }
  };
  start();
};
