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

import { Box, Button, Typography, useThemeColors } from '@apitable/components';
import { integrateCdnHost, Settings, Strings, t } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import { useContext } from 'react';
import { RoleContext } from './context';

export const Empty: React.FC<React.PropsWithChildren<{ onClick: () => void }>> = props => {
  const colors = useThemeColors();
  const { manageable } = useContext(RoleContext);
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      backgroundColor={colors.bgCommonDefault}
    >
      <Box width={480}>
        <Box textAlign={'center'} marginBottom={24}>
          <img width={320} height={228.57} src={integrateCdnHost(Settings.space_setting_role_empty_img.value)} alt="role" />
        </Box>
        <Typography variant="h5" align="center">
          {t(Strings.manage_role_empty_title)}
        </Typography>
        <Box marginTop={'8px'}>
          <Typography variant="body2">
            <span dangerouslySetInnerHTML={{ __html: t(Strings.manage_role_empty_desc1, { url: getEnvVariables().SPACE_ROLE_HELP_URL }) }} />
          </Typography>
        </Box>
        <Box borderRadius={'4px'} backgroundColor={colors.bgCommonLower} padding={'8px'} marginTop={'8px'}>
          <Typography variant="body4" color={colors.textCommonTertiary}>
            {t(Strings.manage_role_empty_desc2)}
          </Typography>
        </Box>
        {manageable && (
          <Box width={240} margin={'24px auto 0'}>
            <Button color="primary" block onClick={props.onClick}>
              {t(Strings.manage_role_empty_btn)}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
