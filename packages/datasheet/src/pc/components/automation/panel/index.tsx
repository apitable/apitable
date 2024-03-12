import { useMount } from 'ahooks';
import { Space } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import React, { FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Box,
  ContextMenu,
  FloatUiTooltip as Tooltip,
  FloatUiTooltip,
  IconButton,
  Skeleton,
  TextButton,
  useContextMenu,
  useThemeColors,
} from '@apitable/components';
import { ConfigConstant, DATASHEET_ID, IReduxState, StoreActions, Strings, t } from '@apitable/core';
import { BookOutlined, CloseOutlined, DeleteOutlined, MoreStandOutlined, QuestionCircleOutlined, ShareOutlined } from '@apitable/icons';
import { MobileToolBar } from 'pc/components/automation/panel/Toobar';
import { NoPermission } from 'pc/components/no_permission';
import { useAppSelector } from 'pc/store/react-redux';
import { useResponsive, useSideBarVisible, useUrlQuery } from '../../../hooks';
import { useAppDispatch } from '../../../hooks/use_app_dispatch';
import { flatContextData, getPermission } from '../../../utils';
import { NodeIcon } from '../../catalog/tree/node_icon';
import { Message, Modal, Tag, TagColors } from '../../common';
import { ScreenSize } from '../../common/component_display';
import { NodeFavoriteStatus } from '../../common/node_favorite_status';
import { OrEmpty } from '../../common/or_empty';
import { deleteRobot, getResourceAutomations } from '../../robot/api';
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
  automationCacheAtom,
  automationDrawerVisibleAtom,
  automationHistoryAtom,
  automationPanelAtom,
  automationStateAtom,
  getResourceAutomationDetailIntegrated,
  IAutomationPanel,
  PanelName,
  useAutomationController,
} from '../controller';
import { useAutomationNavigateController } from '../controller/controller';
import { useAutomationResourceNode, useAutomationResourcePermission } from '../controller/use_automation_permission';
import AutomationHistoryPanel from '../run_history/modal/modal';
import styles from '../style.module.less';

export const MenuID = 'MoreAction';

const StyleIcon = styled(Box)`
  &:hover {
    background-color: var(--shadowColor);
  }
`;

