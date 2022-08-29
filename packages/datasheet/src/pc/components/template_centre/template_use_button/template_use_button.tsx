import { IReduxState, Navigation, Player, Events, t, Strings, ConfigConstant, AutoTestID } from '@vikadata/core';
import { Modal } from 'pc/components/common';
import { Button } from '@vikadata/components';
import { LoginModal } from 'pc/components/home/login_modal';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useUserRequest } from 'pc/hooks';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import IconArrowRight from 'static/icon/datasheet/rightclick/datasheet_icon_insert_right.svg';
import { UsingTemplateModal } from '../using_template_modal';
import styles from './style.module.less';
import { useRequest } from 'pc/hooks';

interface ITemplateUseButtonProps {
  style?: React.CSSProperties;
  showIcon?: boolean;
  id?: string;
  block?: boolean;
}

export const TemplateUseButton: React.FC<ITemplateUseButtonProps> = props => {
  const { style, showIcon, children, id, block } = props;
  const userInfo = useSelector((state: IReduxState) => state.user.info);
  const spaceId = useSelector(state => state.space.activeId);
  const { templateId, categoryId } = useSelector((state: IReduxState) => state.pageParams);
  // 打开使用模板弹窗
  const [openTemplateModal, setOpenTemplateModal] = useState('');
  // 打开登录模态框
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const navigationTo = useNavigation();
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest(getLoginStatusReq, { manual: true });

  useEffect(() => {
    if (!openTemplateModal) {
      return;
    }
    Player.doTrigger(Events.template_use_confirm_modal_shown);
  }, [openTemplateModal]);

  const openUseTemplateModal = () => {
    // 当前用户未登录时
    if (!userInfo) {
      Modal.confirm({
        title: t(Strings.kindly_reminder),
        content: t(Strings.require_login_tip),
        okText: t(Strings.go_login),
        onOk: () => {
          navigationTo({ path: Navigation.LOGIN, query: { reference: window.location.href }});
        },
        okButtonProps: { id: AutoTestID.GO_LOGIN_BTN },
        type: 'warning'
      });
      return;
    }
    // 当前用户已登录时
    if (!spaceId && templateId) {
      navigationTo({ path: Navigation.TEMPLATE, params: { categoryId, templateId, spaceId: userInfo!.spaceId }});
      return;
    }
    setOpenTemplateModal(templateId!);
  };

  const afterLogin = async(data: string, loginMode: ConfigConstant.LoginMode) => {
    if (data) {
      if (loginMode === ConfigConstant.LoginMode.PHONE) {
        navigationTo({ path: Navigation.INVITATION_VALIDATION, query: { token: data, reference: window.location.href }});
      } else if (loginMode === ConfigConstant.LoginMode.MAIL) {
        navigationTo({ path: Navigation.IMPROVING_INFO, query: { token: data, reference: window.location.href }});
      }
    } else {
      const userInfo = await getLoginStatus();
      if (!userInfo) {
        return;
      }
      navigationTo({ path: Navigation.TEMPLATE, params: { categoryId, templateId, spaceId: userInfo!.spaceId }});
    }
  };

  return (
    <>
      <div
        onClick={openUseTemplateModal}
        id={id}
        className={styles.usingBtn}
        style={style}
      >
        {children ? children :
          <Button
            style={{ ...style }}
            block={block}
            color="warning"
          >
            {t(Strings.apply_template)}
            {showIcon && <IconArrowRight fill="white" />}
          </Button>
        }

      </div>
      {
        openTemplateModal &&
        <div>
          <UsingTemplateModal
            templateId={templateId!}
            onCancel={setOpenTemplateModal}
          />
        </div>
      }
      {
        openLoginModal &&
        <LoginModal
          onCancel={() => setOpenLoginModal(false)}
          afterLogin={afterLogin}
        />
      }
    </>
  );
};
