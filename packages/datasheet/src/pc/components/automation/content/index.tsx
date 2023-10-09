import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useAtom } from 'jotai';
import { FunctionComponent, memo, useContext } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled, { css } from 'styled-components';
import { Box, Switch, Typography, useThemeColors, useThemeMode } from '@apitable/components';
import { IReduxState, Strings, t } from '@apitable/core';
import { VikaSplitPanel } from 'pc/components/common';
import { useResponsive, useSideBarVisible } from '../../../hooks';
import { ScreenSize } from '../../common/component_display';
import { OrEmpty } from '../../common/or_empty';
import { useAutomationRobot, useToggleRobotActive } from '../../robot/hooks';
import { RobotDetailForm } from '../../robot/robot_detail';
import { ShareContext } from '../../share';
import { ListWithFooter } from '../components/list_with_footer';
import { automationPanelAtom, PanelName } from '../controller/atoms';
import { useAutomationResourcePermission } from '../controller/use_automation_permission';
import { Side } from './side';
import styles from './styles.module.less';

export const ConstAutomationContentLeft = 'automation-content-left';

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

const ShadowBox = styled(Box)<{ theme: string }>`
  ${(props) =>
    props.theme === 'light' &&
    css`
      background: linear-gradient(180deg, rgba(240, 241, 245, 0) 0%, #f0f1f5 100%);
    `}
  ${(props) =>
    props.theme === 'dark' &&
    css`
      background: linear-gradient(180deg, rgba(13, 13, 13, 0) 0%, #0d0d0d 100%);
    `}
`;
export const CONST_BG_CLS_NAME = 'cls-content-bg';

export const AutomationPanelContent: FunctionComponent<{}> = memo(() => {
  const { resourceId, currentRobotId, robot } = useAutomationRobot();

  const permissions = useAutomationResourcePermission();

  const colors = useThemeColors();

  const { loading, toggleRobotActive } = useToggleRobotActive(resourceId!, currentRobotId!);

  const [panel, setPanel] = useAtom(automationPanelAtom);

  const theme = useThemeMode();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.lg);
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const invisible = panel.panelName ==undefined || isMobile;

  const { shareInfo } = useContext(ShareContext);
  const user = useSelector((state: IReduxState) => state.user);

  if (!robot) {
    return null;
  }

  return (
    <Box display="flex" flexDirection={'row'} height={'100%'} position={'relative'}>
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ width }) =>(
          <VikaSplitPanel
            size={invisible?width: width - 480}
            maxSize={invisible? width: width - 320}
            minSize={invisible? width:width - 800}
            style={shareStyle}
            panelLeft={
              <Left
                height={'100%'}
                backgroundColor={colors.bgCommonLower}
                className={ConstAutomationContentLeft}
                onClick={(e) => {
                  // @ts-ignore
                  if (e.target?.className?.includes?.(CONST_BG_CLS_NAME)) {
                    if (panel.panelName != PanelName.BasicInfo) {

                      if(isMobile) {
                        setSideBarVisible(false);
                      }
                      setPanel((draft) => {
                        draft.panelName = PanelName.BasicInfo;
                        draft.dataId = undefined;
                      });
                    }
                  }
                }}
              >
                <ListWithFooter
                  className={CONST_BG_CLS_NAME}
                  footer={
                    <OrEmpty visible={user.isLogin && (permissions.editable || shareInfo?.allowEdit) }>
                      <Box display={'flex'} flexDirection="row" justifyContent={'center'} flex={'0 0 80px'} alignItems={'end'}>
                        <ShadowBox theme={theme} position={'absolute'} left={0} bottom={80} width={'100%'} height={'20px'} />
                        <Box paddingBottom={'24px'}>
                          <Switch
                            text={robot.isActive ? t(Strings.disable) : t(Strings.enable)}
                            size={'xl'}
                            loadingIcon={<></>}
                            clazz={{
                              checkedText: styles.checkedText,
                              unCheckedText: styles.unCheckedText,
                              unCheckedCircle: styles.unCheckedCircle,
                              checkedCircle: styles.checkedCircle,
                              checkedBackground: styles.checkedBackground,
                              unCheckedBackground: styles.unCheckedBackground,
                            }}
                            checked={robot.isActive}
                            onClick={toggleRobotActive}
                            loading={loading}
                            disabled={loading}
                          />
                        </Box>
                      </Box>
                    </OrEmpty>
                  }
                >
                  <Box width={'400px'} margin={'0 auto'}>

                    <RobotDetailForm />
                  </Box>
                </ListWithFooter>
              </Left>
            }
            panelRight={
              <>
                {
                  !invisible && (
                    <Box className={'flex-auto'} height={'100%'} backgroundColor={colors.bgCommonDefault} overflowY={'auto'}>
                      <Tabs className={styles.tabItem}>
                        <TabPane
                          className={styles.tabPannel}
                          tab={
                            <Typography variant="body2" color={colors.textBrandDefault}>
                              {t(Strings.automation)}
                            </Typography>
                          }
                          key={t(Strings.automation)}
                        >
                          <Side />
                        </TabPane>

                        <TabPane
                          tab={
                            <Box display={'inline-flex'} alignItems={'center'}>
                              <Typography variant="body2" color={colors.textCommonTertiary}>
                                {t(Strings.ai_chat)}
                              </Typography>
                              <Box height={'20px'} border={'1px'} backgroundColor={colors.bgTagDefault} marginLeft={'8px'} padding={'0 4px'}>
                                <Typography variant="body4" color={colors.textCommonTertiary}>
                                  {t(Strings.automation_stay_tuned)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          key={t(Strings.automation_stay_tuned)}
                          disabled
                        />
                      </Tabs>
                    </Box>
                  )
                }
              </>
            }
          />
        )
        }
      </AutoSizer>
    </Box>
  );
});
