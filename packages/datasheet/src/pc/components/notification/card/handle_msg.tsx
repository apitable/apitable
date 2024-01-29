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

import { useHover, useMount } from 'ahooks';
import { AnimationItem } from 'lottie-web/index';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { Button, IconButton, useThemeColors } from '@apitable/components';
import { INoticeDetail, Strings, t } from '@apitable/core';
import { NotificationOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import AnimationJson from 'static/json/notification_motion_white(1).json';
import { isAskForJoiningMsg, JoinMsgApplyStatus } from './utils';
import styles from './style.module.less';

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
      import('lottie-web/build/player/lottie_svg').then((module) => {
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
            icon={() => <NotificationOutlined color={colors.thirdLevelText} size={16} />}
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
