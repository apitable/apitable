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

import parser from 'html-react-parser';
import Image from 'next/image';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Button, colorVars } from '@apitable/components';
import { confirm } from '@apitable/components/dist/components/modal/components/confirm';
import { Settings, Strings, t } from '@apitable/core';
import { Popup } from 'pc/components/common/mobile/popup';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { getScreen } from 'pc/hooks/use_responsive';
import SuccessImg from 'static/icon/space/space_img_success.png';
import UpgradeImg from 'static/icon/space/space_img_upgrade.png';
import styles from './style.module.less';

export enum IDingTalkModalType {
  Upgrade = 'Upgrade',
  Subscribe = 'Subscribe',
}

export const UpgradeInFeiShuContent: React.FC<React.PropsWithChildren<{ onClick: () => void; content: string }>> = (props) => {
  return (
    <div className={styles.upgradeInDingDingContent}>
      <span className={styles.img}>
        <Image src={UpgradeImg} width={240} height={180} alt="" />
      </span>

      {/* The upgrade cannot be done on mobile, please move to PC for upgrade */}
      <span className={styles.des}>{props.content}</span>
      <Button
        onClick={() => {
          props.onClick();
        }}
        color="primary"
        block
        size="large"
      >
        {t(Strings.confirm)}
      </Button>
    </div>
  );
};

export const UpgradeInWecomContent: React.FC<React.PropsWithChildren<{ onClick: () => void }>> = (props) => {
  return (
    <div className={styles.upgradeInDingDingContent}>
      <span className={styles.img}>
        <Image src={UpgradeImg} width={240} height={180} alt="" />
      </span>
      <span className={styles.des}>{parser(t(Strings.wecom_upgrade_guidance))}</span>
      <Button
        onClick={() => {
          props.onClick();
          window.location.href = Settings.integration_wecom_upgrade_guide_url.value;
        }}
        color="primary"
        block
        size="large"
      >
        {t(Strings.wecom_upgrade_go)}
      </Button>
    </div>
  );
};

export const UpgradeInDDContent: React.FC<React.PropsWithChildren<{ onClick: () => void }>> = (props) => {
  return (
    <div className={styles.upgradeInDingDingContent}>
      <span className={styles.img}>
        <Image src={UpgradeImg} width={240} height={180} alt="" />
      </span>
      <span className={styles.des}>{parser(t(Strings.dingtalk_activity_upgrade_guidance))}</span>
      <Button
        onClick={() => {
          navigationToUrl(Settings.integration_dingtalk_upgrade_url.value);
          props.onClick();
        }}
        color="primary"
        block
        size="large"
      >
        {t(Strings.go_to_here_now)}
      </Button>
    </div>
  );
};

export const SubscribeInDDContent: React.FC<React.PropsWithChildren<{ onClick: () => void }>> = (props) => {
  return (
    <div className={styles.upgradeInDingDingContent}>
      <span className={styles.img}>
        <Image src={SuccessImg} width={240} height={180} alt="" />
      </span>
      <span className={styles.des}>{parser(t(Strings.subscribe_success_desc))}</span>
      <Button onClick={() => props.onClick()} color="primary" block size="large">
        {t(Strings.okay)}
      </Button>
    </div>
  );
};

export const generateConfig = (modalType: IDingTalkModalType, onClick: () => void) => {
  switch (modalType) {
    case IDingTalkModalType.Upgrade:
      return {
        title: t(Strings.upgrade_guide),
        content: <UpgradeInDDContent onClick={onClick} />,
      };
    case IDingTalkModalType.Subscribe: {
      return {
        title: t(Strings.subscribe_success_title),
        content: <SubscribeInDDContent onClick={onClick} />,
      };
    }
  }
};

export const showModalInWecom = () => {
  const modal = confirm({
    footer: null,
    width: 392,
    closable: true,
    className: styles.upgradeInDDModal,
    title: t(Strings.upgrade_guide),
    content: <UpgradeInWecomContent onClick={() => modal.close()} />,
    zIndex: 1100,
  });
  return modal;
};

export const showModalInDingTalk = (modalType: IDingTalkModalType, props?: any) => {
  const config = generateConfig(modalType, () => modal.close());
  const modal = confirm({
    footer: null,
    width: 392,
    closable: true,
    className: styles.upgradeInDDModal,
    ...props,
    ...config,
  });
  return modal;
};

export const showModalInFeiShu = (props?: any) => {
  const title = t(Strings.upgrade_guide);
  const content = <UpgradeInFeiShuContent content={t(Strings.feishu_upgrade_guidance)} onClick={() => modal.close()} />;

  const modal = confirm({
    footer: null,
    width: 392,
    closable: true,
    className: styles.upgradeInDDModal,
    ...props,
    title,
    content,
    zIndex: 1100,
  });
  return modal;
};

export const showPopupInDingTalk = (modalType: IDingTalkModalType) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const config = generateConfig(modalType, () => destroy());
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
        <Popup title={config.title} height={500} style={{ backgroundColor: colorVars.defaultBg }} onClose={() => destroy()} open>
          {config.content}
        </Popup>,
      );
    });
  }

  render();
};

export const showTipInDingTalk = (modalType: IDingTalkModalType) => {
  const { clientWidth, clientHeight } = document.body;
  const { isMobile } = getScreen(clientWidth, clientHeight);

  isMobile ? showPopupInDingTalk(modalType) : showModalInDingTalk(modalType);
};
