import { Button } from '@vikadata/components';
import { Api, IReduxState, Navigation, StoreActions, Strings, t } from '@apitable/core';
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
import CreateSpaceIcon from 'static/icon/space/space_img_nickname.png';
import { isSocialDomain } from '../home/social_platform';
import styles from './style.module.less';

interface ICreateSpace {
  isShare?: boolean;
  submitCb?: (name: string) => Promise<void>;
}

const CreateSpace: FC<ICreateSpace> = props => {
  const [disabled, setDisabled] = useState(true);
  const [spaceName, setSpaceName] = useState('');
  const dispatch = useDispatch();
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
      if (isSocialDomain()) {
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
          <Logo size='large' />
        </div>
      }

      <div className={styles.formBox} style={{ marginTop: props.isShare ? 0 : '' }}>
        <span className={styles.createSpaceIcon}>
          <Image src={CreateSpaceIcon} alt={t(Strings.create_workspace)} width={266} height={200} />
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
