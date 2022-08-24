import { FC, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'ahooks';

import RcTrigger from 'rc-trigger';

import { Api, IReduxState, IShareSettings, StoreActions, Strings, t } from '@vikadata/core';
import { Switch, Typography } from '@vikadata/components';
import { InformationSmallOutlined, ChevronDownOutlined, ShareQrcodeOutlined, ColumnUrlOutlined } from '@vikadata/icons';

import { useCatalogTreeRequest } from 'pc/hooks';
import { Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import ComponentDisplay, { ScreenSize } from 'pc/components/common/component_display/component_display';
import { Popup } from 'pc/components/common/mobile/popup';

import { ShareLink } from '../share/share_link';
import { Dropdown } from '../tools_components';

import styles from './style.module.less';

export interface IPublicShareLinkProps {
  nodeId: string;
  isMobile: boolean;
}

export const PublicShareLink: FC<IPublicShareLinkProps> = ({ nodeId, isMobile }) => {
  const [visible, setVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);

  const dispatch = useDispatch();
  const { getShareSettingsReq/*, disableShareReq*/ } = useCatalogTreeRequest();
  // const { run: disableShare, loading: disableShareLoading } = useRequest(() => disableShareReq(nodeId), { manual: true });
  const { run: getShareSettings, data: shareSettings, loading/*, mutate: setShareSettings*/ } =
    useRequest<IShareSettings, any>(() => getShareSettingsReq(nodeId));
  const { userInfo, treeNodesMap } = useSelector((state: IReduxState) => ({
    treeNodesMap: state.catalogTree.treeNodesMap,
    userInfo: state.user.info,
    mirrorId: state.pageParams.mirrorId
  }), shallowEqual);

  const handleUpdateShareStatus = (status: boolean) => {
    dispatch(StoreActions.updateTreeNodesMap(nodeId, { nodeShared: status }));
    if (nodeId.startsWith('mir')) {
      dispatch(StoreActions.updateMirror(nodeId, { nodeShared: status }));
      return;
    }
    dispatch(StoreActions.updateDatasheet(nodeId, { nodeShared: status }));
  };

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

  // 关闭分享
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
      type: 'danger'
    });
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      handleUpdateShare({ onlyRead: true });
      return;
    }
    handleCloseShare();
  };

  const handleToggleAuth = () => {
    if (isMobile) {
      setAuthVisible((val) => !val);
    }
  };

  const Permission = [{
    value: 'share_only_title',
    label: t(Strings.share_only_title),
    describe: t(Strings.share_only_desc),
  }, {
    value: 'share_and_editable_title',
    label: t(Strings.share_and_editable_title),
    describe: t(Strings.share_and_editable_desc),
  }, {
    value: 'share_and_save_title',
    label: t(Strings.share_and_save_title),
    describe: t(Strings.share_and_save_desc),
  }];

  const renderAuth = () => {
    const element = (
      <Typography variant='body2' className={styles.sharePersonAuth} onClick={handleToggleAuth}>
        <span>可编辑</span>
        <ChevronDownOutlined size={16} />
      </Typography>
    );
    if (isMobile) {
      return element;
    }
    return (
      <RcTrigger
        action="click"
        popup={(
          <Dropdown data={Permission} value={['share_and_editable_title']} />
        )}
        destroyPopupOnHide
        popupAlign={{
          points: ['tl', 'bl'],
        }}
        popupVisible={visible}
        onPopupVisibleChange={setVisible}
        zIndex={1000}
      >
        {element}
      </RcTrigger>
    );
  };

  return (
    <>
      <div className={styles.shareToggle}>
        <Switch checked={shareSettings?.shareOpened} onChange={handleToggle} />
        <Typography variant='h7' className={styles.shareToggleContent}>通过公开链接分享内容给他人</Typography>
        <InformationSmallOutlined />
      </div>
      {!loading && shareSettings && shareSettings.shareOpened && (
        <>
          <div className={styles.sharePerson}>
            <Typography className={styles.sharePersonContent} variant='body2'>互联网上获得该链接的人</Typography>
            {renderAuth()}
          </div>
          <ShareLink
            shareName={treeNodesMap[shareSettings.nodeId]?.nodeName}
            shareSettings={shareSettings}
            userInfo={userInfo}
          />
        </>
      )}
      <div className={styles.shareMore}>
        <Typography className={styles.shareMoreTitle} variant='body3'>更多邀请方式：</Typography>
        <Typography className={styles.shareMoreMethod} variant='body3'>
          <ColumnUrlOutlined />
          <span>链接邀请</span>
        </Typography>
        <Typography className={styles.shareMoreMethod} variant='body3'>
          <ShareQrcodeOutlined />
          <span>二维码邀请</span>
        </Typography>
      </div>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          title="设置权限"
          visible={authVisible}
          onClose={handleToggleAuth}
          height="auto"
          destroyOnClose
          className={styles.sharePersonAuthMobile}
        >
          <Dropdown selectedMode="check" divide data={Permission} value={['edit']} />
        </Popup>
      </ComponentDisplay>
    </>
  );
};