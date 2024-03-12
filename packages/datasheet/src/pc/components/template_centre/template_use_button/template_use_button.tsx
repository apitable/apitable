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

import { usePostHog } from 'posthog-js/react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@apitable/components';
import { AutoTestID, ConfigConstant, Events, IReduxState, ITemplateTree, Navigation, Player, Strings, t, TrackEvents } from '@apitable/core';
import { ArrowRightOutlined } from '@apitable/icons';
import { Modal } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useUserRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { UsingTemplateModal } from '../using_template_modal';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';
// @ts-ignore
import { LoginModal } from 'enterprise/home/login_modal/login_modal';
import styles from './style.module.less';

interface ITemplateUseButtonProps {
  style?: React.CSSProperties;
  showIcon?: boolean;
  id?: string;
  block?: boolean;
}

const calcNodeNum = (directory: ITemplateTree[]): number => {
  return directory.reduce<number>((total, cur) => {
    if (!cur.children.length) {
      return total + 1;
    }
    return total + calcNodeNum(cur.children);
  }, 0);
};

export const TemplateUseButton: React.FC<React.PropsWithChildren<ITemplateUseButtonProps>> = (props) => {
  const { style, showIcon, children, id, block } = props;
  const userInfo = useAppSelector((state: IReduxState) => state.user.info);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const { templateId, categoryId } = useAppSelector((state: IReduxState) => state.pageParams);
  const [openTemplateModal, setOpenTemplateModal] = useState('');
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const templateDirectory = useAppSelector((state) => state.templateCentre.directory);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest(getLoginStatusReq, { manual: true });
  const posthog = usePostHog();

  const nodeNumber = useMemo(() => {
    return calcNodeNum(templateDirectory!.nodeTree.children);
  }, [templateDirectory]);

  useEffect(() => {
    if (!openTemplateModal) {
      return;
    }
    Player.doTrigger(Events.template_use_confirm_modal_shown);
  }, [openTemplateModal]);

  const openUseTemplateModal = () => {
    posthog?.capture(TrackEvents.TemplateUse);
    // Current user is not logged in
    if (!userInfo) {
      Modal.confirm({
        title: t(Strings.kindly_reminder),
        content: t(Strings.require_login_tip),
        okText: t(Strings.go_login),
        onOk: () => {
          Router.redirect(Navigation.LOGIN);
        },
        okButtonProps: { id: AutoTestID.GO_LOGIN_BTN },
        type: 'warning',
      });
      return;
    }
    // Current user is logged in
    if (!spaceId && templateId) {
      Router.push(Navigation.TEMPLATE, { params: { categoryId, templateId, spaceId: userInfo!.spaceId } });
      return;
    }
    const result = triggerUsageAlert?.('maxSheetNums', { usage: spaceInfo!.sheetNums + nodeNumber, alwaysAlert: true }, SubscribeUsageTipType?.Alert);
    if (result) {
      return;
    }
    setOpenTemplateModal(templateId!);
  };

  const afterLogin = async (data: string, loginMode: ConfigConstant.LoginMode) => {
    if (data) {
      if (loginMode === ConfigConstant.LoginMode.PHONE) {
        Router.push(Navigation.INVITATION_VALIDATION, { query: { token: data, reference: window.location.href } });
      } else if (loginMode === ConfigConstant.LoginMode.MAIL) {
        Router.push(Navigation.IMPROVING_INFO, { query: { token: data, reference: window.location.href } });
      }
    } else {
      const userInfo = await getLoginStatus();
      if (!userInfo) {
        return;
      }
      Router.push(Navigation.TEMPLATE, { params: { categoryId, templateId, spaceId: userInfo!.spaceId } });
    }
  };

  return (
    <>
      <div onClick={openUseTemplateModal} id={id} className={styles.usingBtn} style={style}>
        {children ? (
          children
        ) : (
          <Button style={{ ...style }} block={block} color="warning" size="middle">
            {t(Strings.apply_template)}
            {showIcon && <ArrowRightOutlined color="white" />}
          </Button>
        )}
      </div>
      {openTemplateModal && (
        <div>
          <UsingTemplateModal templateId={templateId!} onCancel={setOpenTemplateModal} />
        </div>
      )}
      {openLoginModal && LoginModal && <LoginModal onCancel={() => setOpenLoginModal(false)} afterLogin={afterLogin} />}
    </>
  );
};
