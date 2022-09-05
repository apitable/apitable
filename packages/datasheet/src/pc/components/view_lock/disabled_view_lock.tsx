import { Button, Message, Typography } from '@vikadata/components';
import { CollaCommandName, ExecuteResult, Strings, t } from '@vikadata/core';
import { Input } from 'antd';
import styles from 'pc/components/view_lock/style.module.less';
import { IViewLockProps } from 'pc/components/view_lock/interface';
import { resourceService } from 'pc/resource_service';
import { useRef } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

export const DisabledViewLock: React.FC<Omit<IViewLockProps, 'unlockHandle'>> = ({ viewId, onModalClose }) => {
  const areaRef = useRef(null);
  const unitId = useSelector(state => state.user.info?.unitId)!;

  const openViewLock = () => {
    const value = areaRef.current!['state']['value'];
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetViewLockInfo,
      data: value ? { description: value, unitId: unitId } : { unitId: unitId },
      viewId,
    });
    if (ExecuteResult.Success === result) {
      Message.success({
        content: t(Strings.enabled_view_lock_success),
      });
      onModalClose();
    }
  };

  return (
    <div>
      <Typography variant={'body2'}>{t(Strings.enabled_view_lock_tip)}</Typography>
      <TextArea
        placeholder={t(Strings.view_lock_desc_placeholder)}
        autoSize={{ minRows: 1, maxRows: 6 }}
        className={styles.rcTextArea}
        ref={areaRef}
      />
      <div className={styles.buttonGroup}>
        <Button onClick={onModalClose}>{t(Strings.cancel)}</Button>
        <Button color={'primary'} onClick={openViewLock}>
          {t(Strings.lock)}
        </Button>
      </div>
    </div>
  );
};
