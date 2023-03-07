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

import { Button, ThemeName } from '@apitable/components';
import { Api, IReduxState, Navigation, StoreActions, Strings, t, Selectors } from '@apitable/core';
import { Form, Input } from 'antd';
import Image from 'next/image';
import { Logo } from 'pc/components/common';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { useRequest } from 'pc/hooks';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CreateSpaceIconLight from 'static/icon/space/space_add_name_light.png';
import CreateSpaceIconDark from 'static/icon/space/space_add_name_dark.png';

// @ts-ignore
import { isSocialDomain } from 'enterprise';
import styles from './style.module.less';

interface ICreateSpace {
  isShare?: boolean;
  submitCb?: (name: string) => Promise<void>;
}

const CreateSpace: FC<React.PropsWithChildren<ICreateSpace>> = props => {
  const [disabled, setDisabled] = useState(true);
  const [spaceName, setSpaceName] = useState('');
  const dispatch = useDispatch();
  const themeName = useSelector(state => state.theme);
  const CreateSpaceIcon = themeName === ThemeName.Light ? CreateSpaceIconLight : CreateSpaceIconDark;
  const theme = useSelector(Selectors.getTheme);

  const { isCreateSpace, err, user } = useSelector((state: IReduxState) => ({
    isCreateSpace: state.user.isCreateSpace,
    err: state.space.err,
    user: state.user.info,
  }), shallowEqual);
  const { run: toGetUser } = useRequest((spaceId) => Api.getUserMe({ spaceId }).then(res => {
    const { data, success } = res.data;
    if (success) {
      navigationToUrl(`${window.location.protocol}//${data.spaceDomain}/space/${data.spaceId}`, { method: Method.Redirect });
    }
  }), { manual: true });
  const { run: createSpace } = useRequest((name: string) => Api.createSpace(name).then(res => {
    const { success, code, message, data } = res.data;
    if (success) {
      if (isSocialDomain?.()) {
        toGetUser(data.spaceId);
        return;
      }
      dispatch(StoreActions.updateUserInfo({ needCreate: false }));
      Router.push(Navigation.WORKBENCH, { params: { spaceId: data.spaceId }});
    } else {
      dispatch(StoreActions.setSpaceErr({
        code,
        msg: message,
      }));
    }
  }), { manual: true });

  useEffect(() => {
    if (spaceName) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [spaceName]);

  useEffect(() => {
    if (isCreateSpace && user) {
      Router.push(Navigation.HOME);
    }
  }, [isCreateSpace, dispatch, user]);

  const handleSubmit = () => {
    setDisabled(true);
    props.submitCb ? props.submitCb(spaceName) :
      createSpace(spaceName);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (err) {
      dispatch(StoreActions.setSpaceErr(null));
    }
    const content = (e.target as HTMLInputElement).value;
    setSpaceName(content);
  };

  return (
    <div className={styles.createSpaceWrapper}>
      {
        !props.isShare &&
        <div className={styles.logo}>
          <Logo size='large' theme={theme} />
        </div>
      }

      <div className={styles.formBox} style={{ marginTop: props.isShare ? 0 : '' }}>
        <span className={styles.createSpaceIcon}>
          <Image src={CreateSpaceIcon} alt={t(Strings.create_workspace)} width={320} height={240} />
        </span>
        <div className={styles.title}>{t(Strings.create_workspace)}</div>
        <div className={styles.subTitle}>{t(Strings.create_space_sub_title)}~</div>
        <Form>
          <Input
            className={err ? 'error' : ''}
            onChange={handleChange}
            placeholder={t(Strings.enter_workspace_name)}
            type='primary'
          />
          <div className={styles.errorMsg}>
            {err ? err.msg : ''}
          </div>
          <Button
            className={styles.createSpaceBtn}
            color='primary'
            disabled={disabled}
            block
            type='submit'
            onClick={handleSubmit}
          >
            {props.isShare ? t(Strings.create_and_save) : t(Strings.create)}
          </Button>
        </Form>
        <div className={styles.tip}>{t(Strings.change_space_name_tip)}</div>
      </div>
    </div>
  );
};

export default CreateSpace;
