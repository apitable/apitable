import { Box, useTheme, ThemeProvider } from '@vikadata/components';
import { memo } from 'react';
import { SWRConfig } from 'swr';
import { Selectors } from '@apitable/core';
import { useSelector } from 'react-redux';
import { RobotContextProvider } from '../robot_context';
import { RobotList } from '../robot_list';
import { RobotHead } from './robot_head';
import { RobotCreateGuideModal } from '../robot_create_guide';

const RobotBase = () => {
  const cacheTheme = useSelector(Selectors.getTheme);

  const theme = useTheme();

  return (
    <RobotContextProvider>
      <ThemeProvider theme={cacheTheme}>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
          }}
        >
          <RobotCreateGuideModal />
          <Box
            height="50px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding="16px"
            borderBottom={`1px solid ${theme.color.lineColor}`}
            position="relative"
            backgroundColor={theme.color.bgCommonDefault}
          >
            <RobotHead />
          </Box>
          <Box overflow="auto" padding="16px" backgroundColor={theme.color.fc8} height="calc(100vh - 49px)">
            <RobotList />
          </Box>
        </SWRConfig>
      </ThemeProvider>
    </RobotContextProvider>
  );
};

const RobotPanel = memo(RobotBase);

export default RobotPanel;