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

import { useMount } from 'ahooks';
import { Tabs } from 'antd';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@apitable/components';
import { ConfigConstant, Events, getCustomConfig, Player, Strings, t } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { initNoTraceVerification, stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { ImportFile } from './import_file';
import { InputEmail } from './input_email';
import { LinkInvite } from './link_invite';
// @ts-ignore
import { checkSocialInvite } from 'enterprise/home/utils';
import styles from './style.module.less';

const { TabPane } = Tabs;

interface IInviteOutsiderTabsProps {
  cancelModal: () => void;
  resUpdate?: () => void;
  shareId?: string;
}

export const InviteOutsiderTabs: FC<React.PropsWithChildren<IInviteOutsiderTabsProps>> = (props) => {
  const { cancelModal, resUpdate, shareId } = props;
  const { emailInvitationDisable } = getCustomConfig();
  const { CONTACTS_MODAL_BULK_IMPORT_VISIBLE, CONTACTS_MODAL_INVITE_VIA_EMAIL_VISIBLE } = getEnvVariables();
  // Availability of invitees
  const [memberInvited, setMemberInvited] = useState(false);
  const [secondVerify, setSecondVerify] = useState<null | string>(null);
  const isAdmin = useAppSelector((state) => state.user.info?.isAdmin);
  const isOrgIsolated = useAppSelector((state) => state.space.spaceFeatures?.orgIsolated);
  useMount(() => {
    Player.doTrigger(Events.invite_entrance_modal_shown);
  });
  useEffect(() => {
    const updateMemberList = () => {
      if (!memberInvited) {
        return;
      }
      resUpdate && resUpdate();
    };
    return updateMemberList;
  }, [resUpdate, memberInvited]);

  useMount(() => {
    initNoTraceVerification(setSecondVerify, ConfigConstant.CaptchaIds.LOGIN);
  });

  const { screenIsAtLeast } = useResponsive();
  const isPC = screenIsAtLeast(ScreenSize.md);

  return (
    <Tabs
      defaultActiveKey="inviteViaLink"
      className={classNames({ [styles.showLabel]: CONTACTS_MODAL_BULK_IMPORT_VISIBLE && CONTACTS_MODAL_INVITE_VIA_EMAIL_VISIBLE })}
    >
      <TabPane tab={t(Strings.link_invite)} key="inviteViaLink">
        <LinkInvite />
      </TabPane>
      {!emailInvitationDisable && (isAdmin || !isOrgIsolated) && (
        <>
          {CONTACTS_MODAL_INVITE_VIA_EMAIL_VISIBLE && (
            <TabPane tab={t(Strings.email_invite)} key="emailOfTab" style={{ height: '100%' }}>
              <InputEmail
                cancel={cancelModal}
                setMemberInvited={setMemberInvited}
                shareId={shareId}
                secondVerify={secondVerify}
                setSecondVerify={setSecondVerify}
              />
            </TabPane>
          )}

          {isPC && !shareId && CONTACTS_MODAL_BULK_IMPORT_VISIBLE && (
            <TabPane tab={t(Strings.batch_import)} key="fileOfTab">
              <ImportFile
                closeModal={cancelModal}
                setMemberInvited={setMemberInvited}
                secondVerify={secondVerify}
                setSecondVerify={setSecondVerify}
              />
            </TabPane>
          )}
        </>
      )}
    </Tabs>
  );
};

export const expandInviteModal = (data?: { resUpdate?: () => void; shareId?: string }) => {
  const state = store.getState();
  const spaceInfo = state.space.curSpaceInfo;

  if (checkSocialInvite?.(spaceInfo)) return;

  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  function destroy() {
    root.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function close() {
    setTimeout(() => {
      destroy();
    }, 0);
  }

  function render() {
    setTimeout(() => {
      root.render(
        <Provider store={store}>
          <ThemeProvider>
            <div onMouseDown={stopPropagation} onClick={stopPropagation}>
              <ComponentDisplay minWidthCompatible={ScreenSize.md}>
                <Modal
                  title={<div>{t(Strings.invite_member)}</div>}
                  visible
                  onCancel={close}
                  className={styles.inviteOutsiderTabs}
                  footer={null}
                  width={640}
                  centered
                  style={{ minWidth: '640px' }}
                >
                  <InviteOutsiderTabs cancelModal={close} resUpdate={data?.resUpdate} shareId={data?.shareId} />
                </Modal>
              </ComponentDisplay>
              <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
                <Popup title={t(Strings.invite_member)} onClose={close} open height={'90%'} className={styles.inviteDrawer}>
                  <InviteOutsiderTabs cancelModal={close} resUpdate={data?.resUpdate} />
                </Popup>
              </ComponentDisplay>
            </div>
          </ThemeProvider>
        </Provider>,
      );
    });
  }

  render();
};
