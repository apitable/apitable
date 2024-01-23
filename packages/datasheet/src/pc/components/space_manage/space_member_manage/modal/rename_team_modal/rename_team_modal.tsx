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

import * as React from 'react';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Api, ConfigConstant, IReduxState, MAX_NAME_STRING_LENGTH, StoreActions, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { WithTipTextInput } from 'pc/components/common/input/with_tip_input';
import { NormalModal } from 'pc/components/common/modal/normal_modal';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { verifyTeamName } from '../../utils';

interface IModalProps {
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export const RenameTeamModal: FC<React.PropsWithChildren<IModalProps>> = (props) => {
  const dispatch = useAppDispatch();
  const [err, setErr] = useState('');
  const { spaceId, user, rightClickTeamInfoInSpace } = useAppSelector(
    (state: IReduxState) => ({
      spaceId: state.space.activeId || '',
      rightClickTeamInfoInSpace: state.spaceMemberManage.rightClickTeamInfoInSpace,
      user: state.user.info,
    }),
    shallowEqual,
  );
  const [inputContent, setInputContent] = useState(rightClickTeamInfoInSpace.teamTitle);

  const handleOk = () => {
    if (inputContent.length > MAX_NAME_STRING_LENGTH) {
      setErr(t(Strings.team_length_err));
      return;
    }
    const { teamId, parentId } = rightClickTeamInfoInSpace;
    const parent = parentId ? parentId : ConfigConstant.ROOT_TEAM_ID;
    verifyTeamName(spaceId, parent, inputContent).then((res) => {
      if (res) {
        setErr(t(Strings.team_is_exist_err));
      } else {
        Api.updateTeamInfo(teamId, parent, inputContent).then((res) => {
          const { success } = res.data;
          if (success) {
            if (parentId) {
              dispatch(StoreActions.getSubTeam(parentId));
            } else {
              dispatch(StoreActions.getTeamListData(user!));
            }
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
