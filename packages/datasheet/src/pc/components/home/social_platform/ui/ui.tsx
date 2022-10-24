import { LinkButton, Typography, useThemeColors } from '@vikadata/components';
import { Settings, Strings, t, ThemeName } from '@apitable/core';
import { Logo } from 'pc/components/common';
import styles from './style.module.less';

export const Header = (props) => {
  return (
    <header className={styles.header}>
      <div className={styles.contentWidth}>
        {/* FIXME:THEME */}
        <Logo theme={ThemeName.Light} />
        {props.children}
      </div>
    </header>
  );
};
export const Copyright = () => {
  const colors = useThemeColors();
  return (
    <footer className={styles.copyright}>
      <Typography variant="body3" className={styles.title} color={colors.secondLevelText}>
        {t(Strings.vika_copyright)}
      </Typography>
      <LinkButton underline={false} href={Settings.chatgroup_url.value} target="_blank">{t(Strings.contact_us)}</LinkButton>
    </footer>
  );
};
