import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'rsg-components/Logo';
import Markdown from 'rsg-components/Markdown';
import Styled from 'rsg-components/Styled';
import Version from 'rsg-components/Version';
import cx from 'clsx';
import Ribbon from 'rsg-components/Ribbon';
import { Switch } from '../components/switch';
import { useLocalStorageState } from 'ahooks';
import { light, dark } from '../theme';
import { createGlobalStyle, css } from 'styled-components';
import { ThemeProvider } from '../theme_provider';

const GlobalStyle = createGlobalStyle(props => {
  return css`
    [class^= "rsg"] {
      color: ${props.theme.palette.text.primary};
      background: ${props.theme.palette.background.primary};
    }

    pre {
      background: ${props.theme.palette.background.secondary} !important;
    }

    [class^= "rsg--table"] {
      color: ${props.theme.palette.text.secondary};
      background: ${props.theme.palette.background.primary};
    }

    a {
      color: ${props.theme.palette.primary} !important;
    }
  `;
});

// const xsmall = '@media (max-width: 600px)';

const styles = ({ color, fontFamily, fontSize, sidebarWidth, mq, space, maxWidth }) => {
  return {
    root: {
      minHeight: '100vh',
      backgroundColor: color.baseBackground,
    },
    hasSidebar: {
      paddingLeft: sidebarWidth,
      [mq.small]: {
        paddingLeft: 0,
      },
    },
    content: {
      maxWidth,
      padding: [[space[2], space[4]]],
      margin: [[0, 'auto']],
      [mq.small]: {
        padding: space[2],
      },
      display: 'block',
    },
    sidebar: {
      backgroundColor: color.sidebarBackground,
      border: [[color.border, 'solid']],
      borderWidth: [[0, 1, 0, 0]],
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: sidebarWidth,
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      [mq.small]: {
        position: 'static',
        width: 'auto',
        borderWidth: [[1, 0, 0, 0]],
        paddingBottom: space[0],
      },
    },
    logo: {
      padding: space[2],
      borderBottom: [[1, color.border, 'solid']],
    },
    footer: {
      display: 'block',
      color: color.light,
      fontFamily: fontFamily.base,
      fontSize: fontSize.small,
    },
  };
};

export function StyleGuideRenderer({ toc, version, hasSidebar, classes, title, homepageUrl, children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState('isDarkMode', { defaultValue: false});
  const theme = isDarkMode ? dark : light;
  const rootStyle = {
    background: theme.palette.background.primary
  };
  const sidebarStyle = {
    background: theme.palette.background.input
  };
  return (
    <ThemeProvider theme={isDarkMode ? dark : light}>
      <GlobalStyle />
      <div className={cx(classes.root, hasSidebar && classes.hasSidebar)} style={rootStyle}>
        <main className={classes.content}>
          {children}
          <footer className={classes.footer}>
            <Markdown text={`Created with [React Styleguidist](${homepageUrl})`} />
          </footer>
        </main>
        {hasSidebar && (
          <div className={classes.sidebar} data-testid="sidebar" style={sidebarStyle}>
            <header className={classes.logo}>
              <Logo>{title}</Logo>
              {version && <Version>{version}</Version>}
              <Switch checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />黑暗模式
            </header>
            {toc}
          </div>
        )}
        <Ribbon />
      </div>
    </ThemeProvider>
  );
}

StyleGuideRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  homepageUrl: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Styled(styles)(StyleGuideRenderer);
