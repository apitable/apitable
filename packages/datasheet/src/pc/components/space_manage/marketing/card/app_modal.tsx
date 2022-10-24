import { Button, LinkButton, TextButton, Typography, useThemeColors } from '@vikadata/components';
import { Api, IReduxState, Settings, Strings, t } from '@apitable/core';
import { SettingOutlined } from '@vikadata/icons';
import Image from 'next/image';
import { triggerUsageAlert } from 'pc/common/billing';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { ModalOutsideOperate } from 'pc/components/common/modal_outside_operate';
import { Tooltip } from 'pc/components/common/tooltip';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { DINGTALK_APP_ID, OFFICE_APP_ID, WEWORK_APP_ID } from 'pc/components/space_manage/marketing/marketing';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import HelpIcon from 'static/icon/common/common_icon_information.svg';
import WarningIcon from 'static/icon/common/common_icon_warning.svg';
import { AppStatus, AppType, IStoreApp } from '../interface';
import style from '../style.module.less';

interface IModalProps extends IStoreApp {
  onClose: () => void;
  onRefresh: () => void;
  openStatus: AppStatus;
}
const getUrl = (configUrl?: string) => {
  if (configUrl && configUrl.startsWith('/')) {
    const url = new URL(window.location.origin);
    url.pathname = configUrl;
    return url.href;
  }
  return configUrl;
};

