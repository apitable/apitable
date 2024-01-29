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

import { FC, useState } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { t, Strings, IReduxState, MAX_NAME_STRING_LENGTH, ConfigConstant } from '@apitable/core';
import { WithTipTextInput } from 'pc/components/common/input/with_tip_input';
import { NormalModal } from 'pc/components/common/modal/normal_modal';
import { useCreateSubTeam } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { verifyTeamName } from '../../utils';

interface IModalProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export const CreateTeamModal: FC<React.PropsWithChildren<IModalProps>> = (props) => {
  const [inputContent, setInputContent] = useState('');
  const [err, setErr] = useState('');
  const { spaceId, rightClickTeamInfoInSpace } = useAppSelector(
    (state: IReduxState) => ({
      spaceId: state.space.activeId || '',
      user: state.user.info,
      rightClickTeamInfoInSpace: state.spaceMemberManage.rightClickTeamInfoInSpace,
    }),
    shallowEqual,
  );
  const teamId = rightClickTeamInfoInSpace.teamId ? rightClickTeamInfoInSpace.teamId : ConfigConstant.ROOT_TEAM_ID;
  const { createTeam } = useCreateSubTeam(inputContent, teamId);

  const validCreate = () => {
    createTeam().then(() => {
      props.setModalVisible(false);
    });
  };
  const handleOk = () => {
    if (inputContent.length > MAX_NAME_STRING_LENGTH) {
      setErr(t(Strings.team_length_err));
      return;
    }
    verifyTeamName(spaceId, teamId, inputContent).then((res) => {
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
