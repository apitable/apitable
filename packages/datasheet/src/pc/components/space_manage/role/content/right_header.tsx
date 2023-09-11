/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useContext } from 'react';
import { Box, Button, Space, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { RoleContext } from '../context';
import styles from './style.module.less';

export const RightHeader: React.FC<
  React.PropsWithChildren<{
    count?: number;
    roleName?: string;
    buttonOpts?: {
      disabledRemoveBtn?: boolean;
    };
    openAddMemberModal?: () => void;
    onRemove?: () => void;
  }>
> = (props) => {
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
