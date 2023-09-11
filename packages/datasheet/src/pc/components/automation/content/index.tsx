import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useAtom } from 'jotai';
import { FunctionComponent } from 'react';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { Box, Switch, Typography, useThemeColors, useThemeMode } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { VikaSplitPanel } from 'pc/components/common';
import { useRobot, useToggleRobotActive } from '../../robot/hooks';
import { RobotDetailForm } from '../../robot/robot_detail';
import { automationPanelAtom, PanelName } from '../controller';
import { ListWithFooter } from '../trigger/list_with_footer';
import { Side } from './side';
import styles from './styles.module.less';


export const ConstAutomationContentLeft = 'automation-content-left';

const CONST_RIGHT_PANEL_WIDTH = '480px';

const shareStyle: React.CSSProperties = {
  overflow: 'hidden',
  borderRadius: '8px',
  height: '100%',
};

const Left = styled(Box)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  border-right-color: var(--borderCommonDefault);
  border-right-width: 1px;
  border-right-style: solid;
`;

const ShadowBox = styled(Box)<{theme: string}>`
  ${props => props.theme === 'light' && css`
    background: linear-gradient(180deg, rgba(240, 241, 245, 0.00) 0%, #F0F1F5 100%);
  `}
  ${props => props.theme === 'dark' && css`
    background:  linear-gradient(180deg, rgba(13, 13, 13, 0.00) 0%, #0D0D0D 100%);
  `}
`;
export const CONST_BG_CLS_NAME = 'cls-content-bg';

export const AutomationPanelContent: FunctionComponent<{
}> = () => {

  const {
    resourceId,
    currentRobotId, robot,
  } = useRobot();

  console.log('AutomationPanelContent render');
  const colors = useThemeColors();

  const { loading, toggleRobotActive } = useToggleRobotActive(resourceId!, currentRobotId!);

  const [panel, setPanel] = useAtom(automationPanelAtom);

  const theme = useThemeMode();
  if(!robot) {
    return null;
  }

  return (
    <Box display='flex' flexDirection={'row'} height={'100%'} position={'relative'}>
      <VikaSplitPanel
        size={820}
        style={shareStyle}
        panelLeft={
          <Left
            height={'100%'}
            backgroundColor={colors.bgCommonLower}
            className={ConstAutomationContentLeft}
            onClick={(e) => {
              // @ts-ignore
              if(e.target?.className?.includes?.(CONST_BG_CLS_NAME)) {
                if(panel.panelName != PanelName.BasicInfo) {
                  setPanel(draft => {
                    draft.panelName = PanelName.BasicInfo;
                  });
                }
              }
            }}>
            <ListWithFooter className={CONST_BG_CLS_NAME} footer={

              <Box display={'flex'}
                flexDirection='row' justifyContent={'center'} flex={'0 0 80px'} alignItems={'end'}>

                <ShadowBox
                  theme={theme}
                  position={'absolute'}
                  left={0}
                  bottom={80}
                  width={'100%'}
                  height={'20px'}
                />
                <Box paddingBottom={'24px'}>
                  <Switch
                    text={
                      robot.isActive?
                        t(Strings.disable):
                        t(
                          Strings.enable
                        )
                    }
                    size={'xl'} clazz={{
                      unCheckedCircle: styles.unCheckedCircle,
                      checkedCircle: styles.checkedCircle,
                      checkedBackground: styles.checkedBackground,
                      unCheckedBackground: styles.unCheckedBackground,
                    }}
                    checked={robot.isActive} onClick={toggleRobotActive} loading={loading} disabled={loading} />
                </Box>
              </Box>
            }>
              <Box width={'400px'} margin={'0 auto'}>
                <RobotDetailForm />
              </Box>
            </ListWithFooter>
          </Left>
        }
        panelRight={
          <Box className={'flex-auto'}
            height={'100%'}
            backgroundColor={colors.bgCommonDefault} overflowY={'auto'}>
            <Tabs className={styles.tabItem}>
              <TabPane className={styles.tabPannel } tab={
                <Typography variant="body2" color={colors.textBrandDefault}>
                  {
                    t(Strings.automation)
                  }
                </Typography>
              } key={t(Strings.automation)} >
                <Side />
              </TabPane>

              <TabPane tab={

                <Box display={'inline-flex'} alignItems={'center'}>
                  <Typography variant="body2" color={colors.textCommonTertiary}>
                    {
                      t(Strings.ai_chat)
                    }
                  </Typography>
                  <Box height={'20px'} border={'1px'} backgroundColor={colors.bgTagDefault} marginLeft={'8px'} padding={'0 4px'}>
                    <Typography variant="body4" color={colors.textCommonTertiary}>
                      {
                        t(Strings.automation_stay_tuned)
                      }
                    </Typography>
                  </Box>
                </Box>
              } key={t(Strings.automation_stay_tuned)} disabled />
            </Tabs>
          </Box>
        }
      />
    </Box>
  );
};
