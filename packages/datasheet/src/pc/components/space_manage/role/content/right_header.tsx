import { Box, Button, Space, Typography, useThemeColors } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { useContext } from 'react';
import { RoleContext } from '../context';
import styles from './style.module.less';

export const RightHeader: React.FC<{
  count?: number;
  roleName?: string;
  buttonOpts?: {
    disabledRemoveBtn?: boolean;
  };
  openAddMemberModal?: () => void;
  onRemove?: () => void;
}> = props => {
  const colors = useThemeColors();
  const { roleName, count, buttonOpts, openAddMemberModal, onRemove } = props;
  const { manageable } = useContext(RoleContext);
  return (
    <Space size={24} vertical align="start">
      <Box display={'flex'} alignItems={'center'}>
        <Typography color={colors.textCommonPrimary} variant={'h6'}>
          {roleName || ''}
        </Typography>
        <Typography color={colors.textCommonTertiary} variant={'h6'}>
          （{t(Strings.role_item, { count: count || 0 })}）
        </Typography>
      </Box>
      {manageable && (
        <Space size={16}>
          <Button size="small" onClick={openAddMemberModal}>
            {t(Strings.add_member_or_group)}
          </Button>
          <Button
            className={styles.batchRemoveRoleButton}
            size="small"
            variant="jelly"
            disabled={buttonOpts?.disabledRemoveBtn}
            color={'danger'}
            onClick={onRemove}
          >
            {t(Strings.delete_role_member_title)}
          </Button>
        </Space>
      )}
    </Space>
  );
};
