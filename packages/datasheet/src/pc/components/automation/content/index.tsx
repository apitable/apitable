import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useAtom } from 'jotai';
import { FunctionComponent } from 'react';
import * as React from 'react';
import styled from 'styled-components';
import { Box, Switch, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useRobot, useToggleRobotActive } from '../../robot/hooks';
import { RobotDetailForm } from '../../robot/robot_detail';
import { automationPanelAtom, PanelName } from '../controller';
import { ListWithFooter } from '../trigger/list_with_footer';
import { Side } from './side';
import styles from './styles.module.less';

export const ConstAutomationContentLeft = 'automation-content-left';

const Left = styled(Box)`
  flex: 1 1 auto;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  border-right-color: var(--borderCommonDefault);
  border-right-width: 1px;
  border-right-style: solid;
`;

export const CONST_BG_CLS_NAME = 'cls-content-bg';

export const AutomationPanelContent: FunctionComponent<{
}> = () => {

  const {
    currentRobotId, robot,
  } = useRobot();

  const colors = useThemeColors();

  const { loading, toggleRobotActive } = useToggleRobotActive(currentRobotId!);

  const [panel, setPanel] = useAtom(automationPanelAtom);

  if(!robot) {
    return null;
  }

  return (
    <Box display='flex' flexDirection={'row'} height={'100%'}>
      <Left
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
          <Box display={'flex'} flexDirection='row' justifyContent={'center'} flex={'0 0 80px'} alignItems={'end'}>
            <Box paddingBottom={'24px'}>
              <Switch
                text={
                  robot.isActive?
                    t(
                      Strings.enable
                    ):
                    t(Strings.disable)
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

      <Box className={'flex-auto'}
        backgroundColor={colors.bgCommonDefault}
        style={{ width: '480px' }} overflowY={'auto'}>
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
                AI Chat
              </Typography>
              <Box height={'20px'} border={'1px'} backgroundColor={colors.bgTagDefault} marginLeft={'8px'} padding={'0 4px'}>
                <Typography variant="body4" color={colors.textCommonTertiary}>
                  Stay tuned
                </Typography>
              </Box>
            </Box>
          } key={'disblaed'} disabled />
        </Tabs>
      </Box>
    </Box>
  );
};
