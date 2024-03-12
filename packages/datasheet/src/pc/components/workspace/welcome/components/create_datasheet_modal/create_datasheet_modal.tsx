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
import { FC, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Api, ConfigConstant, IReduxState, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { NormalModal, WithTipTextInput } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';

import { useAppSelector } from 'pc/store/react-redux';

export interface ICreateDataSheetModalProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateDataSheetModal: FC<React.PropsWithChildren<ICreateDataSheetModalProps>> = (props) => {
  const { setShow } = props;
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const spaceId = useAppSelector((state) => state.space.activeId);
  const [error, setError] = useState('');
  const { run: addNode } = useRequest(
    (parentId: string, type: number, nodeName?: string, preNodeId?: string, extra?: { [key: string]: any }) =>
      Api.addNode({ parentId, type, nodeName, preNodeId, extra }).then((res) => {
        const { data, message, success } = res.data;
        if (success) {
          dispatch(StoreActions.addNode(data));
          dispatch(StoreActions.setEditNodeId(''));
          if (type === ConfigConstant.NodeType.DATASHEET) {
            Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId: data.nodeId } });
          }
        } else {
          setError(message);
        }
      }),
    { manual: true },
  );
  const { parentId } = useAppSelector(
    (state: IReduxState) => ({
      parentId: state.catalogTree.rootId,
    }),
    shallowEqual,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (error) {
      setError('');
    }
    setName(value);
    if (value.length === 0) {
      setError(t(Strings.name_length_err));
    }
  };

  const handleCancel = () => {
    setShow(false);
  };

  const handleSubmit = () => {
    if (error) {
      return;
    }
    addNode(parentId, ConfigConstant.NodeType.DATASHEET, name, undefined, { viewName: t(Strings.default_view) });
  };

  return (
    <NormalModal
      title={t(Strings.new_datasheet)}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={t(Strings.submit)}
      cancelText={t(Strings.cancel)}
      centered
      visible
    >
      <WithTipTextInput
        placeholder={t(Strings.placeholder_input_datasheet_name)}
        value={name}
        onChange={handleChange}
        error={Boolean(error)}
        helperText={error}
        block
      />
    </NormalModal>
  );
};