export const AppModal: FC<IModalProps> = props => {
  const {
    appId,
    onClose,
    logoUrl,
    name,
    helpUrl,
    openStatus,
    type,
    description,
    notice,
    needConfigured,
    configureUrl,
    displayImages,
    stopActionUrl,
    instance,
    onRefresh,
  } = props;
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [wecomTipVisible, setWecomTipVisible] = useState(false);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId)!;

  // 应用是否已开启
  const isOpen = openStatus === AppStatus.Open;
  const configPageList = [AppType.Lark, AppType.Wecom];
  const isStore = type.includes('STORE');
  const isWecomStore = type === AppType.WecomStore;
  const isDingStore = type === AppType.DingtalkStore;

  const configApp = async() => {
    setLoading(true);

    const res = await (
      isOpen ?
        Api.deleteAppInstance(instance?.appInstanceId || '')
        : Api.createAppInstance(spaceId, appId)
    );
    const { success, message } = res.data;
    if (!success) {
      Message.error({ content: message });
      return;
    }

    setLoading(false);
    Message.success({ content: isOpen ? t(Strings.marketplace_app_disable_succeed) : t(Strings.marketplace_app_enable_succeed) });
    onRefresh();
    // office 不需要跳转
    if (isOpen || type === AppType.OfficePreview) {
      return;
    }
    const { data } = res.data;
    if (needConfigured && configureUrl) {
      navigationToUrl(getUrl(`${configureUrl}/${data.appInstanceId}`) || '#');
      return;
    }
  };

  const billingAlert = (id: string) => {
    switch (id) {
      case OFFICE_APP_ID: {
        triggerUsageAlert('integrationOfficePreview');
        return;
      }
      case DINGTALK_APP_ID: {
        triggerUsageAlert('integrationDingtalk');
        return;
      }
      case WEWORK_APP_ID: {
        triggerUsageAlert('integrationWeCom');
        return;
      }
      // case FEISHU_APP_ID: {
      //   !billingSystemEnhance.check(SubscribeKye.IntegrationFeishu) &&
      //   billingSystemEnhance.triggerVikabyAlert(SubscribeKye.IntegrationFeishu);
      // }
    }
  };

  const onClick = () => {
    billingAlert(type);
    // 商店应用
    if (type.includes('STORE')) {
      if (isWecomStore || isDingStore) {
        const content = t(isWecomStore ? Strings.wecom_social_deactivate_tip : Strings.dingtalk_social_deactivate_tip);
        Modal.warning({
          title: t(Strings.kindly_reminder),
          content,
          okText: t(Strings.confirm),
        });
      } else {
        navigationToUrl(getUrl(stopActionUrl) || '#');
      }
      return;
    }

    // 自建应用 - 飞书与office可以开启/停用实例
    if (![AppType.DingTalk, AppType.Wecom].includes(type)) {
      configApp();
      return;
    }

    // 企微自建应用规则已改，针对已经开通自建应用的企业，停用时需要二次弹窗提示确认，开启直接跳转帮助文档
    if (type === AppType.Wecom) {
      if (isOpen) {
        setWecomTipVisible(true);
      } else {
        navigationToUrl('https://vika.cn/help/integration-wecom/');
      }
      return;
    }

    // 钉钉自建应用
    if (!isOpen) {
      navigationToUrl(getUrl(helpUrl) || '#');
    } else {
      Modal.confirm({
        type: 'danger',
        title: t(Strings.extra_tip),
        content: t(Strings.stop_dingtalk_h5_modal_content),
        okText: t(Strings.confirm_market_app_closing),
        cancelText: t(Strings.cancel_market_app_closing),
        onOk: configApp,
      });
    }
  };

  const Title = (
    <div className={style.modalHeader}>
      <img
        width={40}
        height={40}
        src={logoUrl}
        style={{ marginRight: 8 }}
        alt={''}
      />
      <Typography variant='h4'>{t(Strings.vika)} ×️ {name}</Typography>
      <Tooltip title={t(Strings.click_to_view_instructions)}>
        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <HelpIcon
            style={{ cursor: 'pointer', marginLeft: 4, fontSize: 16 }}
            fill={colors.thirdLevelText}
          />
        </a>
      </Tooltip>
      {
        configPageList.includes(type) && !isStore && isOpen && <div style={{
          flex: 1,
          textAlign: 'right',
          fontSize: '14px',
        }}>
          <TextButton prefixIcon={
            <SettingOutlined className={style.settingIcon} size={14}/>
          } onClick={() => {
            if (!instance) return;
            let targetUrl = `/user/${type.toLocaleLowerCase()}/integration/config/${instance.appInstanceId}`;
            if (type === AppType.Lark) {
              const { appKey, eventVerificationToken, configComplete } = instance.config.profile;
              // 没有配置完则跳转配置步骤继续配
              if (!appKey || !eventVerificationToken || !configComplete) {
                targetUrl = `${configureUrl}/${instance.appInstanceId}`;
              }
            }
            navigationToUrl(getUrl(targetUrl) || '#', { method: Method.NewTab });
          }}>
            {t(Strings.config)}
          </TextButton>
        </div>
      }
    </div>
  );

  const Footer = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '10px 16px 16px'
      }}
    >
      <div className={style.notes}>{notice}</div>
      <div style={{ width: 216, alignSelf: 'center', paddingTop: 16 }}>
        <Button
          onClick={onClick}
          color={isOpen ? 'danger' : 'primary'}
          block
          loading={type !== AppType.Wecom && loading}
        >
          {isOpen ? t(Strings.disable) : t(Strings.marketplace_integration_btncard_btntext_open)}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <ModalOutsideOperate
        modalClassName={style.modalWrapper}
        modalWidth={640}
        showOutsideOperate
        onModalClose={onClose}
      >
        <>
          {Title}
          <div className={style.modalContent}>
            <div className={style.description}>
              <Typography variant='h5' color={colors.firstLevelText}>{t(Strings.introduction)}: </Typography>
              <div style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className={style.appImg}>
              {displayImages.length > 0 && <Image src={displayImages[0]} width='100%' layout={'fill'}/>}
            </div>
          </div>
          {Footer}
        </>
      </ModalOutsideOperate>
      <Modal
        visible={wecomTipVisible}
        title={null}
        closable={false}
        bodyStyle={{ paddingTop: 24, paddingBottom: 22 }}
        centered
        footer={[
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px 14px 8px'
            }}
            key="wecom-tip-key"
          >
            <LinkButton underline={false} href={Settings.chatgroup_url.value} target='_blank' color="primary">
              {t(Strings.integration_wecom_disable_contact)}
            </LinkButton>
            <div>
              <TextButton
                onClick={() => setWecomTipVisible(false)}
                size="small"
              >
                {t(Strings.cancel)}
              </TextButton>
              <Button
                loading={loading}
                onClick={configApp}
                color="danger"
                size="small"
              >
                {t(Strings.integration_wecom_disable_button)}
              </Button>
            </div>
          </div>
        ]}
      >
        <div style={{ height: 24, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <WarningIcon width={24} height={24} fill={colors.errorColor} />
          <Typography variant="h6" style={{ marginLeft: 4 }}>
            {t(Strings.integration_wecom_disable_tips_title)}
          </Typography>
        </div>
        <div
          className={style.wecomTipsContent}
          dangerouslySetInnerHTML={{ __html: t(Strings.integration_wecom_disable_tips_message) }}
        />
      </Modal>
    </>
  );
};
