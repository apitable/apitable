import NotificationIcon from 'static/icon/datasheet/datasheet_icon_notification.svg';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { Button, IconButton, useThemeColors } from '@vikadata/components';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { INoticeDetail, Strings, t } from '@apitable/core';
import styles from './style.module.less';
import AnimationJson from 'static/json/notification_motion_white(1).json';
import { useHover, useMount } from 'ahooks';
import { AnimationItem } from 'lottie-web/index';
import { isAskForJoiningMsg, JoinMsgApplyStatus } from './utils';

interface ICard {
  data: INoticeDetail;
  isProcessed?: boolean;
  onRejectJoinSpace?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onAgreeJoinSpace?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onProcess?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const HandleMsg = (props: ICard) => {
  const colors = useThemeColors();
  const lottieAnimate = useRef<AnimationItem>();
  const { data, isProcessed, onProcess, onAgreeJoinSpace, onRejectJoinSpace } = props;
  const handleSvgId = data.id + '_handle';
  const handleWrapId = data.id + '_handle_wrap';
  const isHovering = useHover(document.getElementById(handleWrapId));
  useEffect(() => {
    if (!lottieAnimate.current) {
      return;
    }
    if (isHovering) {
      lottieAnimate.current.playSegments([0, 32], true);
    }
  }, [isHovering]);
  useMount(() => {
    const handle = document.getElementById(handleSvgId);
    if (handle) {
      import('lottie-web/build/player/lottie_svg').then(module => {
        const lottie = module.default;
        lottieAnimate.current = lottie.loadAnimation({
          container: handle,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: AnimationJson,
        });
      });
    }
  });
  const isAskForJoining = isAskForJoiningMsg(data);
  if (isProcessed && isAskForJoining) {
    const applyStatus = data.notifyBody.extras?.applyStatus;
    return <JoinMsgApplyStatus status={applyStatus} />;
  }

  if (!isProcessed && isAskForJoining) {
    return (
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.handleButtonWrapInPc}>
          <Button size="small" onClick={onRejectJoinSpace}>
            {t(Strings.reject)}
          </Button>
          <Button color="primary" onClick={onAgreeJoinSpace} size="small">
            {t(Strings.agree)}
          </Button>
        </div>
      </ComponentDisplay>
    );
  }

  if (!isProcessed && !isAskForJoining) {
    return (
      <>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <IconButton
            size="small"
            onClick={onProcess}
            icon={() => <NotificationIcon fill={colors.thirdLevelText} width="16" height="16" />}
            className={styles.handleBtnInMobile}
          />
        </ComponentDisplay>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <div className={styles.handleWrap} id={handleWrapId} onClick={onProcess}>
            <div className={styles.handleSvg} id={handleSvgId} />
            <span>{t(Strings.mark_notification_as_processed)}</span>
          </div>
        </ComponentDisplay>
      </>
    );
  }
  return <></>;
};
