
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { mutate } from 'swr';
import { Modal } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { Modal as ConfirmModal } from 'pc/components/common/modal/modal/modal';
import { changeActionTypeId } from '../../robot/api';
import { useRobotListState } from '../../robot/robot_list';
import { AutomationPanel } from '../index';
import style from '../run_history/modal/styles.module.less';
import { useFormEdit } from 'pc/components/robot/robot_detail/form_edit';

const StyledModal = styled(Modal)`
  background: var(--bg-common-lower, #0D0D0D);
  border: 1px solid var(--border-common-default);
  position: fixed;
  height: 100%;
  right: 0;
  top: 0;
`;
const AutomationModal: React.FC<{
    onClose: () => void
}> = ({ onClose }) => {

  const [isClosed, setIsClosed] = useState(false);

  const { api: { refresh }} = useRobotListState();
  const {
    isModified
  } = useFormEdit();
  const getCloseable = async(): Promise<boolean> => {
    if(isClosed) {
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
      width={1332}
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
