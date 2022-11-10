import { Box, Typography, useThemeColors } from '@vikadata/components';
import { Settings, Strings, t } from '@apitable/core';
import { InformationSmallOutlined } from '@vikadata/icons';

export const Header = () => {
  const colors = useThemeColors();
  return (
    <Box padding={24}>
      <Box display={'flex'} alignItems={'center'} paddingBottom={'4px'}>
        <Typography variant="h6">{t(Strings.tab_role)}</Typography>
        <a
          style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}
          target={'_blank'}
          href={Settings.role_help_url.value}
          rel="noreferrer"
        >
          <InformationSmallOutlined color={colors.textCommonTertiary} size={16} />
        </a>
      </Box>
      <Typography variant="body3">
        <span dangerouslySetInnerHTML={{ __html: t(Strings.manage_role_header_desc, { url: Settings.role_help_url.value }) }} />
      </Typography>
    </Box>
  );
};
