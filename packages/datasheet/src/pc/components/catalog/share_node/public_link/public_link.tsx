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

import { Button, LinkButton, Typography, useThemeColors, ThemeName } from '@apitable/components';
import { Api, IShareSettings, StoreActions, Strings, t } from '@apitable/core';
import { useRequest } from 'pc/hooks';
import classnames from 'classnames';
import { pickBy } from 'lodash';
import Image from 'next/image';
import { DisabledShareFile } from 'pc/components/catalog/share_node/disabled_share_file/disabled_share_file';
import { ShareTab } from 'pc/components/catalog/share_node/share_node';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { ScreenSize } from 'pc/components/common/component_display';
import { TComponent } from 'pc/components/common/t_component';
import { useCatalogTreeRequest, useResponsive } from 'pc/hooks';
import { getNodeTypeByNodeId } from 'pc/utils';
import * as React from 'react';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import EyeIcon from 'static/icon/signin/signin_icon_display.svg';
import { getNodeIcon } from '../../tree/node_icon';
import { Share } from '../share';
import styles from './style.module.less';

export interface IPublicLinkProps {
  nodeId: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<ShareTab>>;
}

export const PublicLink: FC<React.PropsWithChildren<IPublicLinkProps>> = ({ nodeId, setActiveTab }) => {
  const colors = useThemeColors();
  const { getShareSettingsReq, disableShareReq } = useCatalogTreeRequest();
  const { run: disableShare, loading: disableShareLoading } = useRequest(() => disableShareReq(nodeId), { manual: true });
  const { run: getShareSettings, data: shareSettings, loading, mutate: setShareSettings } = useRequest<IShareSettings>(() =>
    getShareSettingsReq(nodeId),
  );
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const dispatch = useDispatch();
  const fileSharable = useSelector(state => state.space.spaceFeatures?.fileSharable);
  const themeName = useSelector(state => state.theme);
  const DefaultPng = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;

  const onChange = (data: IShareSettings) => {
    setShareSettings(data);
  };

  const updateShareStatus = (status: boolean) => {
    dispatch(StoreActions.updateTreeNodesMap(nodeId, { nodeShared: status }));
    if (nodeId.startsWith('mir')) {
      dispatch(StoreActions.updateMirror(nodeId, { nodeShared: status }));
      return;
    }
    dispatch(StoreActions.updateDatasheet(nodeId, { nodeShared: status }));
  };

  const updateShare = (permission: { onlyRead?: boolean; canBeEdited?: boolean; canBeStored?: boolean }) => {
    const onOk = () =>
      Api.updateShare(nodeId, permission).then(res => {
        const { success } = res.data;
        if (success) {
          getShareSettings();
          updateShareStatus(true);
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
    onOk();
  };

  const handleClosePublicLink = async() => {
    if (disableShareLoading) {
      return;
    }
    const isOk = await disableShare();
    if (isOk) {
      Message.success({ content: t(Strings.close_public_link_success) });
      getShareSettings();
    }
  };

  if (loading || !shareSettings) {
    return <></>;
  }

  if (!fileSharable) {
    return <DisabledShareFile />;
  }

  return (
    <div className={classnames(styles.publicLink, isMobile && styles.mobilePublicLink)}>
      {shareSettings.shareOpened ? (
        <div className={styles.sharing}>
          <Share shareSettings={shareSettings} onChange={onChange} nodeId={nodeId} />
          {shareSettings.shareOpened && !shareSettings.operatorHasPermission && (
            <div className={styles.disabledLink}>
              <Typography className={styles.title} variant="h6" color={colors.firstLevelText}>
                「{getNodeIcon(shareSettings.nodeIcon, getNodeTypeByNodeId(shareSettings.nodeId))}
                {shareSettings.nodeName}」{t(Strings.link_failed)}
              </Typography>
              <Typography className={styles.subTitle} variant="body2" color={colors.secondLevelText}>
                {t(Strings.disabled_link_subtitle)}
              </Typography>
              <Button
                className={styles.reopenBtn}
                color="primary"
                style={{ width: '156px' }}
                onClick={() => updateShare(pickBy(shareSettings.props, value => value))}
              >
                {t(Strings.reopen)}
              </Button>
              <LinkButton onClick={handleClosePublicLink} underline={false} color={colors.thirdLevelText}>
                {t(Strings.quick_close_public_link)}
              </LinkButton>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.unShare}>
          {isMobile && <Image src={DefaultPng} alt="placeholder" />}
          <Button color="primary" onClick={() => updateShare({ onlyRead: true })}>
            {t(Strings.open_public_link)}
          </Button>
          <div className={styles.tip}>{t(Strings.publish_link_tip)}</div>
        </div>
      )}
      {
        <div className={classnames(styles.jumpBtn, { [styles.center]: isMobile })}>
          <EyeIcon />
          <Typography
            variant={'body3'}
            color={colors.thirdLevelText}
            style={{ marginLeft: 4 }}
            className={styles.inviteMember}
            onClick={() => {
              setActiveTab?.(ShareTab.Teamwork);
            }}
          >
            {t(Strings.siwtch_to_invite_tab)}
          </Typography>
        </div>
      }
    </div>
  );
};
