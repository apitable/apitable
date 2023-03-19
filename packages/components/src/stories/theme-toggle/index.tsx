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

import React, { useState } from 'react';
import { LinkButton, Box, Divider } from '../../components';
import { ThemeProvider } from '../../theme_provider';
import styled, { css } from 'styled-components';

const ThemeStyle = styled.div`
  .themeShow {
    padding: 8px 16px;
    border-radius: 4px;
    ${props => css`
      background: ${props.theme === 'light' ? 'rgb(255, 255, 255)' : '#1F1F1F'}
    `}
  }
  .storyItem {
    padding: 0 8px;
    display: inline-block;
  }
`;

interface IThemeToggle {
  lang?: 'en' | 'zh'
}

export const ThemeToggle: React.FC<React.PropsWithChildren<IThemeToggle>> = props => {
  const isEn = props.lang === 'en';
  const [theme, setTheme] = useState('light');
  return (
    <ThemeStyle theme={theme}>
      <Box display="flex" flexDirection="row-reverse">
        <LinkButton
          component="button"
          color={theme === 'light' ? undefined : '#949494'}
          style={theme === 'light' ? {
            borderBottom: '2px solid #7b67ee'
          } : undefined}
          underline={false}
          onClick={() => setTheme('light')}
        >
          {isEn ? 'Default Theme' : '默认主题'}
        </LinkButton>
        <LinkButton
          color={theme === 'dark' ? undefined : '#949494'}
          style={theme === 'dark' ? {
            borderBottom: '2px solid #7b67ee'
          } : undefined}
          component="button"
          underline={false}
          onClick={() => setTheme('dark')}
        >
          {isEn ? 'Dark Theme' : '暗黑主题'}
        </LinkButton>
      </Box>
      <Divider style={{ marginBottom: '8px' }}/>
      <ThemeProvider theme={theme}>
        <div className="themeShow">
          {Array.isArray(props.children) ? (
            props.children.map((child, idx) => (
              <div key={idx} className="storyItem">
                {child}
              </div>
            ))
          ) : props.children}
        </div>
      </ThemeProvider>
    </ThemeStyle>
  );
};