import { Drawer } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { ScreenSize, useResponsive, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { CloseOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { Popup } from 'pc/components/common/mobile/popup';
import { SettingInner } from './setting_inner';
import styles from './style.module.less';

interface ISettingProps {
  open: boolean;
  onClose: () => void;
}

const Title = ({ onClose }) => {
  const colors = useThemeColors();

  return (
    <div className={'vk-flex vk-items-center vk-justify-between'}>
      <div className={'vk-flex vk-items-center'}>
        <span style={{ marginRight: 8 }}>{t(Strings.custom_page_setting_title)}</span>
        <a href={t(Strings.embed_page_doc_url)} className={'vk-flex vk-items-center'} target={'_blank'} rel="noreferrer">
          <QuestionCircleOutlined color={colors.textCommonTertiary} />
        </a>
      </div>
      <div className={'vk-flex vk-items-center vk-cursor-pointer vk-text-textCommonPrimary'} onClick={onClose}>
        <CloseOutlined color={colors.textCommonTertiary} />
      </div>
    </div>
  );
};

export const Setting: React.FC<ISettingProps> = ({ open, onClose }) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  if (isMobile) {
    return (
      <Popup
        onClose={onClose}
        open={open}
        height={'90%'}
        className={styles.popupWrapper}
        closeIcon={null}
        destroyOnClose
        title={<Title onClose={onClose} />}
      >
        <SettingInner onClose={onClose} isMobile={isMobile} />
      </Popup>
    );
  }

  return (
    <Drawer
      zIndex={200}
      open={open}
      onClose={onClose}
      title={<Title onClose={onClose} />}
      className={classnames(styles.drawerWrapper)}
      destroyOnClose
      closable={false}
      width={'480px'}
      footer={null}
    >
      <SettingInner onClose={onClose} />
    </Drawer>
  );
};
