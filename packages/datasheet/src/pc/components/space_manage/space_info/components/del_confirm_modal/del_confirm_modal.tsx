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

import Image from 'next/image';
import * as React from 'react';
import { FC } from 'react';
import { shallowEqual } from 'react-redux';
import { Button, useThemeColors } from '@apitable/components';
import { Api, IReduxState, Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common/message';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import { useRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import DeleteIcon from 'static/icon/space/space_img_delete.png';
import styles from './style.module.less';

export interface IDelConfirmModalProps {
  setIsDelSpaceModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

export const DelConfirmModal: FC<React.PropsWithChildren<IDelConfirmModalProps>> = (props) => {
  const { setIsDelConfirmModal, setIsDelSpaceModal, isMobile } = props;
  const colors = useThemeColors();

  const { user, spaceId } = useAppSelector(
    (state: IReduxState) => ({
      spaceId: state.space.activeId || '',
      user: state.user.info,
    }),
    shallowEqual,
  );

  const { run: del, loading } = useRequest(Api.deleteSpace, {
    manual: true,
    onSuccess: (res) => {
      const { success, message } = res.data;
      if (success) {
        handleCancel();
        return;
      }
      Message.error({ content: message });
    },
  });
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
    // Otherwise, the verification is skipped directly
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
          <div className={styles.subTitle}>{t(Strings.space_info_del_confirm1)}</div>
          <ul className={styles.items}>
            <li>{t(Strings.workspace_data)}</li>
            <li>{t(Strings.workspace_files)}</li>
            <li>{t(Strings.contact_data)}</li>
            <li>{t(Strings.attachment_data)}</li>
          </ul>
          <div className={styles.subTitle}>{t(Strings.space_info_del_confirm2)}</div>
        </div>
        <WrapperTooltip style={{ width: '100%' }} tip={t(Strings.unauthorized_operation)} wrapper={!user?.isMainAdmin}>
          <Button
            className={styles.btn}
            htmlType="submit"
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
      <Popup
        visible
        title={t(Strings.delete_space)}
        placement="bottom"
        headerStyle={{ borderBottom: 'none' }}
        height={588}
        onClose={handleCancel}
        closeIcon={<CloseOutlined size={16} color={colors.thirdLevelText} />}
      >
        {renderContent()}
      </Popup>
    );
  }

  return (
    <Modal visible footer={null} width={390} maskClosable onCancel={handleCancel} centered className="modal">
      {renderContent()}
    </Modal>
  );
};
