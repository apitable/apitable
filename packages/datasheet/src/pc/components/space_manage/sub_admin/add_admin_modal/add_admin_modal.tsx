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

import { FC, useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Button, TextButton } from '@apitable/components';
import { Api, IMember, IReduxState, ISubAdminList, Strings, t, UnitItem } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { SelectUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { UnitTag } from 'pc/components/catalog/permission_settings/permission/select_unit_modal/unit_tag';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useEditSubAdmin, useNotificationCreate } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { generateUserInfo } from 'pc/utils';
import { PermissionCard } from '../permission_card';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

const modalTitle = {
  read: t(Strings.sub_admin_view),
  edit: t(Strings.sub_admin_edit),
  add: t(Strings.sub_admin_add),
};

interface IModalProps {
  source: string;
  existSubAdminNum: number;
  cancelModal: () => void;
  editOrReadSubMainInfo?: ISubAdminList | null;
}

export enum ModalType {
  Read = 'read',
  Edit = 'edit',
  Add = 'add',
}

export const AddAdminModal: FC<React.PropsWithChildren<IModalProps>> = ({ cancelModal, editOrReadSubMainInfo, existSubAdminNum, source }) => {
  const { subAdminList, userInfo } = useAppSelector(
    (state: IReduxState) => ({
      subAdminList: state.spacePermissionManage.subAdminListData ? state.spacePermissionManage.subAdminListData.records : [],
      userInfo: state.user.info,
    }),
    shallowEqual,
  );
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const [selectMemberModal, setSelectMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<UnitItem[]>([]);
  const [resourceCodes, setResourceCodes] = useState<string[]>([]);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [selectMemberId, setSelectMemberId] = useState('');

  const handCancel = () => {
    setSubmitBtnLoading(false);
    cancelModal();
  };
  const { addSubAdminAndNotice } = useNotificationCreate({ fromUserId: userInfo!.uuid, spaceId: userInfo!.spaceId });
  const [setEditStart] = useEditSubAdmin(editOrReadSubMainInfo ? editOrReadSubMainInfo.id : '', selectMemberId, resourceCodes, handCancel);
  useEffect(() => {
    if (source !== ModalType.Add && editOrReadSubMainInfo) {
      setSelectMemberId(editOrReadSubMainInfo.memberId);
      Api.subAdminPermission(editOrReadSubMainInfo.memberId).then((res) => {
        const { success, data } = res.data;
        if (success) {
          setResourceCodes(data.resources);
        }
      });
    }
  }, [editOrReadSubMainInfo, source]);

  const modalConfirm = () => {
    if (source === ModalType.Add) {
      const memberIds = selectedMembers.map((item) => (item as IMember).memberId);
      const result = triggerUsageAlert(
        'maxAdminNums',
        { usage: memberIds.length + existSubAdminNum, alwaysAlert: true },
        SubscribeUsageTipType.Alert,
      );
      if (result) return;
      setSubmitBtnLoading(true);
      addSubAdminAndNotice(memberIds, resourceCodes, handCancel);
      return;
    }
    if (source === ModalType.Edit) {
      setSubmitBtnLoading(true);
      setEditStart?.(true);
      return;
    }
    handCancel();
  };

  const permissionChange = (value: string, checked: boolean) => {
    let tempSelects = [...resourceCodes];
    if (checked && !tempSelects.includes(value)) {
      tempSelects.push(value);
    }
    if (!checked && tempSelects.includes(value)) {
      tempSelects = tempSelects.filter((item) => item !== value);
    }
    setResourceCodes(tempSelects);
  };
  const selectMemberSubmit = (checkedList: UnitItem[]) => {
    // if (source === ModalType.Add && checkedList.length > optionalCount){
    //   BillingModal();
    //   return;
    // }
    setSelectedMembers(checkedList);
  };
  const selectMemberCancel = () => {
    setSelectMemberModal(false);
  };
  const delSelected = (id: string) => {
    const newSelected = selectedMembers.filter((item) => item.unitId !== id);
    setSelectedMembers(newSelected);
  };
  const getDisableIdList = () => {
    if (subAdminList.length > 0) {
      const subMainListId = subAdminList.map((item) => item.memberId);
      subMainListId.push(userInfo!.memberId);
      return subMainListId;
    }
    return [userInfo!.memberId];
  };
  const title =
    source !== ModalType.Add && editOrReadSubMainInfo
      ? getSocialWecomUnitName?.({
        name: editOrReadSubMainInfo?.memberName,
        isModified: editOrReadSubMainInfo?.isMemberNameModified,
        spaceInfo,
      }) || editOrReadSubMainInfo?.memberName
      : '';
  return (
    <>
      <Modal
        footer={null}
        visible
        onCancel={handCancel}
        title={<div>{modalTitle[source]}</div>}
        className={styles.addAdminModal}
        centered
        maskClosable
        width={640}
      >
        {source !== ModalType.Add && editOrReadSubMainInfo ? (
          <UnitTag
            key={editOrReadSubMainInfo.memberId}
            unitId={editOrReadSubMainInfo.memberId}
            avatar={editOrReadSubMainInfo.avatar}
            avatarColor={editOrReadSubMainInfo.avatarColor}
            name={editOrReadSubMainInfo.memberName}
            nickName={editOrReadSubMainInfo.nickName}
            deletable={false}
            title={title}
          />
        ) : (
          <>
            <Button
              size="small"
              onClick={() => setSelectMemberModal(true)}
              prefixIcon={<AddOutlined size={12} color="currentColor" className={styles.addBtnIcon} />}
            >
              {t(Strings.add_member)}
            </Button>
            <div className={styles.selectedWrapper}>
              {selectedMembers.length > 0 &&
                selectedMembers.map((item) => {
                  const userInfo = generateUserInfo(item);
                  const title =
                    getSocialWecomUnitName({
                      name: (item as IMember)?.originName,
                      isModified: (item as IMember)?.isMemberNameModified,
                      spaceInfo,
                    }) || (item as IMember)?.originName;
                  return (
                    <UnitTag
                      key={item.unitId}
                      unitId={item.unitId}
                      avatar={userInfo.avatar}
                      avatarColor={userInfo.avatarColor}
                      nickName={userInfo.nickName}
                      name={userInfo.name}
                      className={styles.selectedUnit}
                      onClose={delSelected}
                      title={title}
                    />
                  );
                })}
            </div>
          </>
        )}

        <div className={styles.pageTitle}>{t(Strings.permission_setting)}</div>
        <PermissionCard onChange={permissionChange} defaultChecked={resourceCodes} checked={resourceCodes} inRead={source === ModalType.Read} />
        {source !== ModalType.Read && (
          <div className={styles.btnWrapper}>
            <TextButton onClick={handCancel} size="small">
              {t(Strings.cancel)}
            </TextButton>
            <Button
              onClick={modalConfirm}
              color="primary"
              className={styles.confirmBtn}
              disabled={resourceCodes.length === 0 || (selectedMembers.length === 0 && source === ModalType.Add) || submitBtnLoading}
              size="small"
              loading={submitBtnLoading}
            >
              {t(Strings.submit)}
            </Button>
          </div>
        )}
      </Modal>
      {selectMemberModal && (
        <SelectUnitModal
          source={SelectUnitSource.Admin}
          onSubmit={selectMemberSubmit}
          onCancel={selectMemberCancel}
          checkedList={selectedMembers}
          disableIdList={getDisableIdList()}
        />
      )}
    </>
  );
};
