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

import { FC, useState, useEffect } from 'react';
import * as React from 'react';
import { Form } from 'antd';
import styles from './style.module.less';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { IReduxState, StoreActions, Api, t, Strings, ConfigConstant } from '@apitable/core';
import { Message, NormalModal, WithTipTextInput } from 'pc/components/common';
import { useRequest } from 'pc/hooks';
import { useUserRequest } from 'pc/hooks';
import { usePlatform } from 'pc/hooks/use_platform';

export interface IModifyNameModalProps {
  setNameModal: React.Dispatch<React.SetStateAction<boolean>>;
  originName: string;
}

export const ModifyNameModal: FC<React.PropsWithChildren<IModifyNameModalProps>> = props => {
  const { setNameModal, originName } = props;
  const { getLoginStatusReq } = useUserRequest();
  const { err, loading } = useSelector((state: IReduxState) => ({
    err: state.user.err,
    loading: state.user.loading,
    user: state.user.info,
  }), shallowEqual);
  const [name, setName] = useState(originName);
  const [disable, setDisable] = useState(true);
  const [isLimit, setLimit] = useState(false);
  const dispatch = useDispatch();
  const { run: updateNickName } = useRequest(nickName => Api.updateUser({ nickName, init: false }).then(res => {
    const { success, code, message } = res.data;
    if (success) {
      dispatch(StoreActions.updateUserInfo({ nickName, isNickNameModified: true }));
      Message.success({ content: t(Strings.nickname_modified_successfully) });
      getLoginStatusReq();
      handleCancel();
    } else {
      dispatch(StoreActions.setHomeErr({ code, msg: message }));
    }
  }), { manual: true });

  const handleCancel = () => {
    setNameModal(false);
  };

  useEffect(() => {
    if (err) {
      setDisable(true);
    }
  }, [err]);

  useEffect(() => {
    if (name.trim().length) {
      setDisable(false);
      return;
    }
    setDisable(true);
  }, [name, dispatch, err]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (err) {
      dispatch(StoreActions.setHomeErr(null));
    }
    const value = e.target.value;
    setLimit(value.length > ConfigConstant.MEMBER_NAME_LENGTH);
    setName(value);
  };

  const handleSubmit = () => {
    updateNickName(name.trim());
  };

  const { desktop } = usePlatform();

  return (
    <NormalModal
      title={t(Strings.modal_title_modify_nickname)}
      visible
      className={styles.modifyNameWrapper}
      maskClosable={false}
      onCancel={handleCancel}
      centered={desktop}
      okButtonProps={{ disabled: disable, loading }}
      onOk={handleSubmit}
    >
      <Form onFinish={handleSubmit}>
        <WithTipTextInput
          onChange={handleChange}
          placeholder={t(Strings.placeholder_input_new_nickname)}
          value={name}
          autoFocus
          onFocus={e => e.target.select()}
          error={Boolean(err)}
          helperText={err ? err.msg : isLimit ? t(Strings.member_err) : ''}
          block
        />
      </Form>
    </NormalModal>
  );
};
