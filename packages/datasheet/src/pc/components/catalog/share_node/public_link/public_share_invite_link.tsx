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

import { DoubleSelect, IDoubleOptions, LinkButton, Switch, Typography, useThemeColors } from '@apitable/components';
import { Api, IReduxState, IShareSettings, StoreActions, Strings, t } from '@apitable/core';
import { CheckOutlined, ColumnUrlOutlined, InformationSmallOutlined } from '@apitable/icons';
import { useRequest } from 'ahooks';
import { Tooltip } from 'antd';
import { Message, MobileSelect, Modal } from 'pc/components/common';
import { TComponent } from 'pc/components/common/t_component';
// @ts-ignore
import { isSocialPlatformEnabled } from 'enterprise';
import { useCatalogTreeRequest } from 'pc/hooks';
import { getEnvVariables } from 'pc/utils/env';
import { FC } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PulldownIcon from 'static/icon/common/common_icon_pulldown_line.svg';
import { DisabledShareFile } from '../disabled_share_file/disabled_share_file';
import { ShareLink } from '../share/share_link';
import { expandInviteModal } from 'pc/components/invite/invite_outsider';
import styles from './style.module.less';

export interface IPublicShareLinkProps {
  nodeId: string;
  isMobile: boolean;
}

export const PublicShareInviteLink: FC<IPublicShareLinkProps> = ({ nodeId, isMobile }) => {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const { getShareSettingsReq } = useCatalogTreeRequest();
  const { run: getShareSettings, data: shareSettings } =
    useRequest<IShareSettings, any>(() => getShareSettingsReq(nodeId));
  const { userInfo, treeNodesMap, spaceFeatures, spaceInfo } = useSelector((state: IReduxState) => ({
    treeNodesMap: state.catalogTree.treeNodesMap,
    userInfo: state.user.info,
    spaceFeatures: state.space.spaceFeatures,
    spaceInfo: state.space.curSpaceInfo!,
  }), shallowEqual);

  const isShareMirror = nodeId.startsWith('mir');

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
  const handleUpdateShare = (permission: { onlyRead?: boolean, canBeEdited?: boolean, canBeStored?: boolean }) => {
    const onOk = () => Api.updateShare(nodeId, permission).then(res => {
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
        content: <>
          {shareSettings.containMemberFld &&
            <div className={styles.tipItem}>
              <div className={styles.tipContent1}>
                <TComponent
                  tkey={t(Strings.share_edit_exist_member_tip)}
                  params={{
                    content: <span className={styles.bold}>{t(Strings.member_type_field)}</span>
                  }}
                />
              </div>
            </div>
          }
          <div className={styles.tipItem}>
            <div className={styles.tipContent2}>
              <TComponent
                tkey={t(Strings.share_exist_something_tip)}
                params={{
                  content: <span className={styles.bold}>{t(Strings.link_other_datasheet)}</span>
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
        </>,
        onOk
      });
      return;
    }
    onOk();
  };

  /**
   * Close Share
   */
  const handleCloseShare = () => {
    if (!shareSettings) {
      return;
    }
    const onOk = () => Api.disableShare(shareSettings.nodeId).then(res => {
      const { success } = res.data;
      if (success) {
        getShareSettings();
        handleUpdateShareStatus(false);
        Message.success({ content: t(Strings.close_share_tip, { status: t(Strings.success) }) });
      } else {
        Message.error({ content: t(Strings.close_share_tip, { status: t(Strings.fail) }) });
      }
    });

    Modal.confirm({
      title: t(Strings.close_share_link),
      content: t(Strings.link_failed_after_close_share_link),
      onOk,
      type: 'warning'
    });
  };

  /**
   * Toggle switch for sharing links
   */
  const handleToggle = (checked: boolean) => {
    if (checked) {
      handleUpdateShare({ onlyRead: true });
      return;
    }
    handleCloseShare();
  };

  const invitable = spaceFeatures?.invitable && !isSocialPlatformEnabled?.(spaceInfo);

  /**
   * open share's auth-dropdown
   */
  const handleShareAuthClick = (option: IDoubleOptions) => {
    if (option.value === value) {
      return;
    }
    handleUpdateShare({ [option.value]: true });
  };

  const Permission: IDoubleOptions[] = [{
    value: 'onlyRead',
    label: t(Strings.can_view),
    subLabel: t(Strings.share_only_desc),
  }, {
    value: 'canBeEdited',
    label: t(Strings.can_edit),
    subLabel: t(Strings.share_and_editable_desc),
    disabled: Boolean(isShareMirror)
  }, {
    value: 'canBeStored',
    label: t(Strings.can_duplicate),
    subLabel: t(Strings.share_and_save_desc),
    disabled: Boolean(isShareMirror)
  }];

  let value = '';
  if (shareSettings) {
    const { canBeEdited, onlyRead } = shareSettings.props;
    value = onlyRead ? 'onlyRead' :
      canBeEdited ? 'canBeEdited' :
        'canBeStored';
  }

  return (
    <>
      <div className={styles.shareToggle}>
        <Switch disabled={!spaceFeatures?.fileSharable} checked={shareSettings?.shareOpened} onChange={handleToggle} />
        <Typography variant='h7' className={styles.shareToggleContent}>{t(Strings.publish_share_link_with_anyone)}</Typography>
        <Tooltip title={t(Strings.support)} trigger={'hover'}>
          <a href={getEnvVariables().WORKBENCH_NODE_SHARE_HELP_URL} rel='noopener noreferrer' target='_blank'>
            <InformationSmallOutlined currentColor />
          </a>
        </Tooltip>
      </div>
      {spaceFeatures?.fileSharable ? (
        shareSettings && shareSettings.shareOpened && (
          <>
            <div className={styles.sharePerson}>
              <Typography className={styles.sharePersonContent} variant='body2'>{t(Strings.get_link_person_on_internet)}</Typography>
              {isMobile ? (
                <MobileSelect
                  triggerComponent={
                    <div className={styles.mobileRoleSelect}>
                      {Permission.filter(item => item.value === value)[0].label}
                      {<PulldownIcon className={styles.arrowIcon} width={16} height={16} fill={colors.fourthLevelText} />}
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
                  onSelected={(op, index) => handleShareAuthClick(op)}
                  triggerCls={styles.doubleSelect}
                  options={Permission}
                />
              )}
            </div>
            <ShareLink
              shareName={treeNodesMap[shareSettings.nodeId]?.nodeName}
              shareSettings={shareSettings}
              userInfo={userInfo}
            />
          </>
        )
      ) : <DisabledShareFile />}
      {invitable && (
        <div className={styles.inviteMore}>
          <Typography className={styles.inviteMoreTitle} variant='body3'>{t(Strings.more_invite_ways)}：</Typography>
          <LinkButton
            className={styles.inviteMoreMethod}
            underline={false}
            onClick={() => expandInviteModal()}
            prefixIcon={<ColumnUrlOutlined currentColor />}
          >
            {t(Strings.invite_via_link)}
          </LinkButton>
        </div>
      )}
    </>
  );
};
