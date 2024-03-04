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

import { difference, keyBy } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Api, fastCloneDeep, IApi, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { dispatch } from 'pc/worker/store';
import styles from './style.module.less';

export const sendRemind = () => {
  const state = store.getState();
  const commitRemindParam = state.catalogTree.permissionCommitRemindParameter;
  if (commitRemindParam) {
    Api.commitRemind(commitRemindParam);
  }
};

export const getNoPermissionMemberList = async (nodeId: string, unitsIds: string[]): Promise<IApi.INoPermissionMemberResponseData[] | null> => {
  if (!nodeId) {
    return null;
  }
  const res = await Api.getNoPermissionMember(nodeId, unitsIds);
  if (res.data.success) {
    return res.data.data;
  }
  Message.error({ content: res.data.message });
  return null;
};

export const verificationPermission = async (commitRemindParam: IApi.ICommitRemind) => {
  const state = store.getState();
  const activeNodePrivate = Selectors.getActiveNodePrivate(state);
  const embedId = state.pageParams.embedId;
  if (embedId || activeNodePrivate) return;
  const newCommitRemindParam = fastCloneDeep(commitRemindParam);
  dispatch(StoreActions.setPermissionCommitRemindParameter(newCommitRemindParam));

  const nodeId = commitRemindParam.nodeId || '';
  const unitsIds = newCommitRemindParam.unitRecs.map((unitRec) => unitRec.unitIds).flat();
  const noPermissionMemberData = await getNoPermissionMemberList(nodeId, unitsIds);

  const isNotify = !Selectors.getCurrentView(state);

  if (noPermissionMemberData && noPermissionMemberData.length > 0) {
    // Permission pre-fill information setting
    const noPermissionUnitIds = noPermissionMemberData.map((member) => member.unitId);
    dispatch(StoreActions.setNoPermissionMembers(noPermissionUnitIds));

    // Asynchronous Complementary Member Information
    const unitMap = Selectors.getUnitMap(state);
    const missUnitIds = difference(noPermissionUnitIds, Object.keys(unitMap || {}));
    if (missUnitIds.length) {
      Api.loadOrSearch({ unitIds: missUnitIds.join(',') }).then((res) => {
        const {
          data: { data: resData, success },
        } = res;

        if (!resData.length || !success) {
          return;
        }

        dispatch(StoreActions.updateUnitMap(keyBy(resData, 'unitId')));
      });
    }

    // Show no permission notification
    const manageable = isNotify ? false : Selectors.getPermissions(state, nodeId).manageable;
    notificationVerification({
      members: noPermissionMemberData,
      setPermission: () => {
        dispatch(StoreActions.setPermissionCommitRemindStatus(true));
        dispatch(StoreActions.updatePermissionModalNodeId(nodeId));
      },
      manageable,
    });
  } else {
    sendRemind();
  }
};

interface IUnitProps {
  members: IApi.INoPermissionMemberResponseData[];
  setPermission: Function;
  manageable: boolean;
  closeModal?: () => void;
}

const notificationVerification = (props: IUnitProps) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const state = store.getState();
  const permissionCommitRemindStatus = state.catalogTree.permissionCommitRemindStatus;

  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    if (!permissionCommitRemindStatus) {
      sendRemind();
    }
  };

  root.render(
    <Provider store={store}>
      <NotificationVerificationModal {...props} closeModal={onModalClose} />
    </Provider>,
  );
};

export const NotificationVerificationModal: React.FC<React.PropsWithChildren<IUnitProps>> = (props) => {
  const { members, setPermission, manageable, closeModal } = props;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [visibleModal, setVisibleModal] = useState(true);

  const showSetPermission = () => {
    setPermission();
    Message.destroy();
    setVisibleModal(false);
  };

  if (!isMobile && visibleModal) {
    Message.warning({
      content: (
        <div>
          <MessageContent members={members} />
          {manageable && <i onClick={showSetPermission}>{t(Strings.notified_assign_permissions_text)}</i>}
        </div>
      ),
      onClose: closeModal,
      key: 'noPermissionMessage',
    });
    return null;
  }

  return (
    <Modal visible={visibleModal} closable={false} onCancel={closeModal} bodyStyle={{ padding: '0' }} footer={null}>
      <div className={styles.permissionNotifcationModal}>
        <h6>{t(Strings.operate_info)}</h6>
        <p>
          <MessageContent members={members} />
        </p>
      </div>
      <div className={styles.modalFooter}>
        {manageable ? (
          <>
            <p className={styles.cancel} onClick={closeModal}>
              {t(Strings.cancel)}
            </p>
            <div className={styles.line} />
            <p className={styles.confirm} onClick={showSetPermission}>
              {t(Strings.set_permission)}
            </p>
          </>
        ) : (
          <p className={styles.know} onClick={closeModal}>
            {t(Strings.i_knew_it)}
          </p>
        )}
      </div>
    </Modal>
  );
};

const MessageContent = ({ members }: { members: IApi.INoPermissionMemberResponseData[] }) => {
  const memberList = members.slice(0, 3);
  return (
    <>
      {memberList.map((member) => '@' + member.memberName + ' ')}
      {members.length > 3 && t(Strings.notified_assign_permissions_number, { number: members.length })}
      {t(Strings.unaccess_notified_message)}
    </>
  );
};
