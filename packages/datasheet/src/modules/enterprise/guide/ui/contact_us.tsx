import { Button, Message, Typography, useThemeColors } from '@apitable/components';
import { ConfigConstant, Settings } from '@apitable/core';
import {
  AdviseSmallOutlined, BugOutlined, CloseMiddleOutlined, InformationLargeOutlined, ServeOutlined, SolutionSmallOutlined, TitleFavoriteFilled,
  ZanOutlined,
} from '@apitable/icons';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import Image from 'next/image';
import { Modal as ModalBase } from 'pc/components/common/modal/modal/modal';
import { isSocialPlatformEnabled, isDingtalkFunc, isWecomFunc, isLarkFunc } from 'pc/components/home/social_platform';
import { store } from 'pc/store';
import { tracker } from 'pc/utils/tracker';
import QRCode from 'qrcode';
import { FC, useState } from 'react';
import { createRoot } from 'react-dom/client';

type IconType = 'BugOutlined' | 'AdviseSmallOutlined' | 'ServeOutlined' | 'ZanOutlined'
  | 'SolutionSmallOutlined' | 'InformationLargeOutlined';

interface IInofo {
  title: string;
  description?: string;
  list?: string;
  tip: string;
  originUrl?: string;
  imgUrl?: string;
}

interface IQrcode {
  vikaby: string;
  questionnaire: string;
  tip: string;
}

interface IQuestionnaireIcon {
  title: string;
  icon: IconType;
}

export interface IGuideContactUsOptions {
  uiInfo: {
    vikaby: IInofo;
    questionnaire: IInofo;
    website: IQrcode;
    dingtalk: IQrcode;
    wecom: IQrcode;
    feishu: IInofo;
  };
  backdrop?: boolean;
  onClose?: () => void;
  confirmText?: string;
  children?: Element;
}

const mapIcon = {
  BugOutlined: <BugOutlined />,
  AdviseSmallOutlined: <AdviseSmallOutlined />,
  ServeOutlined: <ServeOutlined />,
  ZanOutlined: <ZanOutlined />,
  SolutionSmallOutlined: <SolutionSmallOutlined />,
  InformationLargeOutlined: <InformationLargeOutlined />
};

/*
 * Hoverball shows customer service
 *    vikaby(onclick) => TriggerCommands(open_guide_wizard) => redux =>
 *      current_guide_step(subscribe) => guid.showUiFromConfig => here
 * Newbie guide shows customer service
 *    guide.questionnaire => guid.showUiFromConfig => here
 */
const prefix = 'vika-qrcode';

