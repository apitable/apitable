import { FC, useState, Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import { t, Strings, StoreActions, IReduxState, MAX_NAME_STRING_LENGTH, Api, ConfigConstant } from '@apitable/core';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NormalModal, Message, WithTipTextInput } from 'pc/components/common';
import { verifyTeamName } from '../../utils';

interface IModalProps {
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export const RenameTeamModal: FC<IModalProps> = props => {
  const dispatch = useDispatch();
  const [err, setErr] = useState('');
  const {
    spaceId,
    rightClickTeamInfoInSpace,
    user,
  } = useSelector((state: IReduxState) => ({
    spaceId: state.space.activeId || '',
    rightClickTeamInfoInSpace: state.spaceMemberManage.rightClickTeamInfoInSpace,
    user: state.user.info,
  }), shallowEqual);
  const [inputContent, setInputContent] = useState(rightClickTeamInfoInSpace.teamTitle);

  const handleOk = () => {
    if (inputContent.length > MAX_NAME_STRING_LENGTH) {
      setErr(t(Strings.team_length_err));
      return;
    }
    const { teamId, parentId } = rightClickTeamInfoInSpace;
    const parent = parentId ? parentId : ConfigConstant.ROOT_TEAM_ID;
    verifyTeamName(spaceId, parent, inputContent).then(res => {
      if (res) {
        setErr(t(Strings.team_is_exist_err));
      } else {
        Api.updateTeamInfo(teamId, parent, inputContent).then(res => {
          const { success } = res.data;
          if (success) {
            user && dispatch(StoreActions.getTeamListDataInSpace(spaceId, user));
            props.setModalVisible(false);
            Message.success({ content: t(Strings.rename_team_success) });
          } else {
            Message.error({ content: t(Strings.rename_team_fail) });
          }
        });
      }
    });
  };
  const handleCancel = () => {
    props.setModalVisible(false);
  };

  return (
    <NormalModal
      title={t(Strings.rename_team)}
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{ disabled: !inputContent || inputContent === rightClickTeamInfoInSpace.teamTitle }}
      maskClosable
    >
      <WithTipTextInput
        value={inputContent}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputContent(e.target.value)}
        error={Boolean(err)}
        helperText={err}
        block
      />
    </NormalModal>
  );
};
