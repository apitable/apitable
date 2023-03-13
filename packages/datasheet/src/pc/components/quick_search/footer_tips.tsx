import { Space, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { EnterOutlined, UpAndDownOutlined } from '@apitable/icons';
import styles from './style.module.less';

export const FooterTips = () => {
  const colors = useThemeColors();
  const getFont = (str: string) => {
    return <Typography variant={'body4'} color={colors.textCommonTertiary}>{str}</Typography>;
  };
  return (
    <div className={styles.footerTips}>
      <Space size={8}>
        <Space size={4}>
          <UpAndDownOutlined color={colors.textCommonTertiary}/>
          {getFont(t(Strings.quick_search_shortcut_select))}
        </Space>
        <Space size={4}>
          <EnterOutlined color={colors.textCommonTertiary}/>
          {getFont(t(Strings.quick_search_shortcut_open))}
        </Space>
      </Space>
      {getFont(t(Strings.quick_search_shortcut_tab))}
    </div>
  );
};