import cls from 'classnames';
import { FC } from 'react';
import { Button, Typography } from '@apitable/components';
import { Selectors, Strings, t } from '@apitable/core';
import { InfoCircleOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { cancelModification, modifyViewProperty } from '../request_view_property_change';
import styles from '../style.module.less';

interface IProps {
  onClose: () => void;
}

export const MobilePopupContent: FC<IProps> = ({ onClose }) => {
  const { datasheetId, viewId } = useAppSelector((state) => state.pageParams);
  const currentView = useAppSelector((state) => Selectors.getCurrentView(state, datasheetId));
  const isViewLock = Boolean(currentView?.lockInfo);

  const viewPropertyProps = {
    autoSave: Boolean(currentView?.autoSave),
    datasheetId: datasheetId!,
    viewId: viewId!,
    onClose,
    isViewLock,
  };

  return (
    <div className={styles.mobileTip}>
      <span className={styles.infoIcon}>
        <InfoCircleOutlined color={'var(--textBrandDefault)'} />
      </span>
      <Typography variant={'body2'}>{t(Strings.view_changed)}</Typography>

      <div className={styles.buttons}>
        <Button
          variant={'jelly'}
          onClick={() => cancelModification(viewPropertyProps)}
          size={'small'}
          className={cls(styles.confirmBtn, styles.cancelBtn)}
        >
          {t(Strings.discard_changes)}
        </Button>

        <Button color={'primary'} size={'small'} onClick={() => modifyViewProperty(viewPropertyProps)} className={styles.confirmBtn}>
          {t(Strings.save_view_configuration)}
        </Button>
      </div>
    </div>
  );
};
