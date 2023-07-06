import styles from './style.module.less';
import { InfoCircleFilled } from '@apitable/icons';
import { Button, Typography } from '@apitable/components';
import { Selectors, Strings, t } from '@apitable/core';
import { useViewPropertyUpdate } from './hooks';
import { FC } from 'react';
import cls from "classnames";
import { useSelector } from 'react-redux';

interface IProps {
    onClose: () => void
}

export const MobilePopupContent: FC<IProps> = ({ onClose }) => {

  const { datasheetId, viewId } = useSelector(state => state.pageParams);
  const currentView = useSelector(state => Selectors.getCurrentView(state, datasheetId));
  const isViewLock = Boolean(currentView?.lockInfo);
  const { cancelModification, modifyViewProperty } = useViewPropertyUpdate({
    autoSave: Boolean(currentView?.autoSave),
    datasheetId: datasheetId!,
    viewId: viewId!,
    onClose,
    isViewLock,
  });

  return (
    <div className={styles.mobileTip}>
      <span className={styles.infoIcon}>
        <InfoCircleFilled/>
      </span>
      <Typography variant={'body2'}>
        {t(Strings.view_changed)}
      </Typography>

      <div className={styles.buttons}>
        <Button variant={'jelly'} onClick={cancelModification} size={'small'}
          className={cls(styles.confirmBtn, styles.cancelBtn)}>
          {t(Strings.discard_changes)}
        </Button>

        <Button color={'primary'} size={'small'} onClick={modifyViewProperty} className={styles.confirmBtn}>
          {t(Strings.save_view_configuration)}
        </Button>
      </div>

    </div>
  );
};