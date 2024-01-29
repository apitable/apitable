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

import classnames from 'classnames';
import { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, useThemeColors } from '@apitable/components';
import { AutoTestID, DATASHEET_ID, IReduxState, Navigation, Strings, t } from '@apitable/core';
import { CloseOutlined, Star2Filled, UserAddOutlined } from '@apitable/icons';
import { ButtonPlus, Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { TComponent } from 'pc/components/common/t_component';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useResponsive, useSpaceRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

export interface IApplicationJoinSpaceAlertProps {
  spaceId: string;
  spaceName: string;
  defaultVisible?: boolean;
}

export const ApplicationJoinSpaceAlert: FC<React.PropsWithChildren<IApplicationJoinSpaceAlertProps>> = ({
  spaceId,
  spaceName,
  defaultVisible = true,
}) => {
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [minimized, setMinimized] = useState(isMobile ? true : !defaultVisible);
  const { applyJoinSpaceReq } = useSpaceRequest();
  const { run: applyJoinSpace } = useRequest(applyJoinSpaceReq, { manual: true });
  const userInfo = useAppSelector((state: IReduxState) => state.user.info);

  const renderMinimized = () => {
    const container = document.getElementById(DATASHEET_ID.APPLICATION_JOIN_SPACE_BTN);
    return container ? (
      ReactDOM.createPortal(
        <ButtonPlus.Font
          className={classnames(styles.joinBtn, minimized && !isMobile && styles.fadeIn)}
          onClick={() => applicationJoinHandler()}
          icon={<UserAddOutlined size={24} color={colors.secondLevelText} />}
          size="small"
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
          Router.push(Navigation.LOGIN, { query: { reference: window.location.href } });
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
            color="warning"
            size={isMobile ? 'small' : 'middle'}
            prefixIcon={!isMobile && <Star2Filled color="#FFEB3A" />}
            className={styles.applicationBtn}
            onClick={applicationJoinHandler}
            shape={isMobile ? 'round' : undefined}
          >
            {t(Strings.apply_join_space)}
          </Button>
          <div className={styles.closeBtn} onClick={closeHandler}>
            <CloseOutlined />
          </div>
        </div>
      )}
      {renderMinimized()}
    </div>
  );
};
