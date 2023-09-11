import classNames from 'classnames';
import { Space, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { EnterOutlined, EscOutlined, UpAndDownOutlined } from '@apitable/icons';
import { browser } from 'modules/shared/browser';
import { ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import styles from './style.module.less';

export const FooterTips: React.FC<{ shortcutEsc?: boolean }> = (props) => {
  const { shortcutEsc } = props;
  const colors = useThemeColors();
  const getFont = (str: string) => {
    return (
      <Typography variant={'body4'} color={colors.textCommonTertiary}>
        {str}
      </Typography>
    );
  };
  if (shortcutEsc) {
    return (
      <div className={classNames(styles.footerTips, styles.footerTipsEsc)}>
        <Space size={8}>
          {getShortcutKeyString(ShortcutActionName.SearchNode)
            .split(browser?.is('Windows') ? ' + ' : ' ')
            .map((v: string, key: number) => {
              return (
                <div className={styles.footerIconBox} key={key}>
                  {getFont(v)}
                </div>
              );
            })}
        </Space>
      </div>
    );
  }
  return (
    <div className={styles.footerTips}>
      <Space size={16}>
        <Space size={8}>
          <div className={styles.footerIconBox}>
            <UpAndDownOutlined size={12} color={colors.textCommonTertiary} />
          </div>
          {getFont(t(Strings.quick_search_shortcut_select))}
        </Space>
        <Space size={8}>
          <div className={styles.footerIconBox}>
            <EnterOutlined size={12} color={colors.textCommonTertiary} />
          </div>
          {getFont(t(Strings.quick_search_shortcut_open))}
        </Space>
        <Space size={8}>
          <div className={styles.footerIconBox}>
            <EscOutlined size={12} color={colors.textCommonTertiary} />
          </div>
          {getFont(t(Strings.quick_search_shortcut_esc))}
        </Space>
      </Space>
      {getFont(t(Strings.quick_search_shortcut_tab))}
    </div>
  );
};
