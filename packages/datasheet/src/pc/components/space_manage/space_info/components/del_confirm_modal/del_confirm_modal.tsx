import { Button, useThemeColors } from '@vikadata/components';
import { Api, IReduxState, Strings, t } from '@vikadata/core';
import { Drawer } from 'antd';
import Image from 'next/image';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import { useRequest } from 'pc/hooks';
import * as React from 'react';
import { FC } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_small.svg';
import DeleteIcon from 'static/icon/space/space_img_delete.png';
import styles from './style.module.less';

export interface IDelConfirmModalProps {
  setIsDelSpaceModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

export const DelConfirmModal: FC<IDelConfirmModalProps> = props => {
  const { setIsDelConfirmModal, setIsDelSpaceModal, isMobile } = props;
  const colors = useThemeColors();

  const { user, spaceId } = useSelector((state: IReduxState) => ({
    spaceId: state.space.activeId || '',
    user: state.user.info
  }), shallowEqual);

  const { run: del, loading } = useRequest(
    Api.deleteSpace,
    {
      manual: true,
      onSuccess: (res) => {
        const { success, message } = res.data;
        if (success) {
          handleCancel();
          return;
        }
        Message.error({ content: message });
      }
    }
  );
  const handleCancel = () => {
    setIsDelConfirmModal(false);
  };
  const handleClick = () => {
    if (!user) return;
    if (user.mobile || user.email) {
      setIsDelSpaceModal(true);
      handleCancel();
      return;
    }
    // 否则直接跳过验证
    del(spaceId);
  };

  const renderContent = () => {
    return (
      <div className={styles.delSpaceModal}>
        <div className={styles.delLogo}>
          <Image src={DeleteIcon} alt={t(Strings.delete_space)} width={160} height={120} />
        </div>
        <div className={styles.title}>{t(Strings.delete_space)}</div>
        <div className={styles.tip}>
          <div className={styles.subTitle}>
            {t(Strings.space_info_del_confirm1)}
          </div>
          <ul className={styles.items}>
            <li>{t(Strings.workspace_data)}</li>
            <li>{t(Strings.workspace_files)}</li>
            <li>{t(Strings.contact_data)}</li>
            <li>{t(Strings.attachment_data)}</li>
            {/* <li>模板商城模板</li> */}
          </ul>
          <div className={styles.subTitle}>
            {t(Strings.space_info_del_confirm2)}
          </div>
        </div>
        <WrapperTooltip
          style={{ width: '100%' }}
          tip={t(Strings.unauthorized_operation)}
          wrapper={!user?.isMainAdmin}
        >
          <Button
            className={styles.btn}
            htmlType='submit'
            color={isMobile ? 'primary' : 'danger'}
            onClick={handleClick}
            loading={loading}
            disabled={!user?.isMainAdmin}
          >
            {t(Strings.confirm_delete)}
          </Button>
        </WrapperTooltip>

      </div>
    );
  };

  if (isMobile) {
    return (
      <Drawer
        visible
        title={t(Strings.delete_space)}
        placement='bottom'
        headerStyle={{ borderBottom: 'none' }}
        height={588}
        onClose={handleCancel}
        closeIcon={<CloseIcon width={16} height={16} fill={colors.thirdLevelText} />}
      >
        {renderContent()}
      </Drawer>
    );
  }

  return (
    <Modal
      visible
      footer={null}
      width={390}
      maskClosable
      onCancel={handleCancel}
      centered
      className='modal'
    >
      {renderContent()}
    </Modal>
  );
};
