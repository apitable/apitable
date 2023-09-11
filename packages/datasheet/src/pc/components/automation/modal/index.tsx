import { useFormEdit } from 'pc/components/robot/robot_detail/form_edit';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { Modal as ConfirmModal } from 'pc/components/common/modal/modal/modal';
import { useRobotListState } from '../../robot/robot_list';
import { AutomationPanel } from '../index';
import style from './styles.module.less';

const StyledModal = styled(Modal)`
  position: fixed;
  height: 100%;
  right: 0;
  top: 0;
`;
const AutomationModal: React.FC<{
    onClose: () => void
}> = ({ onClose }) => {

  const isClosedRef = React.useRef(false);
  const { api: { refresh }} = useRobotListState();
  const {
    isModified
  } = useFormEdit();
  const getCloseable = async(): Promise<boolean> => {
    if(isClosedRef.current) {
      return true;
    }
    if (!isModified) {
      return true;
    }
    const confirmPromise = await new Promise<boolean>(resolve => {
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
  return (
    <StyledModal
      contentClassName={style.modalContent}
      closable={false}
      footer={null}
      isCloseable={
        getCloseable
      }
      width={1264}
      destroyOnClose
      bodyStyle={{
        padding: '0 0',
        height: '100%',
        paddingLeft: '0 !important',
        paddingRight: '0 !important'
      }}
      visible
      title={
        null
      }
      onCancel={async() => {
        const isClosable = await getCloseable();
        if(isClosable) {
          await refresh();
          onClose();
        }
      }}
    >
      <AutomationPanel />
    </StyledModal>
  );
};
export default AutomationModal;
