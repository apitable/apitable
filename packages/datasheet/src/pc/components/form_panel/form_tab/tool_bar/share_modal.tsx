import { Button, Skeleton } from '@vikadata/components';
import { Api, FormApi, IFormProps, IReduxState, IShareSettings, StoreActions, Strings, t } from '@vikadata/core';
import { Radio, Space, Switch } from 'antd';
import produce from 'immer';
import Image from 'next/image';
import { DisabledShareFile } from 'pc/components/catalog/share_node/disabled_share_file/disabled_share_file';
import { ShareLink } from 'pc/components/catalog/share_node/share/share_link';
import { ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal';
import { Popconfirm } from 'pc/components/common/popconfirm';
import { Tooltip } from 'pc/components/common/tooltip';
import { useResponsive } from 'pc/hooks';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import HeaderCover from 'static/icon/datasheet/share/datasheet_img_share.png';
import styles from './style.module.less';

interface IShareModalProps {
  formId: string;
  visible: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<IShareModalProps> = props => {
  const [switchLoading, setSwitchLoading] = useState(false);
  const [confirmPopVisible, setConfirmPopVisible] = useState(false);
  const { formId, visible, onClose } = props;
  // 神奇表单相关属性
  const [formProps, setFormProps] = useState<IFormProps>({});
  const { fillAnonymous = false, submitLimit = 0 } = formProps;
  const [isLoadingShow, setLoadingShow] = useState<boolean>(true);
  // 被分享节点的相关信息
  const [shareSettings, setShareSettings] = useState<IShareSettings | null>(null);
  const { userInfo } = useSelector((state: IReduxState) => ({ userInfo: state.user.info }), shallowEqual);
  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const fileSharable = useSelector(state => state.space.spaceFeatures?.fileSharable);
  // 更新属性
  const updateProps = partProps => {
    const finalFormProps = produce(formProps, draft => {
      draft = Object.assign(draft, partProps);
      return draft;
    });

    FormApi.updateFormProps(formId, finalFormProps).then(res => {
      const { success } = res.data;
      if (success) {
        setFormProps(finalFormProps);
      } else {
        Message.error({ content: t(Strings.share_settings_tip, { status: t(Strings.fail) }) });
      }
    });
  };

  // 获取分享设置
  const getShareSettings = () => {
    setLoadingShow(true);
    Api.getShareSettings(formId).then(res => {
      const { data, success } = res.data;
      if (success) {
        setShareSettings(data);
        if (data.shareOpened) {
          getFormProps();
          return;
        }
        setLoadingShow(false);
      } else {
        Message.error({ content: t(Strings.share_settings_tip, { status: t(Strings.fail) }) });
      }
    });
  };

  // 获取 formProps
  const getFormProps = () => {
    FormApi.fetchFormProps(formId).then(res => {
      const { data, success } = res.data;
      if (success) {
        setFormProps(data);
        setLoadingShow(false);
      } else {
        Message.error({ content: t(Strings.share_settings_tip, { status: t(Strings.fail) }) });
      }
    });
  };

  // 更新数表和工作目录的分享状态
  const updateShareStatus = (status: boolean) => {
    dispatch(StoreActions.updateTreeNodesMap(formId, { nodeShared: status }));
    dispatch(StoreActions.updateForm(formId, { nodeShared: status }));
  };

  // 打开分享
  const updateShareSettings = (permission: { onlyRead?: boolean; canBeEdited?: boolean; canBeStored?: boolean }) => {
    setSwitchLoading(true);
    Api.updateShare(formId, permission).then(res => {
      const { success } = res.data;
      if (success) {
        setSwitchLoading(false);
        getShareSettings();
        updateShareStatus(true);
        Message.success({ content: t(Strings.share_settings_tip, { status: t(Strings.success) }) });
      } else {
        Message.error({ content: t(Strings.share_settings_tip, { status: t(Strings.fail) }) });
      }
    });
  };

  // 关闭分享
  const closeShare = () => {
    Api.disableShare(formId).then(res => {
      const { success } = res.data;
      if (success) {
        getShareSettings();
        updateShareStatus(false);
        Message.success({ content: t(Strings.close_share_tip, { status: t(Strings.success) }) });
      } else {
        Message.error({ content: t(Strings.close_share_tip, { status: t(Strings.fail) }) });
      }
    });
  };

  const onSwitchChange = (checked: boolean) => {
    if (checked) {
      updateShareSettings({ canBeEdited: true });
      return;
    }
    closeShare();
  };

  const onFillMethodChange = e => {
    const checked = e.target.value;
    const params = checked
      ? {
          fillAnonymous: checked,
          submitLimit: 0,
        }
      : { fillAnonymous: checked };

    updateProps(params);
  };

  const onSubmitLimitChange = e => {
    updateProps({ submitLimit: e.target.value });
  };

  useEffect(() => {
    if (visible) {
      getShareSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const showCloseModel = () => {
    Modal.confirm({
      title: t(Strings.form_share_closed_popconfirm_title),
      content: t(Strings.form_share_closed_popconfirm_content),
      onOk: () => {
        onSwitchChange(false);
      },
    });
  };

  const submitLimitRadio = (
    <div>
      <div className={styles.fillTitle}>{t(Strings.form_submit_times_limit)}</div>
      <div className={styles.submitLimitRadio}>
        <Radio.Group value={submitLimit} onChange={onSubmitLimitChange} disabled={fillAnonymous}>
          <Radio value={0}>{t(Strings.form_submit_no_limit)}</Radio>
          <Radio value={1}>{t(Strings.form_submit_once)}</Radio>
        </Radio.Group>
      </div>
    </div>
  );

  const content = (
    <>
      <div className={styles.header}>
        <Image className={styles.cover} src={HeaderCover} alt="form_share" />
      </div>
      {fileSharable ? (
        <div className={styles.container}>
          {!isLoadingShow ? (
            <>
              <div className={styles.title}>{t(Strings.form_share_title)}</div>
              <div className={styles.shareSetting}>
                {shareSettings!.shareOpened ? (
                  <>
                    <div className={styles.switcherWrapper}>
                      {isMobile ? (
                        <Switch
                          className={styles.statusSwitcher}
                          checked={shareSettings!.shareOpened}
                          onChange={() => {
                            showCloseModel();
                          }}
                          size="small"
                        />
                      ) : (
                        <Popconfirm
                          title={t(Strings.form_share_closed_popconfirm_title)}
                          content={t(Strings.form_share_closed_popconfirm_content)}
                          visible={confirmPopVisible}
                          onCancel={() => {
                            setConfirmPopVisible(false);
                          }}
                          onOk={() => {
                            onSwitchChange(false);
                            setConfirmPopVisible(false);
                          }}
                          type="warning"
                        >
                          <Switch
                            className={styles.statusSwitcher}
                            checked={shareSettings!.shareOpened}
                            onChange={() => {
                              setConfirmPopVisible(true);
                            }}
                            size="small"
                          />
                        </Popconfirm>
                      )}
                      {t(Strings.form_share_closed_desc)}
                    </div>
                    <div className={styles.shareLink}>
                      <ShareLink shareName={shareSettings?.nodeName || ''} shareSettings={shareSettings!} userInfo={userInfo} />
                    </div>
                    <div className={styles.shareContent}>
                      <div className={styles.fillSetting}>
                        <div className={styles.fillTitle}>{t(Strings.form_fill_setting)}</div>
                        <div>
                          <Radio.Group value={fillAnonymous} onChange={onFillMethodChange}>
                            <Space direction="vertical">
                              <Radio value>
                                {t(Strings.form_fill_anonymous)}
                                <div className={styles.fillRadioDesc}>{t(Strings.form_fill_anonymous_desc)}</div>
                              </Radio>
                              <Radio value={false}>
                                {t(Strings.form_fill_listed)}
                                <div className={styles.fillRadioDesc}>{t(Strings.form_fill_listed_desc)}</div>
                              </Radio>
                            </Space>
                          </Radio.Group>
                        </div>
                        {!fillAnonymous ? (
                          submitLimitRadio
                        ) : (
                          <Tooltip title={t(Strings.form_submit_anonymous_tooltip)} placement="topLeft">
                            {submitLimitRadio}
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.shareClosedContent}>
                    <div className={styles.openBtnWrap}>
                      <Button
                        color="primary"
                        disabled={switchLoading}
                        onClick={() => {
                          onSwitchChange(true);
                        }}
                      >
                        {t(Strings.form_share_opened_desc)}
                      </Button>
                    </div>
                    <div className={styles.shareClosedTips}>{t(Strings.form_fill_open_desc)}</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Skeleton count={1} width="38%" />
              <Skeleton />
              <Skeleton count={1} width="61%" />
            </>
          )}
        </div>
      ) : (
        <div style={{ padding: 24 }}>
          <DisabledShareFile style={{ width: '100%', height: 486 }} />
        </div>
      )}
    </>
  );

  return (
    <>
      {isMobile ? (
        <Popup visible={visible} height="90%" onClose={onClose} className={styles.shareDrawer}>
          {content}
        </Popup>
      ) : (
        <Modal
          className={styles.shareModal}
          visible={visible}
          width={560}
          bodyStyle={{ padding: 0 }}
          onCancel={onClose}
          destroyOnClose
          footer={null}
          centered
        >
          {content}
        </Modal>
      )}
    </>
  );
};
