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

import { Typography, useThemeColors, Space, Box } from '@apitable/components';
import { integrateCdnHost, SystemConfig } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import { GithubButton } from './components/github_button';
import { Login } from './components/login';
import { NavBar } from './components/nav_bar';
import styles from './style.module.less';

export const PcHome: React.FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const linkIcons = [
    {
      icon: SystemConfig.settings.twitter_icon.value,
      link: 'https://twitter.com/apitable_com'
    },
    {
      icon: SystemConfig.settings.linkedin_icon.value,
      link: 'https://www.linkedin.com/company/APITable'
    },
    {
      icon: SystemConfig.settings.email_icon.value,
      link: 'mailto:support@apitable.com'
    }
  ];
  return (
    <div className={styles.pcHome}>
      <div className={styles.header}>
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
          <GithubButton/>
        </Box>
      </div>
      <div className={styles.main}>
        <Space align={'center'} vertical size={16}>
          <img src={integrateCdnHost(getEnvVariables().LOGIN_LOGO!)} alt="logo" />
          <Typography variant={'h7'} color={colors.textCommonSecondary}>
            {"let's make the world more productive!"}
          </Typography>
        </Space>
        <div className={styles.loginBox}>
          <div className={styles.bgBox1} />
          <div className={styles.bgBox2} />
          <div className={styles.bgBox3} />
          <Login />
        </div>
      </div>
      <div className={styles.footer}>
        <NavBar />
      </div>
    </div>
  );
};