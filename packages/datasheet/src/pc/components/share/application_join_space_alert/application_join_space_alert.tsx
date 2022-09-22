import { Button, useThemeColors } from '@vikadata/components';
import { AutoTestID, DATASHEET_ID, IReduxState, Navigation, Strings, t } from '@vikadata/core';
import classnames from 'classnames';
import { ButtonPlus, Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { TComponent } from 'pc/components/common/t_component';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useResponsive, useSpaceRequest } from 'pc/hooks';
import { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_small.svg';
import JoinIcon from 'static/icon/datasheet/share/datasheet_icon_share_join.svg';
import ShareStarIcon from 'static/icon/datasheet/share/datasheet_icon_share_star.svg';
import styles from './style.module.less';

export interface IApplicationJoinSpaceAlertProps {
  spaceId: string;
  spaceName: string;
  defaultVisible?: boolean;
}

export const ApplicationJoinSpaceAlert: FC<IApplicationJoinSpaceAlertProps> = ({ spaceId, spaceName, defaultVisible = true }) => {
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  /** 表示是否开启最小化模式 */
  const [minimized, setMinimized] = useState(isMobile ? true : !defaultVisible);
  const { applyJoinSpaceReq } = useSpaceRequest();
  const { run: applyJoinSpace } = useRequest(applyJoinSpaceReq, { manual: true });
  const userInfo = useSelector((state: IReduxState) => state.user.info);

  const renderMinimized = () => {
    const container = document.getElementById(DATASHEET_ID.APPLICATION_JOIN_SPACE_BTN);
    return container ? (
      ReactDOM.createPortal(
        <ButtonPlus.Font
          className={classnames(styles.joinBtn, minimized && !isMobile && styles.fadeIn)}
          onClick={() => applicationJoinHandler()}
          icon={<JoinIcon width={24} height={24} fill={colors.secondLevelText} />}
          size='small'
          shadow
        />,
        container,
      )
    ) : (
      <></>
    );
  };

  const closeHandler = () => {
    setMinimized(true);
  };

  const applicationJoinHandler = () => {
    if (!userInfo) {
      // openLoginModal({ afterLogin });
      Modal.confirm({
        title: t(Strings.kindly_reminder),
        content: t(Strings.require_login_tip),
        okText: t(Strings.go_login),
        onOk: () => {
          Router.push(Navigation.LOGIN, { query: { reference: window.location.href }});
        },
        okButtonProps: { id: AutoTestID.GO_LOGIN_BTN },
        type: 'warning',
      });
      return;
    }
    Modal.confirm({
      title: t(Strings.apply_join_space_modal_title),
      content: (
        <TComponent tkey={t(Strings.apply_join_space_modal_content)} params={{ spaceName: <span className={styles.spaceName}>{spaceName}</span> }} />
      ),
      okText: t(Strings.join),
      onOk: () => applyJoinSpace(spaceId),
    });
  };

  return (
    <div className={classnames(styles.applicationJoinSpace, minimized && !isMobile && styles.fadeout)}>
      {!isMobile && (
        <div className={styles.container}>
          <span className={styles.text}>{t(Strings.apply_join_space_alert_text)}</span>
          <Button
            color='warning'
            size={isMobile ? 'small' : 'middle'}
            prefixIcon={!isMobile && <ShareStarIcon fill='#FFEB3A' />}
            className={styles.applicationBtn}
            onClick={applicationJoinHandler}
            shape={isMobile ? 'round' : undefined}
          >
            {t(Strings.apply_join_space)}
          </Button>
          <div className={styles.closeBtn} onClick={closeHandler}>
            <CloseIcon />
          </div>
        </div>
      )}
      {renderMinimized()}
    </div>
  );
};
