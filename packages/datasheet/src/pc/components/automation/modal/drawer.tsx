import { useAtomValue } from 'jotai';
import * as React from 'react';
import { useCallback } from 'react';
import { Strings, t } from '@apitable/core';
import { Drawer } from 'pc/shared/components/drawer/drawer';
import { Modal as ConfirmModal } from '../../common';
import { automationActionsAtom, automationLocalMap, automationTriggersAtom } from '../controller/atoms';
import { AutomationPanel } from '../panel';
import { checkIfModified } from './step_input_compare';
import style from './styles.module.less';

export const DrawerWrapper: React.FC<React.PropsWithChildren<{
    onClose: () => void;
}>> = React.memo(({

  onClose }) => {

  const isClosedRef = React.useRef(false);

  const triggers = useAtomValue(automationTriggersAtom);
  const actions = useAtomValue(automationActionsAtom);

  const localMap = useAtomValue(automationLocalMap);

  const getCloseable = async (): Promise<boolean> => {
    if (isClosedRef.current) {
      return true;
    }

    if (!checkIfModified({
      triggers,
      actions
    }, localMap)) {
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
      onClose();
    }
  }, [getCloseable, onClose]);

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

export default DrawerWrapper;
