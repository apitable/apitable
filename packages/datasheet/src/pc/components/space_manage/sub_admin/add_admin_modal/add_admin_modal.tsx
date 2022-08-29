import { FC, useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { t, Strings, Api, IReduxState, UnitItem, IMember, ISubAdminList } from '@vikadata/core';
import { Modal } from 'pc/components/common';
import { Button, TextButton } from '@vikadata/components';
import styles from './style.module.less';
import { useNotificationCreate, useEditSubAdmin } from 'pc/hooks';
import { PermissionCard } from '../permission_card';
import { generateUserInfo } from 'pc/utils';
import { SelectUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { UnitTag } from 'pc/components/catalog/permission_settings/permission/select_unit_modal/unit_tag';
import AddIcon from 'static/icon/common/common_icon_add_content.svg';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
const modalTitle = {
  read: t(Strings.sub_admin_view),
  edit: t(Strings.sub_admin_edit),
  add: t(Strings.sub_admin_add),
};
interface IModalProps {
  cancelModal: () => void;
  editOrReadSubMainInfo?: ISubAdminList | null;
  source: string;
  optionalCount?: number;
}
export enum ModalType {
  Read = 'read',
  Edit = 'edit',
  Add = 'add',
}

export const AddAdminModal: FC<IModalProps> = ({ cancelModal, editOrReadSubMainInfo, source }) => {
  const { subAdminList, userInfo } = useSelector((state: IReduxState) => ({
    subAdminList: state.spacePermissionManage.subAdminListData ?
      state.spacePermissionManage.subAdminListData.records : [],
    userInfo: state.user.info,
  }), shallowEqual);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
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
  const [setEditStart] = useEditSubAdmin(editOrReadSubMainInfo ? editOrReadSubMainInfo.id : '',
    selectMemberId, resourceCodes, handCancel);
  useEffect(() => {
    if (source !== ModalType.Add && editOrReadSubMainInfo) {
      setSelectMemberId(editOrReadSubMainInfo.memberId);
      Api.subAdminPermission(editOrReadSubMainInfo.memberId).then(res => {
        const { success, data } = res.data;
        if (success) {
          setResourceCodes(data.resources);
        }
      });
    }
  }, [editOrReadSubMainInfo, source]);
  const modalConfirm = () => {
    if (source === ModalType.Add) {
      setSubmitBtnLoading(true);
      const memberIds = selectedMembers.map(item => (item as IMember).memberId);
      addSubAdminAndNotice(memberIds, resourceCodes, handCancel);
      return;
    }
    if (source === ModalType.Edit) {
      setSubmitBtnLoading(true);
      setEditStart(true);
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
      tempSelects = tempSelects.filter(item => item !== value);
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
    const newSelected = selectedMembers.filter(item => item.unitId !== id);
    setSelectedMembers(newSelected);
  };
  const getDisableIdList = () => {
    if (subAdminList.length > 0) {
      const subMainListId = subAdminList.map(item => item.memberId);
      subMainListId.push(userInfo!.memberId);
      return subMainListId;
    } 
    return [userInfo!.memberId];
    
  };
  const title = source !== ModalType.Add && editOrReadSubMainInfo ? getSocialWecomUnitName({
    name: editOrReadSubMainInfo?.memberName,
    isModified: editOrReadSubMainInfo?.isMemberNameModified,
    spaceInfo
  }) : '';
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
        {
          source !== ModalType.Add && editOrReadSubMainInfo ?
            (
              <UnitTag
                key={editOrReadSubMainInfo.memberId}
                unitId={editOrReadSubMainInfo.memberId}
                avatar={editOrReadSubMainInfo.avatar}
                name={editOrReadSubMainInfo.memberName}
                deletable={false}
                title={title}
              />
            )
            : (
              <>
                <Button size="small" onClick={() => setSelectMemberModal(true)} prefixIcon={<AddIcon fill="currentColor" />}>
                  {t(Strings.add_member)}
                </Button>
                <div className={styles.selectedWrapper}>
                  {selectedMembers.length > 0 && selectedMembers.map(item => {
                    const userInfo = generateUserInfo(item);
                    const title = getSocialWecomUnitName({
                      name: (item as IMember)?.originName,
                      isModified: (item as IMember)?.isMemberNameModified,
                      spaceInfo
                    });
                    return (
                      <UnitTag
                        key={item.unitId}
                        unitId={item.unitId}
                        avatar={userInfo.avatar}
                        name={userInfo.name}
                        className={styles.selectedUnit}
                        onClose={delSelected}
                        title={title}
                      />
                    );
                  })}
                </div>
              </>
            )
        }

        <div className={styles.pageTitle}>{t(Strings.permission_setting)}</div>
        <PermissionCard
          onChange={permissionChange}
          defaultChecked={resourceCodes}
          checked={resourceCodes}
          inRead={source === ModalType.Read}
        />
        {
          source !== ModalType.Read &&
          (
            <div className={styles.btnWrapper}>
              <TextButton onClick={handCancel} size="small">{t(Strings.cancel)}</TextButton>
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
          )
        }
      </Modal>
      {
        selectMemberModal &&
        (
          <SelectUnitModal
            source={SelectUnitSource.Admin}
            onSubmit={selectMemberSubmit}
            onCancel={selectMemberCancel}
            checkedList={selectedMembers}
            disableIdList={getDisableIdList()}
          />
        )
      }
    </>
  );
};
