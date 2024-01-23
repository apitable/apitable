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
import { AnimationItem } from 'lottie-web/index';
import QueueAnim from 'rc-queue-anim';
import * as React from 'react';
import { FC, useRef, useState } from 'react';

import { Button, ButtonGroup } from '@apitable/components';
import { Api, INoticeDetail, INotifyBody, Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { expandRecord } from 'pc/components/expand_record';
import { Method } from 'pc/components/route_manager/const';
import { IQuery } from 'pc/components/route_manager/interface';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { useNotificationRequest, useRequest, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { timeFormatter } from 'pc/utils';
import { NOTIFICATION_ITEM_RECORD } from 'pc/utils/test_id_constant';
import { navigationToConfigUrl } from '../publish';
import { NoticeTypesConstant } from '../utils';
import { BottomMsgAvatar, OfficialAvatar } from './card_avatar';
import { HandleMsg } from './handle_msg';
import { canJumpWhenClickCard, commentContentFormat, getNoticeUrlParams, isAskForJoiningMsg, NotifyType, renderNoticeBody } from './utils';
import styles from './style.module.less';

interface ICard {
  data: INoticeDetail;
  isProcessed?: boolean;
}

export const Card: FC<React.PropsWithChildren<ICard>> = ({ data, isProcessed }) => {
  const lottieAnimate = useRef<AnimationItem>();
  const [show, setShow] = useState(true);
  const timerRef = useRef<any>(null);
  const mouseTimerRef = useRef<any>(null);
  const canJump = canJumpWhenClickCard(data);
  const notifyType = data.notifyType;
  const isAskForJoining = isAskForJoiningMsg(data);
  const { transferNoticeToRead, transferNoticeToReadAndRefresh } = useNotificationRequest();
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const { run: processJoin } = useRequest((agree: boolean) => Api.processSpaceJoin(data.id, agree), {
    manual: true,
    onSuccess: (res) => {
      const { success, message, code } = res.data;
      if (success) {
        transferNoticeToReadAndRefresh([data]);
        setShow(false);
        return;
      }
      Modal.warning({
        title: t(Strings.please_note),
        content: message,
        onOk: () => toRead(data),
      });
    },
  });
  const { spaceId, nodeId, viewId, recordId, configPathname, toastUrl, recordIds } = getNoticeUrlParams(data);
  const toRead = (data: INoticeDetail) => {
    transferNoticeToRead([data]);
    setShow(false);
  };
  const processed = (data: INoticeDetail) => {
    if (isProcessed) return;
    lottieAnimate.current && lottieAnimate.current.playSegments([32, 43], true);
    timerRef.current = setTimeout(() => {
      toRead(data);
      window.clearTimeout(timerRef.current);
    }, 300);
  };

  function joinPath(pathParams: (string | undefined)[]) {
    const params: string[] = [];
    pathParams.forEach((param) => {
      param && params.push(param);
    });
    return params.join('/');
  }

  const cardClick = (data: INoticeDetail) => {
    // Priority Notes: toastUrl > canJump > configUrl > notifySpace > curSpace
    if (toastUrl) {
      navigationToConfigUrl(toastUrl);
      return;
    }

    if (!canJump) return;

    const url = new URL(window.location.href);
    url.pathname = joinPath([configPathname, nodeId, viewId, recordId]);
    let query: IQuery = {};
    if (notifyType === NotifyType.Record || notifyType === NotifyType.Member) {
      query = { comment: 1 };
    }

    const isDateTimeAlarm = notifyType === NotifyType.System && Boolean(data.notifyBody.extras?.recordId);

    if (notifyType === NotifyType.Record || isDateTimeAlarm) {
      expandRecord({
        viewId: viewId,
        activeRecordId: recordId,
        recordIds: recordIds,
        datasheetId: nodeId!,
      });
      !isProcessed && transferNoticeToRead([data]);
      return;
    }

    if (isProcessed) {
      navigationToUrl(url.href, { spaceId, method: Method.Push, query });
      return;
    }

    setShow(false);
    transferNoticeToRead([data]).then(() => {
      navigationToUrl(url.href, { spaceId, method: Method.Push, query });
      return;
    });
  };

  const handleWrapClick = (e: React.MouseEvent) => {
    processed(data);
    stopPropagation(e);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const BottomText: FC<React.PropsWithChildren<{ type: string; notifyBody: INotifyBody }>> = ({ type, notifyBody }): React.ReactElement => {
    let text = '';
    switch (type) {
      case NoticeTypesConstant.system: {
        text = t(Strings.system_message);
        break;
      }
      default: {
        /**
         * Currently space/member/record types will contain space information,
         * here just to be compatible with dirty data, such as the use of GM commands lead to field value errors,
         * the result did not find the corresponding space, to prevent the problem of large-scale notification center crash online
         */
        text = notifyBody.space?.spaceName || '';
        break;
      }
    }
    return <div className={styles.text}>{text}</div>;
  };

  const rejectJoinSpace = (e: React.MouseEvent) => {
    processJoin(false);
    stopPropagation(e);
  };
  const agreeJoinSpace = (e: React.MouseEvent) => {
    processJoin(true);
    stopPropagation(e);
  };

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const getCardTopRightWidth = () => {
    let width = 'auto';
    if (!isMobile) {
      width = isProcessed ? '50px' : '150px';
    }
    return width;
  };

  const MesQuickProcessInMobile = (): React.ReactElement => {
    return (
      <ButtonGroup className={styles.quickProcessWrap} withSeparate>
        <Button size="small" onClick={rejectJoinSpace}>
          {t(Strings.reject)}
        </Button>
        <Button size="small" onClick={agreeJoinSpace}>
          {t(Strings.agree)}
        </Button>
      </ButtonGroup>
    );
  };
  const showCommentContent = data.notifyBody.extras?.commentContent;
  const getCardDataTestId = () => {
    switch (data.notifyType) {
      case NotifyType.Record:
        return NOTIFICATION_ITEM_RECORD;
      default:
        return '';
    }
  };

  return (
    <QueueAnim type={'scale'} ease={'easeInOutQuart'} appear={false} key={'anim' + data.id}>
      {show ? (
        <div
          data-test-id={getCardDataTestId()}
          key={data.id}
          id={data.id}
          className={classNames(styles.msgCard, { [styles.canJump!]: canJump || toastUrl })}
          onClick={() => {
            if (mouseTimerRef.current + 300 > new Date().getTime()) {
              cardClick(data);
            }
          }}
          onMouseDown={() => (mouseTimerRef.current = new Date().getTime())}
        >
          <div className={styles.content}>
            <div className={styles.cardTop}>
              <div className={classNames(styles.msgContent, showCommentContent && styles.msgContentComment)}>
                {notifyType === NoticeTypesConstant.system && <OfficialAvatar />}
                {renderNoticeBody(data, { pureString: false, spaceInfo })}
              </div>
              <div
                className={classNames(styles.cardTopRight, showCommentContent && styles.cardTopRightComment)}
                style={{ width: getCardTopRightWidth() }}
              >
                <HandleMsg
                  onProcess={handleWrapClick}
                  onAgreeJoinSpace={agreeJoinSpace}
                  onRejectJoinSpace={rejectJoinSpace}
                  isProcessed={isProcessed}
                  data={data}
                />
              </div>
            </div>
            {showCommentContent && (
              <div className={styles.commentContentWrap}>
                <span>{commentContentFormat(data.notifyBody.extras?.commentContent, spaceInfo)}</span>
              </div>
            )}
            <div className={styles.cardBottom}>
              <div className={styles.bottomLeft}>
                <BottomMsgAvatar
                  title={data.notifyBody.space?.spaceName}
                  src={data.notifyBody.space?.logo}
                  id={data.notifyBody.space?.spaceId}
                  notifyType={notifyType}
                />
                <BottomText type={notifyType} notifyBody={data.notifyBody} />
              </div>
              <div className={styles.time}>{timeFormatter(data.createdAt)}</div>
            </div>
          </div>
          {isAskForJoining && !isProcessed && isMobile && <MesQuickProcessInMobile />}
        </div>
      ) : null}
    </QueueAnim>
  );
};
