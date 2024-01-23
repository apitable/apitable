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

import { Popover, Radio } from 'antd';
import classnames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { Button, Skeleton } from '@apitable/components';
import { Api, IReduxState, IShareSettings, StoreActions, Strings, t } from '@apitable/core';
import { TriangleDownFilled, CheckOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { useRequest, useCatalogTreeRequest, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { ShareLink } from './share_link';
import styles from './style.module.less';

export interface IShareProps {
  shareSettings: IShareSettings;
  nodeId: string;
  onChange?: (data: IShareSettings) => void;
}

export const Share: FC<React.PropsWithChildren<IShareProps>> = ({ shareSettings, onChange, nodeId }) => {
  // Whether to display the drop-down menu
  const [menuVisible, setMenuVisible] = useState(false);
  // Control the display of modal boxes for sharing QR codes
  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { userInfo, treeNodesMap } = useAppSelector(
    (state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      userInfo: state.user.info,
      mirrorId: state.pageParams.mirrorId,
    }),
    shallowEqual,
  );
  const { getShareSettingsReq } = useCatalogTreeRequest();
  const isShareMirror = nodeId.startsWith('mir');
  const { run: getShareSettings, data: newShareSettings } = useRequest<IShareSettings>(() => getShareSettingsReq(shareSettings.nodeId), {
    manual: true,
  });

  useEffect(() => {
    if (newShareSettings) {
      onChange && onChange(newShareSettings);
    }
    // eslint-disable-next-line
  }, [newShareSettings]);

  if (!shareSettings) {
    return (
      <>
        <Skeleton width="38%" />
        <Skeleton />
        <Skeleton width="61%" />
      </>
    );
  }

  const getShareStatusText = () => {
    const { shareOpened, props } = shareSettings;
    if (!shareOpened) {
      return { title: t(Strings.not_shared), desc: '' };
    }
    if (props.canBeEdited) {
      return { title: t(Strings.share_and_editable_title), desc: t(Strings.share_and_editable_desc) };
    }
    if (props.canBeStored) {
      return { title: t(Strings.share_and_save_title), desc: t(Strings.share_and_save_desc) };
    }
    return { title: t(Strings.share_only_title), desc: t(Strings.share_only_desc) };
  };

  const updateShareStatus = (status: boolean) => {
    dispatch(StoreActions.updateTreeNodesMap(shareSettings.nodeId, { nodeShared: status }));
    if (shareSettings.nodeId.startsWith('mir')) {
      dispatch(StoreActions.updateMirror(shareSettings.nodeId, { nodeShared: status }));
      return;
    }
    dispatch(StoreActions.updateDatasheet(shareSettings.nodeId, { nodeShared: status }));
  };

  // Share settings
  const updateShare = (permission: { onlyRead?: boolean; canBeEdited?: boolean; canBeStored?: boolean }) => {
    const onOk = () =>
      Api.updateShare(shareSettings.nodeId, permission).then((res) => {
        const { success } = res.data;
        if (success) {
          getShareSettings();
          updateShareStatus(true);
          Message.success({ content: t(Strings.share_settings_tip, { status: t(Strings.success) }) });
        } else {
          Message.error({ content: t(Strings.share_settings_tip, { status: t(Strings.fail) }) });
        }
      });
    if (shareSettings.linkNodes.length) {
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

  const closeShare = () => {
    const onOk = () =>
      Api.disableShare(shareSettings.nodeId).then((res) => {
        const { success } = res.data;
        if (success) {
          getShareSettings();
          updateShareStatus(false);
          Message.success({ content: t(Strings.close_share_tip, { status: t(Strings.success) }) });
        } else {
          Message.error({ content: t(Strings.close_share_tip, { status: t(Strings.fail) }) });
        }
      });

    Modal.confirm({
      title: t(Strings.close_share_link),
      content: t(Strings.link_failed_after_close_share_link),
      onOk,
      type: 'danger',
    });
  };

  const Menu = () => {
    const { shareOpened, props } = shareSettings;
    const data = [
      {
        title: t(Strings.share_only_title),
        desc: t(Strings.share_only_desc),
        onClick: () => updateShare({ onlyRead: true }),
        active: shareOpened && props.onlyRead,
      },
      {
        title: t(Strings.share_and_editable_title),
        desc: t(Strings.share_and_editable_desc),
        onClick: () => updateShare({ canBeEdited: true }),
        active: shareOpened && props.canBeEdited,
        disabled: Boolean(isShareMirror),
      },
      {
        title: t(Strings.share_and_save_title),
        desc: t(Strings.share_and_save_desc),
        onClick: () => updateShare({ canBeStored: true }),
        active: shareOpened && props.canBeStored,
        disabled: Boolean(isShareMirror),
      },
    ];

    return (
      <div className={styles.menu} onClick={() => setMenuVisible(false)}>
        <div className={styles.main}>
          {data.map((item) => (
            <div
              key={item.title}
              className={classnames(styles.item, item.active && styles.active, isMobile && styles.itemMobile, item.disabled && styles.disabled)}
              onClick={() => {
                !item.disabled && item.onClick();
              }}
            >
              {isMobile && <Radio checked={item.active} />}
              <div>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.desc}>{item.desc}</div>
              </div>
              {!isMobile && <CheckOutlined />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const status = getShareStatusText();

  return (
    <>
      <div className={styles.share}>
        <div className={styles.currentStatusWrapper}>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Popover
              visible={menuVisible}
              content={<Menu />}
              overlayClassName={styles.shareMenu}
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              trigger="click"
              placement="bottomLeft"
              destroyTooltipOnHide={{ keepParent: false }}
              align={{ offset: [0, -8] }}
              onVisibleChange={(visible) => setMenuVisible(visible)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement!}
            >
              <div className={classnames(styles.currentStatus, shareSettings.shareOpened && styles.sharing)}>
                {status.title} <TriangleDownFilled />
              </div>
            </Popover>
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <div className={classnames(styles.currentStatus, shareSettings.shareOpened && styles.sharing)} onClick={() => setMenuVisible(true)}>
              {status.title} <TriangleDownFilled />
            </div>
            <Popup
              className={styles.menuDrawer}
              open={menuVisible}
              title={t(Strings.please_choose)}
              height="50%"
              closeIcon={null}
              onClose={() => setMenuVisible(false)}
            >
              <Menu />
            </Popup>
          </ComponentDisplay>
        </div>
        {status.desc && <div className={styles.statusDesc}>{status.desc}</div>}
      </div>

      <div className={styles.tip}>{t(Strings.share_and_permission_share_link)}</div>
      <ShareLink shareName={treeNodesMap[shareSettings.nodeId]?.nodeName} shareSettings={shareSettings} userInfo={userInfo} />
      {isMobile && <div className={styles.anyoneCanSeeTip}>{t(Strings.public_link_desc)}</div>}
      <Button className={styles.closeShare} color="danger" onClick={closeShare}>
        {t(Strings.close_share_link)}
      </Button>
    </>
  );
};
