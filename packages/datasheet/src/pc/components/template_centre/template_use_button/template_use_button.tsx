import { Button } from '@apitable/components';
import { AutoTestID, ConfigConstant, Events, IReduxState, ITemplateTree, Navigation, Player, Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common';
import { LoginModal } from 'pc/components/home/login_modal';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useUserRequest } from 'pc/hooks';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import IconArrowRight from 'static/icon/datasheet/rightclick/datasheet_icon_insert_right.svg';
import { UsingTemplateModal } from '../using_template_modal';
import styles from './style.module.less';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise';

interface ITemplateUseButtonProps {
  style?: React.CSSProperties;
  showIcon?: boolean;
  id?: string;
  block?: boolean;
}

const calcNodeNum = (directory: ITemplateTree[]) => {
  return directory.reduce<number>((total, cur) => {
    if (!cur.children.length) {
      return total + 1;
    }
    return total + calcNodeNum(cur.children);
  }, 0);
};

export const TemplateUseButton: React.FC<ITemplateUseButtonProps> = props => {
  const { style, showIcon, children, id, block } = props;
  const userInfo = useSelector((state: IReduxState) => state.user.info);
  const spaceId = useSelector(state => state.space.activeId);
  const { templateId, categoryId } = useSelector((state: IReduxState) => state.pageParams);
  const [openTemplateModal, setOpenTemplateModal] = useState('');
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const templateDirectory = useSelector(state => state.templateCentre.directory);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest(getLoginStatusReq, { manual: true });

  const nodeNumber = useMemo(() => {
    return calcNodeNum(templateDirectory!.nodeTree.children);
  }, [templateDirectory]);

  useEffect(() => {
    if (!openTemplateModal) {
      return;
    }
    Player.doTrigger(Events.template_use_confirm_modal_shown);
  }, [openTemplateModal]);

  const openUseTemplateModal = () => {
    // Current user is not logged in
    if (!userInfo) {
      Modal.confirm({
        title: t(Strings.kindly_reminder),
        content: t(Strings.require_login_tip),
        okText: t(Strings.go_login),
        onOk: () => {
          Router.push(Navigation.LOGIN, { query: { reference: window.location.href }});
        },
        okButtonProps: { id: AutoTestID.GO_LOGIN_BTN },
        type: 'warning'
      });
      return;
    }
    // Current user is logged in
    if (!spaceId && templateId) {
      Router.push(Navigation.TEMPLATE, { params: { categoryId, templateId, spaceId: userInfo!.spaceId }});
      return;
    }
    const result = triggerUsageAlert('maxSheetNums', { usage: spaceInfo!.sheetNums + nodeNumber, alwaysAlert: true }, SubscribeUsageTipType.Alert);
    if (result) {
      return;
    }
    setOpenTemplateModal(templateId!);
  };

  const afterLogin = async(data: string, loginMode: ConfigConstant.LoginMode) => {
    if (data) {
      if (loginMode === ConfigConstant.LoginMode.PHONE) {
        Router.push(Navigation.INVITATION_VALIDATION, { query: { token: data, reference: window.location.href }});
      } else if (loginMode === ConfigConstant.LoginMode.MAIL) {
        Router.push(Navigation.IMPROVING_INFO, { query: { token: data, reference: window.location.href }});
      }
    } else {
      const userInfo = await getLoginStatus();
      if (!userInfo) {
        return;
      }
      Router.push(Navigation.TEMPLATE, { params: { categoryId, templateId, spaceId: userInfo!.spaceId }});
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
            color='warning'
          >
            {t(Strings.apply_template)}
            {showIcon && <IconArrowRight fill='white' />}
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
