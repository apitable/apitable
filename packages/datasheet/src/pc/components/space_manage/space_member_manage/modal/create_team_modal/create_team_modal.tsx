import { FC, useState } from 'react';
import * as React from 'react';
import { t, Strings, IReduxState, MAX_NAME_STRING_LENGTH, ConfigConstant } from '@apitable/core';
import { useSelector, shallowEqual } from 'react-redux';
import { NormalModal, WithTipTextInput } from 'pc/components/common';
import { verifyTeamName } from '../../utils';
import { useCreateSubTeam } from 'pc/hooks';

interface IModalProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export const CreateTeamModal: FC<IModalProps> = props => {
  const [inputContent, setInputContent] = useState('');
  const [err, setErr] = useState('');
  const {
    spaceId,
    user,
    rightClickTeamInfoInSpace,
  } = useSelector((state: IReduxState) => ({
    spaceId: state.space.activeId || '',
    user: state.user.info,
    rightClickTeamInfoInSpace: state.spaceMemberManage.rightClickTeamInfoInSpace,
  }), shallowEqual);
  const teamId = rightClickTeamInfoInSpace.teamId ? rightClickTeamInfoInSpace.teamId : ConfigConstant.ROOT_TEAM_ID;
  const [setStart] = useCreateSubTeam(inputContent, spaceId, teamId, user!);

  const validCreate = () => {
    setStart(true);
    setTimeout(() => {
      props.setModalVisible(false);
    });
  };
  const handleOk = () => {
    if (inputContent.length > MAX_NAME_STRING_LENGTH) {
      setErr(t(Strings.team_length_err));
      return;
    }
    verifyTeamName(spaceId, teamId, inputContent).then(res => {
      res && setErr(t(Strings.team_is_exist_err));
      !res && validCreate();
    });
  };

  const handleCancel = () => {
    props.setModalVisible(false);
  };
  return (
    <NormalModal
      title={t(Strings.add_team)}
      subTitle={`${t(Strings.superior_team)}：${rightClickTeamInfoInSpace.teamTitle}`}
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{ disabled: !inputContent }}
      maskClosable
    >
      <WithTipTextInput
        placeholder={t(Strings.placeholder_input_team_name)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputContent(e.target.value)}
        value={inputContent}
        error={Boolean(err)}
        helperText={err}
        block
      />
    </NormalModal>
  );
};
