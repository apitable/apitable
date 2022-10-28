import { Message, ThemeProvider } from '@vikadata/components';
import { Api, ConfigConstant, Events, getCustomConfig, Player, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Tabs } from 'antd';
import classNames from 'classnames';
import { isObject } from 'lodash';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { isSocialPlatformEnabled, isSocialWecom, isWecomFunc, SocialPlatformMap } from 'pc/components/home/social_platform';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { getWecomAgentConfig, initNoTraceVerification, stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { FC, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { ImportFile } from './import_file';
import { InputEmail } from './input_email';
import { LinkInvite } from './link_invite';
import styles from './style.module.less';

const { TabPane } = Tabs;

interface IInviteOutsiderTabsProps {
  cancelModal: () => void;
  resUpdate?: () => void;
  shareId?: string;
}

export const InviteOutsiderTabs: FC<IInviteOutsiderTabsProps> = props => {
  const { cancelModal, resUpdate, shareId } = props;
  const { emailInvitationDisable, showLabelInInviteModal } = getCustomConfig();
  // Availability of invitees
  const [memberInvited, setMemberInvited] = useState(false);
  const [secondVerify, setSecondVerify] = useState<null | string>(null);
  const isAdmin = useSelector(state => state.user.info?.isAdmin);
  const isOrgIsolated = useSelector(state => state.space.spaceFeatures?.orgIsolated);
  const env = getEnvVariables();
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
  const innerLabel = showLabelInInviteModal ? '(' + t(Strings.private_internal_person_only) + ')' : '';
  const outerLabel = showLabelInInviteModal ? '(' + t(Strings.private_external_person_only) + ')' : '';

  return (
    <Tabs defaultActiveKey='inviteViaLink' className={classNames({ [styles.showLabel]: showLabelInInviteModal })}>
      <TabPane tab={t(Strings.link_invite) + innerLabel} key='inviteViaLink'>
        <LinkInvite shareId={shareId} />
      </TabPane>
      {!emailInvitationDisable && (isAdmin || !isOrgIsolated) && (
        <>
          <TabPane tab={t(Strings.email_invite) + outerLabel} key='emailOfTab'>
            <InputEmail
              cancel={cancelModal}
              setMemberInvited={setMemberInvited}
              shareId={shareId}
              secondVerify={secondVerify}
              setSecondVerify={setSecondVerify}
            />
          </TabPane>
          {isPC && !shareId && !env.HIDDEN_BATCH_IMPORT_USER && (
            <TabPane tab={t(Strings.batch_import) + outerLabel} key='fileOfTab'>
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

  // Enterprise, authMode 2 means "Member Authorization", only member authorization mode can call Enterprise address book
  if (isSocialWecom(spaceInfo) && spaceInfo?.social.authMode === 2) {
    // Not a built-in browser for Enterprise Micro
    if (!isWecomFunc()) {
      Modal.warning({
        title: t(Strings.invite_member),
        content: t(Strings.wecom_invite_member_browser_tips),
      });
      return;
    }
    const wx = (window as any).wx;
    const spaceId = state.space.activeId;
    if (isObject(wx) && spaceId) {
      // https://developer.work.weixin.qq.com/document/path/94516
      getWecomAgentConfig(spaceId, () => {
        (wx as any).invoke(
          'selectPrivilegedContact',
          {
            fromDepartmentId: -1,
            mode: 'multi', // Mandatory, select mode, single means single, multi means multiple
            selectedContextContact: 0, 
          },
          function(res) {
            if (res.err_msg == 'selectPrivilegedContact:ok') {
              const selectedTicket = res.result.selectedTicket; 
              Api.postWecomUnauthMemberInvite(spaceId, [selectedTicket]).then(rlt => {
                if (rlt.data.message === 'SUCCESS') {
                  Message.success({ content: t(Strings.success) });
                } else {
                  Message.error({ content: t(Strings.error) });
                }
              });
            }
          },
        );
      });
    }
    return;
  }

  if (spaceInfo && isSocialPlatformEnabled(spaceInfo)) {
    SocialPlatformMap[spaceInfo.social.platform].org_manage_reject_default_modal();
    return;
  }

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
                <Popup title={t(Strings.invite_member)} onClose={close} visible height={'90%'} className={styles.inviteDrawer}>
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
