import { Box, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { InformationSmallOutlined } from '@apitable/icons';
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
          <InformationSmallOutlined color={colors.textCommonTertiary} size={16} />
        </a>
      </Box>
      <Typography variant="body3">
        <span dangerouslySetInnerHTML={{ __html: t(Strings.manage_role_header_desc, { url: getEnvVariables().SPACE_ROLE_HELP_URL }) }} />
      </Typography>
    </Box>
  );
};
