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

import { Box, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons';
import { getEnvVariables } from 'pc/utils/env';

export const Header = () => {
  const colors = useThemeColors();
  return (
    <Box padding={24}>
      <Box display={'flex'} alignItems={'center'} paddingBottom={'4px'}>
        <Typography variant="h6">{t(Strings.tab_role)}</Typography>
        <a
          style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}
          target={'_blank'}
          href={getEnvVariables().SPACE_ROLE_HELP_URL}
          rel="noreferrer"
        >
          <QuestionCircleOutlined color={colors.textCommonTertiary} size={16} />
        </a>
      </Box>
      <Typography variant="body3">
        <span dangerouslySetInnerHTML={{ __html: t(Strings.manage_role_header_desc, { url: getEnvVariables().SPACE_ROLE_HELP_URL }) }} />
      </Typography>
    </Box>
  );
};
