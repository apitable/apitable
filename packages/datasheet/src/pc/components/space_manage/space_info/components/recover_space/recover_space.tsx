import { Button, TextButton, useThemeColors } from '@vikadata/components';
import { Api, IReduxState, Strings, t } from '@vikadata/core';
import ModalMobile from 'antd-mobile/lib/modal';
import cls from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ReturnIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_undo.svg';
import DeleteIcon from 'static/icon/space/space_img_delete.png';
import { DelSuccess } from '../del_success/del.success';
import styles from './style.module.less';

export const RecoverSpace = () => {
  const spaceInfo = useSelector((state: IReduxState) => state.space.curSpaceInfo);
  const spaceId = useSelector(state => state.space.activeId);
  const [delSuccess, setDelSuccess] = useState(false);
  const colors = useThemeColors();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const recoverSpaceConfirm = () => {
    if (!spaceId) return;
    Api.recoverSpace(spaceId).then(res => {
      const { success } = res.data;
      if (success) {
        window.location.reload();
      }
    });
  };
  const handleClick = () => {
    if (isMobile) {
      ModalMobile.alert(t(Strings.restore_space), t(Strings.modal_restore_space), [
        {
          text: t(Strings.cancel),
        },
        {
          text: t(Strings.confirm),
          onPress: recoverSpaceConfirm,
        },
      ]);
      return;
    }
    Modal.confirm({
      title: t(Strings.restore_space),
      content: t(Strings.modal_restore_space),
      onOk: recoverSpaceConfirm,
      type: 'warning',
    });
  };
  const delNowConfirm = () => {
    Api.deleteSpaceNow().then(res => {
      const { success } = res.data;
      if (success) {
        setDelSuccess(true);
      }
    });
  };
  const delNow = () => {
    if (isMobile) {
      ModalMobile.alert(t(Strings.del_space_now), t(Strings.del_space_now_tip), [
        {
          text: t(Strings.cancel),
        },
        {
          text: t(Strings.confirm),
          onPress: delNowConfirm,
          style: { color: colors.errorColor },
        },
      ]);
      return;
    }
    Modal.confirm({
      title: t(Strings.del_space_now),
      content: t(Strings.del_space_now_tip),
      onOk: delNowConfirm,
      type: 'danger',
    });
  };
  if (!spaceInfo || !spaceInfo.delTime) {
    return <></>;
  }

  const delDate = new Date(spaceInfo.delTime);

  if (isMobile) {
    return (
      <div className={cls(styles.recoverSpace, { [styles.mobileRecoverSpace]: isMobile })}>
        <div className={styles.wrapper}>
          <Image style={{ maxWidth: 'calc(100% - 150px)' }} src={DeleteIcon} alt={t(Strings.delete_space)} />
          <div className={styles.tip}>
            {dayjs(delDate).format('YYYY-MM-DD HH:mm')} {t(Strings.restore_space_confirm_delete)}
          </div>
          <div className={styles.subTip}>{t(Strings.tip_del_success)}</div>
          <Button color="primary" block onClick={handleClick} size="large" prefixIcon={<ReturnIcon fill="currentColor" />}>
            {t(Strings.restore_space)}
          </Button>
          <TextButton color="danger" block onClick={delNow} size="large">
            {t(Strings.delete_now)}
          </TextButton>
          {delSuccess && <DelSuccess tip={t(Strings.delete_workspace_succeed)} />}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recoverSpace}>
      <div className={styles.wrapper}>
        <Button color="primary" block onClick={handleClick} size="large" prefixIcon={<ReturnIcon fill="currentColor" />}>
          {t(Strings.restore_space)}
        </Button>
        <div className={styles.tip}>
          {dayjs(delDate).format('YYYY-MM-DD HH:mm')} {t(Strings.restore_space_confirm_delete)}
        </div>
        <TextButton color="danger" block onClick={delNow} size="large">
          {t(Strings.delete_now)}
        </TextButton>
      </div>
      {delSuccess && <DelSuccess tip={t(Strings.delete_workspace_succeed)} />}
    </div>
  );
};
