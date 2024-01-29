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
import dayjs from 'dayjs';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Skeleton } from '@apitable/components';
import { Api, Strings, t } from '@apitable/core';
import { Avatar, AvatarSize } from 'pc/components/common/avatar';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useRequest, useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getNodeIcon } from '../tree/node_icon';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './styles.module.less';

interface INodeInfoProps {
  nodeId: string;
  onClose?: () => void;
}

const NodeInfoModal: React.FC<React.PropsWithChildren<INodeInfoProps>> = (props) => {
  const { onClose, nodeId } = props;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { data, loading } = useRequest(() => Api.getNodeInfoWindow(nodeId));
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const nodeInfo = data?.data?.data;
  const Title = () => {
    if (!nodeInfo) {
      return <></>;
    }
    return (
      <div className={styles.title}>
        {getNodeIcon(nodeInfo!.icon, nodeInfo.nodeType, { size: 24, emojiSize: 24 })}
        {nodeInfo!.nodeName}
      </div>
    );
  };

  const Footer = () => {
    return (
      <div className={styles.footer} onClick={() => onClose && onClose()}>
        {t(Strings.close)}
      </div>
    );
  };

  const timeFormat = `${t(Strings.time_format_year_month_and_day)}`;

  const nameTitle =
    !loading && nodeInfo
      ? getSocialWecomUnitName?.({
        name: nodeInfo.creator.memberName,
        isModified: nodeInfo.creator.isMemberNameModified,
        spaceInfo,
      }) || nodeInfo.creator.memberName
      : '';

  const content =
    loading || !nodeInfo ? (
      <>
        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%" />
      </>
    ) : (
      <ul className={styles.contentInfo}>
        <li>
          <div className={styles.label}>{t(Strings.node_info_createdby)}</div>
          <div className={classNames(styles.value, nodeInfo.creator.isDeleted && styles.isLeave)}>
            {nodeInfo.creator.memberName ? (
              <>
                <Avatar
                  className={styles.avatar}
                  style={{ border: 0 }}
                  id={nodeInfo.creator.memberName}
                  src={nodeInfo.creator?.avatar}
                  title={nodeInfo.creator?.nickName || nodeInfo.creator.memberName}
                  avatarColor={nodeInfo.creator?.avatarColor}
                  size={AvatarSize.Size20}
                />
                {nameTitle || nodeInfo.creator.memberName}
              </>
            ) : (
              '-'
            )}
          </div>
        </li>
        <li>
          <div className={styles.label}>{t(Strings.node_info_created_time)}</div>
          <div className={styles.value}>{nodeInfo.creator.time ? dayjs.tz(nodeInfo.creator.time).format(timeFormat) : '-'}</div>
        </li>
      </ul>
    );

  return (
    <Modal
      className={classNames(styles.nodeInfo, isMobile && styles.nodeInfoMobile)}
      closable={!isMobile}
      title={<Title />}
      footer={isMobile && <Footer />}
      visible
      centered
      onCancel={() => onClose && onClose()}
    >
      {content}
    </Modal>
  );
};

export const expandNodeInfo = (props: INodeInfoProps) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const { onClose } = props;

  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    onClose && onClose();
  };

  root.render(
    <Provider store={store}>
      <NodeInfoModal {...props} onClose={onModalClose} />
    </Provider>,
  );
};
