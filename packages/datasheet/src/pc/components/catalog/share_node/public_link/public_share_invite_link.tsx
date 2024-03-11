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

import { useRequest } from 'ahooks';
import { Tooltip } from 'antd';
import { FC, useState, useCallback } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { Skeleton, IconButton, Button, LinkButton, DoubleSelect, IDoubleOptions, Switch, Typography, useThemeColors } from '@apitable/components';
import { Api, Navigation, IReduxState, IShareSettings, StoreActions, Strings, t, ConfigConstant } from '@apitable/core';
import {
  CodeOutlined,
  LinkOutlined,
  QrcodeOutlined,
  NewtabOutlined,
  CheckOutlined,
  ChevronDownOutlined,
  QuestionCircleOutlined,
} from '@apitable/icons';
import { Message, MobileSelect, Popconfirm } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { Router } from 'pc/components/route_manager/router';
import { automationReg, useCatalogTreeRequest, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { DisabledShareFile } from '../disabled_share_file/disabled_share_file';
import { ShareQrCode } from '../share_qr_code';
// @ts-ignore
import { WidgetEmbed } from 'enterprise/chat/widget_embed';
import styles from './style.module.less';

export interface IPublicShareLinkProps {
  nodeId: string;
}

export const autIdReg = /(aut\w{8,})/;

export const getRegResult = (path: string, reg: RegExp) => {
  const r = path.match(reg);
  return r ? r[1] : undefined;
};

export const PublicShareInviteLink: FC<React.PropsWithChildren<IPublicShareLinkProps>> = ({ nodeId }) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [deleting, setDeleting] = useState(false);
  const [shareStatus, setShareStatus] = useState(false);
  const dispatch = useDispatch();
  const [WidgetEmbedVisible, setWidgetEmbedVisible] = useState(false);
  const isAI = nodeId.startsWith(ConfigConstant.NodeTypeReg.AI);

  const automationId = getRegResult('/'+nodeId, autIdReg);
  const hideShareCodeModal = useCallback(() => {
    setWidgetEmbedVisible(false);
  }, []);
  const colors = useThemeColors();
  const { getShareSettingsReq } = useCatalogTreeRequest();
  const { run: getShareSettings, data: shareSettings } = useRequest<IShareSettings, any>(() => getShareSettingsReq(nodeId));
  const { userInfo, treeNodesMap, spaceFeatures } = useAppSelector(
    (state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      userInfo: state.user.info,
      spaceFeatures: state.space.spaceFeatures,
    }),
    shallowEqual,
  );

  const isShareMirror = nodeId.startsWith('mir');
  const shareHost = `${window.location.protocol}//${window.location.host}/share/`;

  const handleUpdateShareStatus = (status: boolean) => {
    dispatch(StoreActions.updateTreeNodesMap(nodeId, { nodeShared: status }));
    if (nodeId.startsWith('mir')) {
      dispatch(StoreActions.updateMirror(nodeId, { nodeShared: status }));
      return;
    }
    dispatch(StoreActions.updateDatasheet(nodeId, { nodeShared: status }));
  };

  /**
   * Set sharing permissions
   */
  const handleUpdateShare = (permission: { onlyRead?: boolean; canBeEdited?: boolean; canBeStored?: boolean }) => {
    const onOk = () =>
      Api.updateShare(nodeId, permission).then((res) => {
        const { success } = res.data;
        if (success) {
          getShareSettings();
          handleUpdateShareStatus(true);
          Message.success({ content: t(Strings.share_settings_tip, { status: t(Strings.success) }) });
        } else {
          Message.error({ content: t(Strings.share_settings_tip, { status: t(Strings.fail) }) });
        }
      });
    if (shareSettings?.linkNodes.length) {
      Modal.confirm({
        type: 'warning',
        title: t(Strings.share_and_permission_popconfirm_title),
        content: (
          <>
            {shareSettings.containMemberFld && (
              <div className={styles.tipItem}>
                <div className={styles.tipContent1}>
                  <TComponent
                    tkey={t(Strings.share_edit_exist_member_tip)}
                    params={{
                      content: <span className={styles.bold}>{t(Strings.member_type_field)}</span>,
                    }}
                  />
                </div>
              </div>
            )}
            <div className={styles.tipItem}>
              <div className={styles.tipContent2}>
                <TComponent
                  tkey={t(Strings.share_exist_something_tip)}
                  params={{
                    content: <span className={styles.bold}>{t(Strings.link_other_datasheet)}</span>,
                  }}
                />
              </div>
            </div>
            <div className={styles.linkNodes}>
              {shareSettings.linkNodes.map((item, index) => (
                <div key={item + index} className={styles.linkNode}>
                  <div className={styles.linkNodeName}>{item}</div>
                </div>
              ))}
            </div>
          </>
        ),
        onOk,
      });
      return;
    }
    setShareStatus(true);
    onOk().finally(() => setShareStatus(false));
  };

  /**
   * Close Share
   */
  const handleCloseShare = () => {
    if (!shareSettings) {
      return;
    }
    const onOk = () =>
      Api.disableShare(shareSettings.nodeId).then((res) => {
        const { success } = res.data;
        if (success) {
          getShareSettings();
          handleUpdateShareStatus(false);
          Message.success({ content: t(Strings.close_share_tip, { status: t(Strings.success) }) });
        } else {
          Message.error({ content: t(Strings.close_share_tip, { status: t(Strings.fail) }) });
        }
      });
    setDeleting(false);
    onOk();
  };

  /**
   * Toggle switch for sharing links
   */
  const handleToggle = (checked: boolean) => {
    if (checked) {
      handleUpdateShare({ onlyRead: true });
      return;
    }

    setDeleting(true);
  };

  /**
   * open share's auth-dropdown
   */
  const handleShareAuthClick = (option: IDoubleOptions) => {
    if (option.value === value) {
      return;
    }
    handleUpdateShare({ [option.value]: true });
  };

  let Permission: IDoubleOptions[] = [
    {
      value: 'onlyRead',
      label: t(Strings.can_view),
      subLabel: t(Strings.share_only_desc),
    },
    {
      value: 'canBeEdited',
      label: t(Strings.can_edit),
      subLabel: t(Strings.share_and_editable_desc),
    },
    {
      value: 'canBeStored',
      label: t(Strings.can_duplicate),
      subLabel: t(Strings.share_and_save_desc),
      disabled: Boolean(isShareMirror),
    },
  ];
  if(automationId != null) {
    Permission= [
      {
        value: 'onlyRead',
        label: t(Strings.can_view),
        subLabel: t(Strings.share_only_desc),
      },
      {
        value: 'canBeStored',
        label: t(Strings.can_duplicate),
        subLabel: t(Strings.share_and_save_desc),
        disabled: Boolean(isShareMirror),
      },
    ];
  }

  let value = '';
  if (shareSettings) {
    const { canBeEdited, onlyRead } = shareSettings.props;
    value = onlyRead ? 'onlyRead' : canBeEdited ? 'canBeEdited' : 'canBeStored';
  }

  const copyLinkHandler = () => {
    if (!shareSettings) {
      return;
    }
    const shareText = t(Strings.workbench_share_link_template, {
      nickName: userInfo!.memberName || t(Strings.friend),
      nodeName: shareSettings.nodeName,
    });
    copy2clipBoard(`${shareHost}${shareSettings.shareId} ${shareText}`);
  };

  const previewHandler = () => {
    if (shareSettings) {
      Router.newTab(Navigation.SHARE_SPACE, { params: { shareId: shareSettings.shareId } });
    }
  };

  const renderShareSwitchButton = () => {
    return (
      <div className={styles.shareToggle}>
        <Popconfirm
          visible={deleting}
          overlayClassName={styles.deleteNode}
          title={t(Strings.link_failed_after_close_share_link)}
          onCancel={() => {
            setDeleting(false);
          }}
          onOk={handleCloseShare}
          type="danger"
        >
          <Switch disabled={!spaceFeatures?.fileSharable} checked={shareSettings?.shareOpened} onChange={handleToggle} />
        </Popconfirm>
        <Typography variant="h7" className={styles.shareToggleContent}>
          {t(Strings.publish_share_link_with_anyone)}
        </Typography>
        <Tooltip title={t(Strings.support)} trigger={'hover'}>
          <a href={getEnvVariables().WORKBENCH_NODE_SHARE_HELP_URL} rel="noopener noreferrer" target="_blank">
            <QuestionCircleOutlined currentColor />
          </a>
        </Tooltip>
      </div>
    );
  };

  if (!shareSettings) {
    return (
      <div className={styles.publish}>
        <Skeleton count={1} style={{ marginTop: 0 }} width="25%" height="24px" />
        <Skeleton count={1} style={{ marginTop: '58px' }} height="24px" />
        <Skeleton count={1} style={{ marginTop: '16px' }} height="24px" />
      </div>
    );
  }

  if (!spaceFeatures?.fileSharable) {
    return (
      <DisabledShareFile style={{ marginBottom: 16 }} />
    );
  }

  if (!shareSettings.shareOpened) {
    return (
      <div className={styles.shareTips}>
        <div className={styles.title}>
          <Typography align="center" style={{ marginBottom: 8 }} variant="h6">
            {t(Strings.share_tips_title)}
          </Typography>
          <Typography align="left" variant="body3">
            {t(isAI ? Strings.share_tips_ai : Strings.share_tips)}
          </Typography>
        </div>
        <Button loading={shareStatus} style={{ width: 160 }} className={styles.shareOpenButton} color="primary" onClick={() => handleToggle(true)}>
          {t(Strings.publish)}
        </Button>
      </div>
    );
  }
  
  return (
    <div className={styles.publish}>
      {renderShareSwitchButton()}
      <div className={styles.sharePerson}>
        <Typography className={styles.sharePersonContent} variant="body2">
          {t(isAI ? Strings.get_ai_link_person_on_internet : Strings.get_link_person_on_internet)}
        </Typography>
        {!isAI && (
          <>
            {isMobile ? (
              <MobileSelect
                triggerComponent={
                  <div className={styles.mobileRoleSelect}>
                    {Permission.filter((item) => item.value === value)[0].label}
                    {<ChevronDownOutlined className={styles.arrowIcon} size={16} color={colors.fourthLevelText} />}
                  </div>
                }
                renderList={({ setVisible }) => {
                  return (
                    <div className={styles.mobileWrapper}>
                      {Permission.map((item) => (
                        <div
                          className={styles.mobileOption}
                          key={item.value}
                          onClick={() => {
                            handleShareAuthClick(item);
                            setVisible(false);
                          }}
                        >
                          <div>
                            <Typography variant={'body2'}>{item.label}</Typography>
                            <Typography variant={'body4'}>{item.subLabel}</Typography>
                          </div>
                          {item.value === value && <CheckOutlined color={colors.primaryColor} />}
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
            ) : (
              <DoubleSelect
                value={value}
                disabled={false}
                onSelected={(op) => handleShareAuthClick(op)}
                triggerCls={styles.doubleSelect}
                options={Permission}
              />
            )}
          </>
        )}
      </div>
      <div className={styles.shareLink}>
        <div className={styles.inputContainer}>
          <input type="text" className={styles.link} value={shareHost + shareSettings.shareId} id={shareSettings.shareId} readOnly />
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Tooltip title={t(Strings.preview)} placement="top">
              <IconButton icon={NewtabOutlined} onClick={previewHandler} variant="background" className={styles.inputButton} />
            </Tooltip>
          </ComponentDisplay>
        </div>
      </div>
      <div className={styles.inviteMore}>
        <LinkButton
          className={styles.inviteMoreMethod}
          underline={false}
          onClick={() => copyLinkHandler()}
          prefixIcon={<LinkOutlined currentColor />}
        >
          {t(Strings.share_copy_url_link)}
        </LinkButton>
        {isAI && (
          <LinkButton
            className={styles.inviteMoreMethod}
            underline={false}
            onClick={() => setWidgetEmbedVisible(true)}
            prefixIcon={<CodeOutlined currentColor />}
          >
            Embed
          </LinkButton>
        )}

        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <Tooltip
            trigger="click"
            placement="left"
            showArrow={false}
            overlayInnerStyle={{ padding: 0, backgroundColor: 'transparent' }}
            overlay={
              <ShareQrCode url={`${shareHost}${shareSettings.shareId}`} user={userInfo} nodeName={treeNodesMap[shareSettings.nodeId]?.nodeName} />
            }
          >
            <LinkButton className={styles.inviteMoreMethod} underline={false} prefixIcon={<QrcodeOutlined currentColor />}>
              {t(Strings.share_qr_code_tips)}
            </LinkButton>
          </Tooltip>
        </ComponentDisplay>
        {WidgetEmbed && <WidgetEmbed visible={WidgetEmbedVisible} hide={hideShareCodeModal} shareId={shareSettings.shareId} />}
      </div>
    </div>
  );
};
