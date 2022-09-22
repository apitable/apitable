import { Button, colorVars } from '@vikadata/components';
import { confirm } from '@vikadata/components/dist/components/modal/components/confirm';
import { Settings, Strings, t } from '@vikadata/core';
import parser from 'html-react-parser';
import Image from 'next/image';
import { Popup } from 'pc/components/common/mobile/popup';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { getScreen } from 'pc/hooks/use_responsive';
import * as React from 'react';
import ReactDOM from 'react-dom';
import SuccessImg from 'static/icon/space/space_img_success.png';
import UpgradeImg from 'static/icon/space/space_img_upgrade.png';
import styles from './style.module.less';

export enum IDingTalkModalType {
  Upgrade = 'Upgrade',
  Subscribe = 'Subscribe',
}

export const UpgradeInFeiShuContent: React.FC<{ onClick: () => void, content: string }> = (props) => {
  return (
    <div className={styles.upgradeInDingDingContent}>
      <span className={styles.img}>
        <Image src={UpgradeImg} width={240} height={180} />
      </span>

      {/* 移动端无法进行升级操作，请移步至 PC 端进行升级 */}
      <span className={styles.des}>{props.content}</span>
      <Button
        onClick={() => {
          props.onClick();
        }}
        color='primary'
        block
        size='large'
      >
        {t(Strings.confirm)}
      </Button>
    </div>
  );
};

export const UpgradeInWecomContent: React.FC<{ onClick: () => void }> = (props) => {
  return (
    <div className={styles.upgradeInDingDingContent}>
      <span className={styles.img}>
        <Image src={UpgradeImg} width={240} height={180} />
      </span>
      <span className={styles.des}>{parser(t(Strings.wecom_upgrade_guidance))}</span>
      <Button
        onClick={() => {
          props.onClick();
          window.location.href = Settings.wecom_upgrade_guide_url.value;
        }}
        color='primary'
        block
        size='large'
      >
        {t(Strings.wecom_upgrade_go)}
      </Button>
    </div>
  );
};

export const UpgradeInDDContent: React.FC<{ onClick: () => void }> = (props) => {
  return (
    <div className={styles.upgradeInDingDingContent}>
      <span className={styles.img}>
        <Image src={UpgradeImg} width={240} height={180} />
      </span>
      <span className={styles.des}>{parser(t(Strings.dingtalk_activity_upgrade_guidance))}</span>
      <Button
        onClick={() => {
          navigationToUrl(Settings.dingtalk_upgrade_url.value);
          props.onClick();
        }}
        color='primary'
        block
        size='large'
      >
        {t(Strings.go_to_here_now)}
      </Button>
    </div>
  );
};

export const SubscribeInDDContent: React.FC<{ onClick: () => void }> = (props) => {
  return (
    <div className={styles.upgradeInDingDingContent}>
      <span className={styles.img}>
        <Image src={SuccessImg} width={240} height={180} />
      </span>
      <span className={styles.des}>{parser(t(Strings.subscribe_success_desc))}</span>
      <Button
        onClick={() => props.onClick()}
        color='primary'
        block
        size='large'
      >
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
        content: <UpgradeInDDContent onClick={onClick} />
      };
    case IDingTalkModalType.Subscribe: {
      return {
        title: t(Strings.subscribe_success_title),
        content: <SubscribeInDDContent onClick={onClick} />
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
    content: <UpgradeInWecomContent onClick={() => modal.close()} />
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
    ...config
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
    content
  });
  return modal;
};

export const showPopupInDingTalk = (modalType: IDingTalkModalType) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const config = generateConfig(modalType, () => destroy());

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function render() {
    setTimeout(() => {
      ReactDOM.render(
        <Popup
          title={config.title}
          height={500}
          style={{ backgroundColor: colorVars.defaultBg }}
          onClose={() => destroy()}
          visible
        >
          {config.content}
        </Popup>,
        div
      );
    });
  }

  render();
};

export const showTipInDingTalk = (modalType: IDingTalkModalType) => {
  const { clientWidth, clientHeight } = document.body;
  const { isMobile } = getScreen(clientWidth, clientHeight);

  // 移动端使用 popup，pc端使用 modal
  isMobile ? showPopupInDingTalk(modalType) : showModalInDingTalk(modalType);
};
