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

import { Modal, Radio, RadioChangeEvent } from 'antd';
import classnames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, IconButton, TextButton, ThemeName } from '@apitable/components';
import { Api, AutoTestID, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { Avatar, AvatarSize, AvatarType } from 'pc/components/common/avatar';
import { Message } from 'pc/components/common/message';
import { Modal as CustomModal } from 'pc/components/common/modal/modal/modal';
import CreateSpace from 'pc/components/create_space/create_space';
import { Router } from 'pc/components/route_manager/router';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import IconNoSpaceDark from 'static/icon/datasheet/space_img_empty_dark.png';
import IconNoSpaceLight from 'static/icon/datasheet/space_img_empty_light.png';
import { IShareSpaceInfo } from '../interface';
import styles from './style.module.less';

enum ModalType {
  Login = 'Login',
  SpaceList = 'SpaceList',
  Tip = 'Tip',
  Create = 'Create',
}

interface IShareSave {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  shareSpace: IShareSpaceInfo;
}

export const ShareSave: React.FC<React.PropsWithChildren<IShareSave>> = (props) => {
  const { visible, setVisible, shareSpace } = props;
  const { shareId } = useAppSelector((state) => state.pageParams);
  const dispatch = useDispatch();
  const [radio, setRadio] = useState('');
  const [spaceList, setSpaceList] = useState<{ spaceId: string; name: string; logo: string }[]>([]);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const env = getEnvVariables();
  const themeName = useAppSelector((state) => state.theme);
  const IconNoSpace = themeName === ThemeName.Light ? IconNoSpaceLight : IconNoSpaceDark;

  const onCancel = () => {
    setRadio('');
    setVisible(false);
  };

  useEffect(() => {
    if (modalType === ModalType.Login) {
      CustomModal.confirm({
        title: t(Strings.kindly_reminder),
        content: t(Strings.require_login_tip),
        okText: t(Strings.go_login),
        onOk: () => {
          if (env.INVITE_USER_BY_AUTH0) {
            Router.push(Navigation.WORKBENCH);
          } else {
            Router.push(Navigation.LOGIN, { query: { reference: window.location.href } });
          }
        },
        onCancel: () => setVisible(false),
        okButtonProps: { id: AutoTestID.GO_LOGIN_BTN },
        type: 'warning',
      });
    }
    // eslint-disable-next-line
  }, [modalType]);

  useEffect(() => {
    if (!shareSpace.hasLogin) {
      setModalType(ModalType.Login);
      return;
    }

    if (!shareSpace.allowSaved) {
      // No permission to dump, close the pop-up after login
      setVisible(false);
    }

    const request = async () => {
      const res = await Api.spaceList();
      const { success, code, message, data } = res.data;
      if (success) {
        if (!data.length) {
          setModalType(ModalType.Tip);
          return;
        }
        setSpaceList(data);
        setModalType(ModalType.SpaceList);
      } else {
        dispatch(
          StoreActions.setHttpErrInfo({
            code,
            msg: message,
          }),
        );
      }
    };
    request();
    // eslint-disable-next-line
  }, [shareSpace.hasLogin]);

  const saveToSpace = async (spaceId?: string) => {
    if (!shareId) return;
    const saveKey = spaceId ? spaceId : radio;
    Message.loading({ content: t(Strings.loading), key: saveKey });
    const res = await Api.storeShareData(shareId, spaceId ? spaceId : radio);
    const { success, message, data } = res.data;
    const toSpace = () => {
      Router.redirect(Navigation.WORKBENCH, {
        params: {
          spaceId: radio,
          nodeId: shareSpace.isFolder ? '' : data.nodeId,
        },
      });
    };
    if (success) {
      Message.success({
        content: (
          <>
            {t(Strings.operate_success)}
            <i onClick={toSpace}>{t(Strings.click_to_view)}</i>
          </>
        ),
        key: saveKey,
      });
      setVisible(false);
      setRadio('');
    } else {
      Message.warning({ content: message, key: saveKey });
      setTimeout(() => {
        reload();
      }, 2000);
    }
  };

  const renderSpaceList = () => {
    const onChange = (e: RadioChangeEvent) => {
      setRadio(e.target.value);
    };

    return (
      <div className={styles.spaceList}>
        <p className={styles.desc}>{t(Strings.check_save_space)}</p>
        <Radio.Group onChange={onChange} value={radio} style={{ width: '100%' }} className={styles.listContainer}>
          {spaceList.map((item) => {
            return (
              <Radio value={item.spaceId} key={item.spaceId} className={styles.listItem}>
                <div className={styles.content}>
                  <Avatar type={AvatarType.Space} title={item.name} id={item.spaceId} src={item.logo} size={AvatarSize.Size32} />
                  <div className={styles.name}>{item.name}</div>
                </div>
              </Radio>
            );
          })}
        </Radio.Group>
        <div className={styles.buttonWrapper}>
          <TextButton
            onClick={() => {
              setVisible(false);
            }}
            style={{ marginRight: '8px' }}
            size="small"
          >
            {t(Strings.cancel)}
          </TextButton>
          <Button
            color="primary"
            size="small"
            onClick={() => {
              saveToSpace();
            }}
          >
            {t(Strings.submit)}
          </Button>
        </div>
      </div>
    );
  };

  const renderNoSpaceTip = () => {
    const onClick = () => {
      setModalType(ModalType.Create);
    };
    return (
      <div className={styles.noSpaceTip}>
        <p className={styles.desc}>
          {t(Strings.check_save_space)}
          <span>{t(Strings.choose_your_own_space)}</span>
        </p>
        <Image src={IconNoSpace} alt="" style={{ margin: '0 auto', display: 'block' }} />
        <p className={styles.tip}>{t(Strings.no_sapce_save)}</p>
        <Button color="primary" size="large" onClick={onClick} className={styles.button}>
          {t(Strings.quickly_create_space)}
        </Button>
      </div>
    );
  };

  const createSpace = async (name: string) => {
    const res = await Api.createSpace(name);
    const { success, message, code, data } = res.data;
    if (success) {
      saveToSpace(data.spaceId);
    } else {
      dispatch(
        StoreActions.setHttpErrInfo({
          code,
          msg: message,
        }),
      );
    }
  };

  const reload = () => {
    window.location.reload();
  };

  // const afterLogin = (data: string, loginMode: ConfigConstant.LoginMode) => {
  //   if (data) {
  //     if (loginMode === ConfigConstant.LoginMode.SMS) {
  //       navigationTo({ path: Navigation.INVITATION_VALIDATION, query: { token: data, reference: window.location.href } });
  //     } else if (loginMode === ConfigConstant.LoginMode.EMAIL) {
  //       navigationTo({ path: Navigation.IMPROVING_INFO, query: { token: data, reference: window.location.href } });
  //     }
  //   } else {
  //     setStorage(StorageName.ShareLoginFailed, false);
  //     reload();
  //   }
  // };

  if (!modalType || modalType === ModalType.Login) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      mask
      maskClosable={false}
      footer={null}
      width={640}
      title={modalType === ModalType.Create || t(Strings.save_document)}
      closeIcon={<IconButton icon={() => <CloseOutlined />} />}
      bodyStyle={{ paddingTop: '0' }}
      onCancel={onCancel}
      className={classnames(modalType === ModalType.SpaceList && styles.spaceListContainer)}
      keyboard
      centered
    >
      {modalType === ModalType.SpaceList && renderSpaceList()}
      {modalType === ModalType.Tip && renderNoSpaceTip()}
      {modalType === ModalType.Create && <CreateSpace isShare submitCb={createSpace} />}
    </Modal>
  );
};
