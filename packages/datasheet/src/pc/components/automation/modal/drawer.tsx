import { useAtomValue } from 'jotai/index';
import * as React from 'react';
import { useCallback } from 'react';
import { Strings, t } from '@apitable/core';
import { Drawer } from 'pc/shared/components/drawer/drawer';
import { Modal as ConfirmModal } from '../../common';
import { useRobotListState } from '../../robot/robot_list';
import { automationModifiedAtom } from '../controller';
import { AutomationPanel } from '../index';
import style from './styles.module.less';

export const DrawerWrapper: React.FC<React.PropsWithChildren<{
    onClose: () => void;
}>> = React.memo(({

  onClose }) => {

  const isClosedRef = React.useRef(false);
  const {
    api: { refresh },
  } = useRobotListState();
  const isModified = useAtomValue(automationModifiedAtom);
  const getCloseable = async (): Promise<boolean> => {
    if (isClosedRef.current) {
      return true;
    }
    if (!isModified) {
      return true;
    }
    const confirmPromise = await new Promise<boolean>((resolve) => {
      ConfirmModal.confirm({
        title: t(Strings.automation_not_save_warning_title),
        content: t(Strings.automation_not_save_warning_description),
        cancelText: t(Strings.cancel),
        okText: t(Strings.confirm),
        onOk: () => {
          isClosedRef.current = true;
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
        type: 'warning',
      });
    });
    return confirmPromise;
  };

  const handleCloseClick = useCallback(async () => {
    const isClosable = await getCloseable();
    if (isClosable) {
      await refresh();
      onClose();
    }
  }, [getCloseable, onClose, refresh]);

  return (
    <Drawer
      zIndex={200}
      open
      className={style.modalWrapper}
      width={'90vw'}
      onClose={handleCloseClick}
      title={
        null
      }
      destroyOnClose
      closable={false}
    >
      <AutomationPanel onClose={
        handleCloseClick
      } />
    </Drawer>
  );
});