const Modal: FC<IGuideContactUsOptions> = props => {
  const colors = useThemeColors();
  const { confirmText, backdrop = true, onClose, uiInfo } = props;
  const { vikaby, questionnaire, feishu, dingtalk, wecom, website } = uiInfo;
  const state = store.getState();
  const spaceInfo = state.space.curSpaceInfo;
  const [show, setShow] = useState(true);

  const isVikaby = true;
  /**
   * QR code first distinguish whether it is newbie guide jump or click customer service,
   * then distinguish platform, platform -> saas, nail, enterprise micro, fly book
   */
  // Third-party platforms do not distinguish between sweeps and clients, only space station attribution
  const isBindDingTalk = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.DINGTALK) || isDingtalkFunc();
  const isBindWecom = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.WECOM) || isWecomFunc();
  const isBindFeishu = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.FEISHU) || isLarkFunc();

  const platformImg = isBindDingTalk ? dingtalk : isBindWecom ? wecom : website;

  const finalClose = e => {
    setShow(false);
    onClose && onClose();
    tracker.quick('trackHeatMap', e.target);
  };

  useMount(() => {
    if (!isBindFeishu || !feishu.originUrl) return;
    QRCode.toCanvas(feishu.originUrl,
      {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 184
      },
      (err, canvas) => {
        if (err) {
          Message.error({ content: 'Generate QrCode failed' });
        }
        const container = document.getElementById('shareQrCode');
        container?.appendChild(canvas);
      });
  });

  const renderOld = () => {
    const { title, imgUrl, tip, description } = feishu;
    return (
      <div className='vika-guide-connect-us-container'>
        <div className='vika-guide-connect-us-title'>{title}</div>
        <div className='vika-guide-connect-us-body'>
          <div className='vika-guide-connect-us-qrcode-wrapper'>
            {imgUrl && <Image src={imgUrl} width={174} height={174} />}
            <div id='shareQrCode' className='vika-guide-connect-us-qrcode' />
          </div>
          {
            tip && <div className='vika-guide-connect-us-tip'>{tip}</div>
          }
          {
            description && <div className='vika-guide-connect-us-desc'>{description}</div>
          }
          <Button
            className='vika-guide-connect-us-btn'
            onClick={finalClose}
            color='primary'
            size='small'
          >
            {confirmText}
          </Button>
        </div>
      </div>
    );
  };

  const renderAvatar = (opacity) => (
    <div className={`${prefix}-avatar`} style={{ borderColor: `rgba(123, 103, 238, ${opacity})` }}>
      <div className={`${prefix}-avatar-icon`}>
        <Image src={Settings.onboarding_customer_service_qrcode_avatar_img_url.value} alt='' width={64} height={64} />
      </div>
      <div className={`${prefix}-avatar-star`}>
        <TitleFavoriteFilled color={colors.fc14} size='12px' />
      </div>
    </div>
  );

  const renderQrCode = (size) => (
    <div className={`${prefix}-img`} style={{ width: size, height: size }}>
      <div className={`${prefix}-corner`} />
      <div className={`${prefix}-corner`} />
      <div className={`${prefix}-corner`} />
      <div className={`${prefix}-corner`} />
      <Image
        width={size - 20}
        height={size - 20}
        src={isVikaby ? platformImg.vikaby : platformImg.questionnaire}
      />
    </div>
  );

  const renderModalContent = () => {
    const { list } = questionnaire;
    const iconList: IQuestionnaireIcon[] = list ? JSON.parse(list) : [];
    return (
      isVikaby ? (
        <div className={`${prefix}-customer`}>
          <div className={`${prefix}-introduce`}>
            {renderAvatar(0.3)}
            <Typography className={`${prefix}-customer-welcome`} variant='h5'>
              {vikaby.title}
            </Typography>
            <Typography className={`${prefix}-customer-desc`} variant='h5'>
              {vikaby.description}
            </Typography>
            <div className={`${prefix}-customer-list`} dangerouslySetInnerHTML={{ __html: vikaby.list || '' }} />
            <div className={`${prefix}-customer-more`}>
              ......
            </div>
          </div>
          <div className={`${prefix}-customer-content`}>
            <div className={`${prefix}-customer-content-border`}>
              <Typography variant='h6' className={`${prefix}-customer-wecom-tip`}>{isBindDingTalk ? dingtalk.tip : vikaby.tip}</Typography>
              {renderQrCode(194)}
            </div>
          </div>
        </div>
      ) : (
        <div className={`${prefix}-guide`} style={{ backgroundImage: `url(${Settings.onboarding_customer_service_background_img_url.value})` }}>
          {renderAvatar(1)}
          <Typography className={`${prefix}-guide-welcome`} variant='h4'>{questionnaire.title}</Typography>
          <Typography className={`${prefix}-guide-tip`} variant='body4'>{questionnaire.tip}</Typography>
          <div className={`${prefix}-guide-content`}>
            <div className={`${prefix}-guide-content-border`}>
              {
                iconList.map((v) => (
                  <Typography key={v.title} variant='body4' className={`${prefix}-guide-content-tag`}>
                    {mapIcon[v.icon]}
                    {v.title}
                  </Typography>
                ))
              }
              {renderQrCode(220)}
            </div>
          </div>
        </div>
      )
    );
  };

  const rest: any = {
    closeIcon: <CloseMiddleOutlined size={8} color={colors.fc3} />
  };
  if (!isBindFeishu) {
    rest.width = 720;
    rest.closeIcon = <CloseMiddleOutlined size={8} color={colors.fc8} />;
    rest.wrapClassName = 'vika-qrcode-close';
  }
  if (isVikaby) {
    rest.style = { height: 520 };
    rest.bodyStyle = { height: 520 };
  }

  return (
    <ModalBase
      visible={show}
      className={classNames({ ['vika-guide-modal-no-box-shadow']: backdrop })}
      closable
      maskClosable={false}
      centered
      mask={backdrop}
      footer={null}
      onCancel={finalClose}
      getContainer={'.vika-guide-connect-us'}
      {...rest}
    >
      {isBindFeishu ? renderOld() : renderModalContent()}
    </ModalBase>
  );
};

export const showContactUs = (props: IGuideContactUsOptions) => {
  const { children, ...rest } = props;
  const destroy = () => {
    const dom = document.querySelector('.vika-guide-connect-us');
    dom && document.body.removeChild(dom);
  };

  const render = () => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.setAttribute('class', 'vika-guide-connect-us');
      document.body.appendChild(div);
      const root = createRoot(div);
      root.render(
        <Modal onClose={destroy} {...rest}>{children}</Modal>);
    });
  };

  const run = () => {
    destroy();
    render();
  };

  run();
};

export const destroyContactUs = () => {
  const destroy = () => {
    const dom = document.querySelector('.vika-guide-connect-us');
    dom && document.body.removeChild(dom);
  };
  destroy();
};
