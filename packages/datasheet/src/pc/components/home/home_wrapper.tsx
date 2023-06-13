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

import { Typography, useThemeColors, Box, ThemeName, useTheme } from '@apitable/components';
import { integrateCdnHost, SystemConfig } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import { GithubButton } from './components/github_button';
import { NavBar } from './components/nav_bar';
import styles from './style.module.less';

export const HomeWrapper: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const colors = useThemeColors();

  const linkIcons = [
    {
      icon: SystemConfig.settings.twitter_icon.value,
      link: 'https://twitter.com/apitable_com',
    },
    {
      icon: SystemConfig.settings.linkedin_icon.value,
      link: 'https://www.linkedin.com/company/APITable',
    },
    {
      icon: SystemConfig.settings.email_icon.value,
      link: 'mailto:support@apitable.com',
    },
  ];

  let socialIconsContent;
  const disableLoginSocialIcons = getEnvVariables().LOGIN_SOCIAL_ICONS_DISABLE;
  if (disableLoginSocialIcons) {
    socialIconsContent = '';
  } else {
    socialIconsContent = (
      <div className={styles.iconContent}>
        <div className={styles.linkLine}>
          {linkIcons.map(({ icon, link }) => {
            return (
              <a key={link} href={link} target="_blank" rel="noreferrer">
                <img src={integrateCdnHost(icon)} alt="apitable" />
              </a>
            );
          })}
        </div>
        <Box marginLeft={24}>
          <GithubButton />
        </Box>
      </div>
    );
  }

  let logo = getEnvVariables().LOGIN_LOGO!;
  if (useTheme().palette.type === ThemeName.Light && getEnvVariables().LOGIN_LOGO_LIGHT) {
    logo = getEnvVariables().LOGIN_LOGO_LIGHT!;
  }

  return (
    <div className={styles.pcHome}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <img src={integrateCdnHost(logo)} width={132} alt="logo" />
          <Typography variant={'h7'} color={colors.textCommonSecondary}>
            {getEnvVariables().LOGIN_MOTTO || "let's make the world more productive!"}
          </Typography>
        </div>
        {socialIconsContent}
      </div>
      <div className={styles.main}>{children}</div>
      <div className={styles.footer}>
        <NavBar />
      </div>
    </div>
  );
};