export const AutomationPanel: FC<{ onClose?: () => void; resourceId?: string, panel?: IAutomationPanel }> = memo(({ onClose, panel, resourceId }) => {
  const { show } = useContextMenu({ id: MenuID });

  const { currentRobotId } = useAutomationRobot();
  const setPanel = useSetAtom(automationPanelAtom);
  const [automationState, setAutomationState] = useAtom(automationStateAtom);
  const [historyDialog, setHistoryDialog] = useAtom(automationHistoryAtom);
  const [, setShowModal] = useAtom(automationDrawerVisibleAtom);

  const { shareInfo } = useContext(ShareContext);
  const { initialize } = useAutomationNavigateController();
  const dispatch = useAppDispatch();
  const { templateId } = useAppSelector((state: IReduxState) => state.pageParams);
  const favoriteTreeNodeIds = useAppSelector((state: IReduxState) => state.catalogTree.favoriteTreeNodeIds);

  const { screenIsAtMost } = useResponsive();
  const isLg = screenIsAtMost(ScreenSize.lg);
  const isXl = screenIsAtMost(ScreenSize.xl);

  const params = useUrlQuery();
  const [cache, setCache] = useAtom(automationCacheAtom);
  useMount(() => {
    isXl && setSideBarVisible(false);
    if (cache.id !== resourceId) {
      console.log('initialize');
      initialize();
    }
  });

  const [loading, setLoading] =useState(true);

  useEffect(()=> {
    setLoading(true);
  }, [resourceId]);

  useEffect(() => {
    if (!resourceId) {
      setLoading(false);
      return;
    }
    if(!loading){
      return;
    }
    setLoading(true);
    getResourceAutomations(resourceId, {
      shareId: shareInfo?.shareId,
    })
      .then(async (res) => {
        const firstItem = res[0];
        const itemDetail = await getResourceAutomationDetailIntegrated(resourceId, firstItem.robotId, {
          shareId: shareInfo?.shareId,
        });

        if(panel) {
          setPanel(panel);
        }else {
          if (cache.id !== resourceId) {
            setPanel({
              panelName: isLg ? undefined : PanelName.BasicInfo,
            });
          } else if (cache.panel) {
            setPanel(cache.panel);
          }
        }

        if ((params as { tab: string }).tab === 'history') {
          setHistoryDialog({
            dialogVisible: true,
          });
        }
        setCache({});

        if (itemDetail.relatedResources) {
          itemDetail.relatedResources.forEach((resource) => {
            if (resource.nodeId.startsWith('dst')) {
              dispatch(StoreActions.fetchDatasheet(resource.nodeId));
            }
          });
        }

        setAutomationState({
          scenario: AutomationScenario.node,
          currentRobotId: itemDetail.robotId,
          resourceId: resourceId,
          robot: itemDetail as IAutomationRobotDetailItem,
        });
      })
      .catch((e) => {
        console.log(e);
      }).finally(()=> {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loading, params, resourceId, setAutomationState, setCache, setHistoryDialog, setPanel, shareInfo]);

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
        icon: <DeleteOutlined />,
        onClick: handleDeleteRobot,
      },
    ],
  ];

  const colors = useThemeColors();
  const nodeItem = useAutomationResourceNode();

  const {
    api: { refreshItem },
  } = useAutomationController();
  const { setSideBarVisible } = useSideBarVisible();

  const permission = useAutomationResourcePermission();

  const inheritedRole = useMemo(() => {
    if (nodeItem?.role) {
      return nodeItem.role;
    }
    if (permission.manageable) {
      return ConfigConstant.Role.Manager;
    }

    if (permission.editable) {
      return ConfigConstant.Role.Editor;
    }

    return ConfigConstant.Role.Reader;
  }, [nodeItem?.role, permission.editable, permission.manageable]);
  if (automationState?.scenario === AutomationScenario.node && !templateId && nodeItem == null) {
    return null;
  }
  if (currentRobotId == null && !loading) {
    return (
      <NoPermission />
    );
  }

  return (
    <Box display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'} overflowY={'hidden'}>
      <OrEmpty visible={isLg && automationState?.scenario === AutomationScenario.node}>
        <MobileToolBar />
      </OrEmpty>

      <OrEmpty visible={!isLg || automationState?.scenario !== AutomationScenario.node}>
        <Box
          flex={'0 0 72px'}
          backgroundColor={colors.bgCommonDefault}
          borderBottom={`1px solid ${colors.borderCommonDefault}`}
          className={styles.tabBarWrapper1}
          id={DATASHEET_ID.VIEW_TAB_BAR}
        >
          {automationState?.robot == null ? (
            <Space style={{ margin: '8px 20px' }}>
              <Skeleton style={{ height: 24, width: 340, marginTop: 0 }} />
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
                  {automationState?.scenario === AutomationScenario.node && (
                    <StyleIcon
                      width={'23px'}
                      height={'23px'}
                      display={'flex'}
                      alignItems={'center'}
                      borderRadius={'2px'}
                      marginRight={'2px'}
                      style={{ cursor: 'pointer' }}
                    >
                      <NodeIcon
                        nodeId={automationState?.resourceId ?? ''}
                        type={ConfigConstant.NodeType.AUTOMATION}
                        icon={nodeItem?.icon}
                        editable={permission.manageable}
                        size={20}
                        hasChildren
                      />
                    </StyleIcon>
                  )}
                  <InputTitle />
                  {automationState?.scenario === AutomationScenario.node && (
                    <>
                      {
                        nodeItem && (
                          <OrEmpty visible={shareInfo?.shareId == null}>
                            <NodeFavoriteStatus
                              nodeId={automationState?.resourceId ?? ''}
                              enabled={nodeItem?.nodeFavorite || favoriteTreeNodeIds.includes(nodeItem.nodeId)}
                            />
                          </OrEmpty>
                        )
                      }
                      {!templateId && (
                        <Box marginX={'4px'}>
                          <Tag
                            color={TagColors[inheritedRole]}
                            style={{
                              wordBreak: 'keep-all',
                            }}
                          >
                            {ConfigConstant.permissionText[getPermission(inheritedRole, { shareInfo: shareInfo })]}
                          </Tag>
                        </Box>
                      )}
                    </>
                  )}
                </Box>

                <OrEmpty visible={!isLg}>
                  <>
                    {automationState?.scenario !== AutomationScenario.node ? (
                      <EditableInputDescription />
                    ) : (
                      <DescriptionModal
                        onVisibleChange={refreshItem}
                        activeNodeId={automationState?.resourceId!}
                        datasheetName={nodeItem?.nodeName ?? automationState?.robot?.name ?? ''}
                        showIntroduction
                        showIcon={false}
                      />
                    )}
                  </>
                </OrEmpty>
              </Box>

              <Box display="flex" alignItems="center">
                <OrEmpty visible={permission.sharable && automationState?.scenario === AutomationScenario.node}>
                  {nodeItem && (
                    <ToolItem
                      showLabel
                      icon={
                        <ShareOutlined
                          size={16}
                          color={nodeItem.nodeShared ? colors.primaryColor : colors.secondLevelText}
                          className={styles.toolIcon}
                        />
                      }
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
                  )}
                </OrEmpty>

                <OrEmpty visible={automationState?.scenario === AutomationScenario.node}>
                  <TextButton
                    onClick={() => {
                      window.open(t(Strings.robot_help_url));
                    }}
                    prefixIcon={<BookOutlined currentColor />}
                    size="small"
                  >
                    {t(Strings.help)}
                  </TextButton>
                </OrEmpty>

                <OrEmpty visible={automationState?.scenario === AutomationScenario.datasheet}>
                  <FloatUiTooltip content={t(Strings.robot_panel_help_tooltip)}>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        shape="square"
                        size={'small'}
                        icon={() => <QuestionCircleOutlined size={16} color={colors.textCommonTertiary} />}
                        onClick={() => {
                          window.open(t(Strings.robot_help_url));
                        }}
                      />
                    </Box>
                  </FloatUiTooltip>
                </OrEmpty>

                <OrEmpty visible={automationState?.scenario === AutomationScenario.datasheet}>
                  <Tooltip content={t(Strings.robot_more_operations_tooltip)}>
                    <IconButton shape="square" onClick={(e) => show(e)} icon={MoreStandOutlined} />
                  </Tooltip>
                </OrEmpty>

                <OrEmpty visible={automationState?.scenario === AutomationScenario.datasheet}>
                  <IconButton
                    component="button"
                    shape="square"
                    icon={() => <CloseOutlined size={16} color={colors.textCommonTertiary} />}
                    onClick={onClose}
                    style={{ marginLeft: 8 }}
                  />
                </OrEmpty>
              </Box>
            </Box>
          )}
        </Box>
      </OrEmpty>

      <ContextMenu menuId={MenuID} overlay={flatContextData(menuData, true)} />

      <Box flex={'1 1 auto'} height={'100%'} overflowY={'hidden'}>
        <AutomationPanelContent />
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
