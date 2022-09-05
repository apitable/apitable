import { FC, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'ahooks';

import RcTrigger from 'rc-trigger';
import { Popover, Tooltip } from 'antd';

import { Api, IReduxState, IShareSettings, StoreActions, Strings, t } from '@vikadata/core';
import { Switch, Typography } from '@vikadata/components';
import { InformationSmallOutlined, ChevronDownOutlined, ShareQrcodeOutlined, ColumnUrlOutlined, CloseMiddleOutlined } from '@vikadata/icons';

import { useCatalogTreeRequest } from 'pc/hooks';
import { copy2clipBoard } from 'pc/utils';
import { Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import ComponentDisplay from 'pc/components/common/component_display/component_display';
import { ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';

import { ShareLink } from '../share/share_link';
import { Dropdown, IDropdownItem } from '../tools_components';
import { DownloadQrCode } from './download_qr_code';

import styles from './style.module.less';

export interface IPublicShareLinkProps {
  nodeId: string;
  isMobile: boolean;
  inviteLink: string;
  canEditInvite: boolean;
}

export const PublicShareInviteLink: FC<IPublicShareLinkProps> = ({ nodeId, isMobile, inviteLink, canEditInvite }) => {
  const [visible, setVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const dispatch = useDispatch();
  const { getShareSettingsReq/*, disableShareReq*/ } = useCatalogTreeRequest();
  // const { run: disableShare, loading: disableShareLoading } = useRequest(() => disableShareReq(nodeId), { manual: true });
  const { run: getShareSettings, data: shareSettings, loading/*, mutate: setShareSettings*/ } =
    useRequest<IShareSettings, any>(() => getShareSettingsReq(nodeId));
  const { userInfo, treeNodesMap } = useSelector((state: IReduxState) => ({
    treeNodesMap: state.catalogTree.treeNodesMap,
    userInfo: state.user.info,
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
   * 设置分享权限
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
   * 关闭分享
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
      type: 'danger'
    });
  };

  /**
   * 切换分享链接开关
   */
  const handleToggle = (checked: boolean) => {
    if (checked) {
      handleUpdateShare({ onlyRead: true });
      return;
    }
    handleCloseShare();
  };

  /**
   * 移动端打开分享链接弹窗
   */
  const handleToggleAuthInMobile = () => {
    if (isMobile) {
      setAuthVisible((val) => !val);
    }
  };
  
  /**
   * 复制邀请链接
   */
  const handleCopyInviteLink = () => {
    copy2clipBoard(inviteLink);
  };

  /**
   * 打开移动端的二维码
   */
  const handleOpenQrCode = () => {
    if (isMobile) {
      setQrCodeVisible(true);
    }
  }; 

  /**
   * open share's auth-dropdown
   */
  const handleShareAuthClick = (option: IDropdownItem) => {
    if (option.value === value) {
      return;
    }
    handleUpdateShare({ [option.value]: true });
  };

  const Permission: IDropdownItem[] = [{
    value: 'onlyRead',
    label: t(Strings.can_view),
    describe: t(Strings.share_only_desc),
  }, {
    value: 'canBeEdited',
    label: t(Strings.can_edit),
    describe: t(Strings.share_and_editable_desc),
    disabled: Boolean(isShareMirror)
  }, {
    value: 'canBeStored',
    label: t(Strings.can_duplicate),
    describe: t(Strings.share_and_save_desc),
    disabled: Boolean(isShareMirror)
  }];
  
  let value = '';
  if (shareSettings) {
    const { canBeEdited, onlyRead } = shareSettings.props;
    value = onlyRead ? 'onlyRead' :
      canBeEdited ? 'canBeEdited' :
        'canBeStored';
  }
  const shareTitle = !value ? t(Strings.not_shared) : Permission.filter((v) => v.value === value)[0].label;

  // const renderHover = () => {
  //   return <div style={{ background: '#29e', position: 'absolute', top: 0, left: -81 }}>sdfksjdflkjsfd</div>;
  // };

  const renderAuth = () => {
    const element = (
      <Typography variant='body2' className={styles.sharePersonAuth} onClick={handleToggleAuthInMobile}>
        <span>{shareTitle}</span>
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
          <Dropdown
            mode='common'
            data={Permission}
            value={[value]}
            onClick={handleShareAuthClick}
            // hoverElement={renderHover()}
            visible
          />
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

  const renderPopover = () => {
    return (
      <div className={styles.qrCodePopoverContent} id="downloadInviteContainer">
        <DownloadQrCode isMobile={isMobile} url={inviteLink} width={188} />
      </div>
    );
  };

  const renderInviteByQrCode = () => {
    return (
      <Typography className={styles.inviteMoreMethod} variant='body3' onClick={handleOpenQrCode}>
        <ShareQrcodeOutlined />
        <span>{t(Strings.invite_by_qr_code)}</span>
      </Typography>
    );
  };

  return (
    <>
      <div className={styles.shareToggle}>
        <Switch checked={shareSettings?.shareOpened} onChange={handleToggle} />
        <Typography variant='h7' className={styles.shareToggleContent}>{t(Strings.publish_share_link_with_anyone)}</Typography>
        <InformationSmallOutlined />
      </div>
      {!loading && shareSettings && shareSettings.shareOpened && (
        <>
          <div className={styles.sharePerson}>
            <Typography className={styles.sharePersonContent} variant='body2'>{t(Strings.get_link_person_on_internet)}</Typography>
            {renderAuth()}
          </div>
          <ShareLink
            shareName={treeNodesMap[shareSettings.nodeId]?.nodeName}
            shareSettings={shareSettings}
            userInfo={userInfo}
          />
        </>
      )}
      {canEditInvite && (
        <div className={styles.inviteMore}>
          <Typography className={styles.inviteMoreTitle} variant='body3'>{t(Strings.more_invite_ways)}：</Typography>
          <Tooltip title={t(Strings.default_link_join_tip)} placement="top" overlayStyle={{ width: 190 }}>
            <Typography className={styles.inviteMoreMethod} variant='body3' onClick={handleCopyInviteLink}>
              <ColumnUrlOutlined />
              <span>{t(Strings.invite_via_link)}</span>
            </Typography>
          </Tooltip>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Popover overlayClassName={styles.qrCodePopover} placement="rightBottom" title={null} content={renderPopover()} trigger="click">
              {renderInviteByQrCode()}
            </Popover>
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            {renderInviteByQrCode()}
          </ComponentDisplay>
        </div>
      )}
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          title={t(Strings.setting_permission)}
          visible={authVisible}
          onClose={handleToggleAuthInMobile}
          height="auto"
          destroyOnClose
          className={styles.sharePersonAuthMobile}
        >
          <Dropdown
            mode='common'
            selectedMode="check"
            divide
            data={Permission}
            value={[value]}
            onClick={handleShareAuthClick}
          />
        </Popup>
        <Modal
          closable={false}
          footer={null}
          visible={qrCodeVisible}
          centered
          onCancel={() => setQrCodeVisible(false)}
          zIndex={1001}
          width={310}
          maskClosable={false}
          bodyStyle={{ padding: 24, boxSizing: 'border-box' }}
          className={styles.qrCodeMobile}
        >
          <div className={styles.qrCodeCloseIcon} onClick={() => setQrCodeVisible(false)}>
            <CloseMiddleOutlined size={16} />
          </div>
          <DownloadQrCode isMobile={isMobile} url={inviteLink} width={242} />
        </Modal>
      </ComponentDisplay>
    </>
  );
};