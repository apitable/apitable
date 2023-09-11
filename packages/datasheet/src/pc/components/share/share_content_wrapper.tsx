import classNames from 'classnames';
import React from 'react';
import { useThemeColors } from '@apitable/components';
import { IShareInfo } from '@apitable/core';
import { isIframe } from '../../utils/env';
import { ApplicationJoinSpaceAlert } from './application_join_space_alert';
import styles from './style.module.less';

interface IShareContentWrapperProps {
  isIframeShowShareMenu: boolean;
  shareId?: string;
  sideBarVisible: boolean;
  judgeAllowEdit: () => void;
  children?: JSX.Element | null;
  shareSpaceId: string;
  applicationJoinAlertVisible: boolean;
  shareSpace: IShareInfo;
  shareSpaceName: string;
}

export const ShareContentWrapper = ({
  isIframeShowShareMenu,
  shareId,
  sideBarVisible,
  judgeAllowEdit,
  children,
  shareSpaceId,
  applicationJoinAlertVisible,
  shareSpace,
  shareSpaceName,
}: IShareContentWrapperProps) => {
  const colors = useThemeColors();
  return (
    <div
      className={classNames(styles.gridContainer, {
        [styles.containerAfter]: !isIframe(),
        [styles.iframeShareContainer]: isIframe(),
      })}
      style={{
        height: '100%',
        width: isIframeShowShareMenu ? '100%' : '',
        padding: shareId && !isIframe() ? '16px 15px 0 0' : '',
        paddingBottom: isIframe() ? '40px' : '16px',
        background: shareId && !isIframe() ? colors.primaryColor : '',
        borderLeft: shareId && !sideBarVisible && !isIframe() ? `16px solid ${colors.primaryColor}` : '',
      }}
    >
      <div className={styles.wrapper} onDoubleClick={judgeAllowEdit}>
        {children}
      </div>
      {applicationJoinAlertVisible && (
        <ApplicationJoinSpaceAlert spaceId={shareSpaceId} spaceName={shareSpaceName} defaultVisible={shareSpace.allowApply} />
      )}
    </div>
  );
};
