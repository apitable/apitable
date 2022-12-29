import React, { useState } from 'react';
import { LinkButton, Box, Divider } from '../../components';
import { ThemeProvider } from '../../theme_provider';
import styled, { css } from 'styled-components';

const ThemeStyle = styled.div`
  .themeShow {
    padding: 8px 16px;
    border-radius: 4px;
    ${props => css`
      background: ${props.theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'}
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

export const ThemeToggle: React.FC<IThemeToggle> = props => {
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