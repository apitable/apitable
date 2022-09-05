import { useState } from 'react';
import * as React from 'react';
import { Message, Modal } from 'pc/components/common';
import { dispatch } from 'pc/worker/store';
import { store } from 'pc/store';
import { Selectors, StoreActions, t, Strings, fastCloneDeep, IApi, Api } from '@vikadata/core';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import styles from './style.module.less';
import { difference, keyBy } from 'lodash';

//发送通知
export const sendRemind = () => {
  const state = store.getState();
  const commitRemindParam = state.catalogTree.permissionCommitRemindParameter;
  if (commitRemindParam) {
    Api.commitRemind(commitRemindParam);
  }
};

//获取无权限人员列表
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
  // 设置详细参数
  const newCommitRemindParam = fastCloneDeep(commitRemindParam);
  dispatch(StoreActions.setPermissionCommitRemindParameter(newCommitRemindParam));

  // 获取无权限人员unitIds
  const state = store.getState();
  const nodeId = commitRemindParam.nodeId || '';
  const unitsIds = newCommitRemindParam.unitRecs.map(unitRec => unitRec.unitIds).flat();
  const noPermissionMemberData = await getNoPermissionMemberList(nodeId, unitsIds);

  const isNotify = !Selectors.getCurrentView(state);

  if (noPermissionMemberData && noPermissionMemberData.length > 0) {
    // 权限预填信息设置
    const noPermissionUnitIds = noPermissionMemberData.map(member => member.unitId);
    dispatch(StoreActions.setNoPermissionMembers(noPermissionUnitIds));

    // 异步补全成员信息
    const unitMap = Selectors.getUnitMap(state);
    const missUnitIds = difference(noPermissionUnitIds, Object.keys(unitMap || {}));
    if (missUnitIds.length) {
      Api.loadOrSearch({ unitIds: missUnitIds.join(',') }).then(res => {
        const {
          data: { data: resData, success },
        } = res;

        if (!resData.length || !success) {
          return;
        }

        dispatch(StoreActions.updateUnitMap(keyBy(resData, 'unitId')));
      });
    }

    // 显示无权限通知
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

  const state = store.getState();
  const permissionCommitRemindStatus = state.catalogTree.permissionCommitRemindStatus;

  const onModalClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement!.removeChild(container);
    if (!permissionCommitRemindStatus) {
      sendRemind();
    }
  };

  ReactDOM.render(
    <Provider store={store}>
      <NotificationVerificationModal {...props} closeModal={onModalClose} />
    </Provider>,
    container,
  );
};

// TODO 这里换一种形式进行实现
export const NotificationVerificationModal: React.FC<IUnitProps> = props => {
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

const MessageContent = ({ members }) => {
  const memberList = members.slice(0, 3);
  return (
    <>
      {memberList.map(member => '@' + member.memberName + ' ')}
      {members.length > 3 && t(Strings.notified_assign_permissions_number, { number: members.length })}
      {t(Strings.unaccess_notified_message)}
    </>
  );
};
