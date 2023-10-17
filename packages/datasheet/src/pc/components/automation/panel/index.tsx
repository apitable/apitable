import { useMount } from 'ahooks';
import { Space } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import React, { FC, memo, useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  ContextMenu,
  FloatUiTooltip as Tooltip,
  FloatUiTooltip,
  IconButton,
  Skeleton,
  TextButton,
  useContextMenu,
  useThemeColors
} from '@apitable/components';
import { ConfigConstant, DATASHEET_ID, IReduxState, StoreActions, Strings, t } from '@apitable/core';
import {
  BookOutlined,
  CloseOutlined,
  DeleteOutlined,
  MoreStandOutlined,
  QuestionCircleOutlined,
  ShareOutlined
} from '@apitable/icons';
import { MobileToolBar } from 'pc/components/automation/panel/Toobar';
import { useResponsive, useSideBarVisible } from '../../../hooks';
import { useAppDispatch } from '../../../hooks/use_app_dispatch';
import { flatContextData, getPermission } from '../../../utils';
import { NodeIcon } from '../../catalog/tree/node_icon';
import { Message, Modal, Tag, TagColors } from '../../common';
import { ScreenSize } from '../../common/component_display';
import { NodeFavoriteStatus } from '../../common/node_favorite_status';
import { OrEmpty } from '../../common/or_empty';
import {
  deleteRobot,
  getResourceAutomationDetail,
  getResourceAutomations,
} from '../../robot/api';
import { useAutomationRobot } from '../../robot/hooks';
import { AutomationScenario } from '../../robot/interface';
import { IAutomationRobotDetailItem } from '../../robot/robot_context';
import { EditableInputDescription } from '../../robot/robot_detail/input_desc';
import { InputTitle } from '../../robot/robot_detail/input_title';
import { ShareContext } from '../../share';
import { DescriptionModal } from '../../tab_bar/description_modal';
import { ToolItem } from '../../tool_bar/tool_item';
import { AutomationPanelContent } from '../content';
import {
  automationDrawerVisibleAtom,
  automationHistoryAtom,
  automationPanelAtom,
  automationStateAtom,
  PanelName, useAutomationController
} from '../controller';
import { useAutomationNavigateController } from '../controller/controller';
import { useAutomationResourceNode, useAutomationResourcePermission } from '../controller/use_automation_permission';
import AutomationHistoryPanel from '../run_history/modal/modal';
import styles from '../style.module.less';

export const MenuID = 'MoreAction';

