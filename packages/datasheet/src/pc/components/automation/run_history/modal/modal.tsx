import * as React from 'react';
import styled from 'styled-components';
import { Box, IconButton, Modal, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { HistoryModalContent } from './index';
import style from './styles.module.less';

const StyledModal = styled(Modal)`
  background: var(--bg-common-lower, #0d0d0d);
  border: 1px solid var(--border-common-default);
`;
const AutomationHistoryPanel: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const colors = useThemeColors();
  return (
    <StyledModal
      centered
      contentClassName={style.modalContent}
      footer={null}
      closable={false}
      width={1332}
      destroyOnClose={false}
      bodyStyle={{
        padding: '0 0',
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
      }}
      visible
      title={
        <Box
          height={'52px'}
          display={'flex'}
          alignItems={'center'}
          paddingLeft={'16px'}
          paddingRight={'16px'}
          justifyContent={'space-between'}
          borderBottom={'1px solid var(--borderCommonDefault)'}
          backgroundColor={colors.bgCommonDefault}
        >
          <Typography variant="h6" color={colors.textCommonPrimary}>
            {t(Strings.robot_run_history_title)}
          </Typography>

          <IconButton shape="square" onClick={onClose} icon={CloseOutlined} />
        </Box>
      }
      onCancel={() => onClose()}
    >
      <HistoryModalContent />
    </StyledModal>
  );
};
export default AutomationHistoryPanel;
