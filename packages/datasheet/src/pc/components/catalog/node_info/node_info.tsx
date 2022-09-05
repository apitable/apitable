import { store } from 'pc/store';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import styles from './styles.module.less';
import { Avatar, AvatarSize } from 'pc/components/common/avatar';
import { Modal } from 'pc/components/common/modal/modal';
import { useRequest } from 'pc/hooks';
import { Api, Strings, t } from '@vikadata/core';
import { Skeleton } from '@vikadata/components';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { getNodeIcon } from '../tree/node_icon';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';

interface INodeInfoProps {
  nodeId: string;
  onClose?: () => void;
}

const NodeInfoModal: React.FC<INodeInfoProps> = props => {
  const { onClose, nodeId } = props;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { data, loading } = useRequest(() => Api.getNodeInfoWindow(nodeId));
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
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
      ? getSocialWecomUnitName({
          name: nodeInfo.creator.memberName,
          isModified: nodeInfo.creator.isMemberNameModified,
          spaceInfo,
        })
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
                  title={nodeInfo.creator.memberName}
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
          <div className={styles.value}>{nodeInfo.creator.time ? dayjs(nodeInfo.creator.time).format(timeFormat) : '-'}</div>
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

  const { onClose } = props;

  const onModalClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement!.removeChild(container);
    onClose && onClose();
  };

  ReactDOM.render(
    <Provider store={store}>
      <NodeInfoModal {...props} onClose={onModalClose} />
    </Provider>,
    container,
  );
};