export const AutomationPanel: FC<{ onClose?: () => void, resourceId?: string }> = memo(({ onClose, resourceId }) => {
  const { show } = useContextMenu({ id: MenuID });

  const { currentRobotId } = useAutomationRobot();
  const setPanel = useSetAtom(automationPanelAtom);
  const [automationState, setAutomationState] = useAtom(automationStateAtom);
  const [historyDialog, setHistoryDialog] = useAtom(automationHistoryAtom);
  const [, setShowModal] = useAtom(automationDrawerVisibleAtom);

  const { shareInfo } = useContext(ShareContext);
  const { initialize } = useAutomationNavigateController();
  const dispatch = useAppDispatch();
  const loading = false;
  const { templateId } = useSelector((state: IReduxState) => state.pageParams);

  const { screenIsAtMost } = useResponsive();
  const isLg = screenIsAtMost(ScreenSize.lg);
  const isXl = screenIsAtMost(ScreenSize.xl);

  useMount(() => {
    isXl && setSideBarVisible(false);
    initialize();
  });

  useEffect(() => {
    if (!resourceId) {
      return;
    }
    getResourceAutomations(resourceId, {
      shareId: shareInfo?.shareId,
    }).then(async (res) => {
      const firstItem = res[0];
      const itemDetail = await getResourceAutomationDetail(
        resourceId,
        firstItem.robotId,
        {
          shareId: shareInfo?.shareId
        }
      );
      setPanel(
        {
          panelName: isLg? undefined: PanelName.BasicInfo
        });

      if (itemDetail.relatedResources) {
        itemDetail.relatedResources.forEach(resource => {
          if(resource.nodeId.startsWith('dst')) {
            dispatch(
              StoreActions.fetchDatasheet(resource.nodeId)
            );
          }
        });
      }

      setAutomationState({
        scenario: AutomationScenario.node,
        currentRobotId: itemDetail.robotId,
        resourceId: resourceId,
        robot: itemDetail as IAutomationRobotDetailItem,
      });
    }).catch((e) => {
      console.log(e);
    });
  }, [dispatch, isLg, resourceId, setAutomationState, setPanel, shareInfo]);

  const handleDeleteRobot = () => {
    Modal.confirm({
      title: t(Strings.robot_delete),
      content: t(Strings.robot_delete_confirm_desc),
      cancelText: t(Strings.cancel),
      okText: t(Strings.confirm),
      onOk: async () => {
        if (!currentRobotId) {
          return;
        }
        if (!automationState?.resourceId) {
          return;
        }
        const isRespOk = await deleteRobot(automationState?.resourceId, currentRobotId);
        if (isRespOk) {
          setAutomationState(undefined);
          Message.success({
            content: t(Strings.delete_succeed),
          });
          setShowModal(false);
        }
      },
      onCancel: () => {
        return;
      },
      type: 'danger',
    });
  };
  const menuData = [
    [
      {
        text: t(Strings.robot_delete),
        icon: <DeleteOutlined/>,
        onClick: handleDeleteRobot,
      },
    ],
  ];

  const colors = useThemeColors();
  const nodeItem = useAutomationResourceNode();

  const { api: { refreshItem } } = useAutomationController();
  const { setSideBarVisible } = useSideBarVisible();

  const permission = useAutomationResourcePermission();

  const inheritedRole = useMemo(()=> {
    if(nodeItem?.role) {
      return nodeItem.role;
    }
    if(permission.manageable) {
      return ConfigConstant.Role.Manager;
    }

    if(permission.editable) {
      return ConfigConstant.Role.Editor;
    }

    return ConfigConstant.Role.Reader;

  }, [nodeItem?.role, permission.editable, permission.manageable]);
  if(automationState?.scenario === AutomationScenario.node) {
    if(!templateId && nodeItem == null) {
      return null;
    }
  }
  if (currentRobotId == null) {
    return null;
  }

  return (
    <Box display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'} overflowY={'hidden'}>

      <OrEmpty visible={isLg &&  automationState?.scenario === AutomationScenario.node } >
        <MobileToolBar />
      </OrEmpty>

      <OrEmpty visible={!isLg ||  automationState?.scenario !== AutomationScenario.node } >
        <Box
          flex={'0 0 72px'}
          backgroundColor={colors.bgCommonDefault}
          borderBottom={`1px solid ${colors.borderCommonDefault}`}
          className={styles.tabBarWrapper1}
          id={DATASHEET_ID.VIEW_TAB_BAR}
        >
          {loading ? (
            <Space style={{ margin: '8px 20px' }}>
              <Skeleton style={{ height: 24, width: 340, marginTop: 0 }}/>
            </Space>
          ) : (
            <Box
              display={'flex'}
              height={'100%'}
              width={'100%'}
              flexDirection={'row'}
              padding={'0 20px'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box display={'flex'} flexDirection={'column'}>

                <Box display={'inline-flex'} alignItems={'center'} flexDirection={'row'}>
                  {
                    automationState?.scenario === AutomationScenario.node && (
                      <Box width={'23px'} height={'23px'} display={'flex'} alignItems={'center'}
                        style={{ cursor: 'pointer' }}>
                        <NodeIcon nodeId={automationState?.resourceId ?? ''} type={
                          ConfigConstant.NodeType.AUTOMATION
                        } icon={nodeItem?.icon} editable={permission.manageable} size={16} hasChildren/>
                      </Box>
                    )
                  }
                  <InputTitle/>
                  {
                    automationState?.scenario === AutomationScenario.node && (
                      <>
                        {
                          permission.editable && (
                            <NodeFavoriteStatus nodeId={automationState?.resourceId ?? ''} enabled={
                              nodeItem.nodeFavorite
                            }/>
                          )
                        }
                        {
                          !templateId && (
                            <Box marginX={'4px'}>
                              <Tag color={TagColors[inheritedRole]}>
                                {ConfigConstant.permissionText[getPermission(inheritedRole, { shareInfo: shareInfo })]}
                              </Tag>
                            </Box>
                          )
                        }
                      </>
                    )
                  }

                </Box>

                <OrEmpty visible={!isLg}>
                  <>
                    {
                      automationState?.scenario !== AutomationScenario.node ? (
                        <EditableInputDescription />
                      ): (
                        <DescriptionModal
                          onVisibleChange={refreshItem}
                          activeNodeId={automationState?.resourceId!} datasheetName={nodeItem?.nodeName ?? automationState?.robot?.name ?? ''} showIntroduction showIcon={false} />
                      )
                    }
                  </>
                </OrEmpty>
              </Box>

              <Box display="flex" alignItems="center">

                <OrEmpty
                  visible={permission.sharable && automationState?.scenario === AutomationScenario.node}>
                  {
                    nodeItem && (
                      <ToolItem
                        showLabel
                        icon={<ShareOutlined size={16} color={nodeItem.nodeShared ? colors.primaryColor : colors.secondLevelText} className={styles.toolIcon} />}
                        onClick={() => {
                          if (!automationState?.resourceId || automationState?.scenario !== AutomationScenario.node) {
                            return;
                          }

                          isLg && setSideBarVisible(false);
                          dispatch(StoreActions.updateShareModalNodeId(automationState?.resourceId));
                        }}
                        text={t(Strings.share)}
                        disabled={!permission.sharable}
                        isActive={nodeItem.nodeShared}
                        className={styles.toolbarItem}
                      />
                    )
                  }
                </OrEmpty>

                <OrEmpty visible={automationState?.scenario === AutomationScenario.node}>
                  <TextButton
                    onClick={() => {
                      window.open(t(Strings.robot_help_url));
                    }}
                    prefixIcon={<BookOutlined currentColor/>} size="small">
                    {t(Strings.help)}
                  </TextButton>
                </OrEmpty>

                <OrEmpty visible={automationState?.scenario === AutomationScenario.datasheet}>
                  <FloatUiTooltip content={t(Strings.robot_panel_help_tooltip)}>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        shape="square"
                        size={'small'}
                        icon={() =>
                          <QuestionCircleOutlined
                            size={16} color={colors.textCommonTertiary}
                          />
                        }
                        onClick={() => {
                          window.open(t(Strings.robot_help_url));
                        }}
                      />
                    </Box>
                  </FloatUiTooltip>
                </OrEmpty>

                <OrEmpty visible={automationState?.scenario === AutomationScenario.datasheet}>
                  <Tooltip content={t(Strings.robot_more_operations_tooltip)}>
                    <IconButton shape="square" onClick={(e) => show(e)} icon={MoreStandOutlined}/>
                  </Tooltip>
                </OrEmpty>

                <OrEmpty visible={automationState?.scenario === AutomationScenario.datasheet}>
                  <IconButton
                    component="button"
                    shape="square"
                    icon={() => <CloseOutlined size={16} color={colors.textCommonTertiary}/>}
                    onClick={onClose}
                    style={{ marginLeft: 8 }}
                  />
                </OrEmpty>
              </Box>
            </Box>
          )}
        </Box>
      </OrEmpty>

      <ContextMenu menuId={MenuID} overlay={flatContextData(menuData, true)}/>

      <Box flex={'1 1 auto'} height={'100%'} overflowY={'hidden'}>
        <AutomationPanelContent/>
      </Box>

      {historyDialog.dialogVisible && (
        <AutomationHistoryPanel
          onClose={() => {
            setHistoryDialog((draft) => ({
              ...draft,
              dialogVisible: false,
            }));
          }}
        />
      )}
    </Box>
  );
});
