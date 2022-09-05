import { CollaCommandName, ExecuteResult, ResourceType, Selectors, StoreActions, Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import { Modal, Tooltip } from 'pc/components/common';
import { OperateItem } from 'pc/components/tool_bar/view_switcher/view_item/operate_item';
import { resourceService } from 'pc/resource_service';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import IconWidget from 'static/icon/datasheet/viewtoolbar/widget.svg';
import { stopPropagation } from '../../../../utils/dom';
import { useVerifyOperateItemTitle } from '../../../tool_bar/view_switcher/view_switcher';
import styles from './style.module.less';
import { useUnmount } from 'ahooks';
import { WrapperTooltip } from './widget_panel_header';
import { InformationSmallOutlined } from '@vikadata/icons';
import { useThemeColors } from '@vikadata/components';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { FC } from 'react';

export const WidgetPanelList: FC<{ onClickItem?: (panelIndex: number) => void }> = ({ onClickItem }) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const colors = useThemeColors();
  const dispatch = useDispatch();
  const { datasheetId, mirrorId } = useSelector(state => state.pageParams);
  const { manageable, editable } = useSelector(state => {
    return Selectors.getResourcePermission(state, datasheetId!, ResourceType.Datasheet);
  });

  const resourceId = mirrorId || datasheetId!;
  const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;

  const widgetPanels = useSelector(state => {
    return Selectors.getResourceWidgetPanels(state, resourceId, resourceType);
  })!;
  const activeWidgetPanel = useSelector(state => {
    return Selectors.getResourceActiveWidgetPanel(state, resourceId, resourceType);
  })!;

  const modifyWidgetName = (id: string, name: string) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ModifyWidgetPanelName,
      panelId: id,
      panelName: name,
      resourceId: resourceId!,
      resourceType: resourceType,
    });
  };

  const { errMsg, editingId: editPanelId, setEditingId: setEditPanelId, onChange, onKeyPressEnter, setEditingValue } = useVerifyOperateItemTitle(
    widgetPanels,
    modifyWidgetName,
  );

  useUnmount(() => {
    onKeyPressEnter();
  });

  const panelCountOverLimit = widgetPanels.length >= 3;

  const switchActivePanel = (panelId: string) => {
    dispatch(StoreActions.switchActivePanel(panelId, resourceId, resourceType));
  };

  const panelItemClick = (panelIndex: number) => {
    switchActivePanel(widgetPanels[panelIndex].id);
    onClickItem && onClickItem(panelIndex);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const movingPanelId: string = widgetPanels[source.index]['id'];
    resourceService.instance!.commandManager.execute<{ panelId: string }>({
      cmd: CollaCommandName.MoveWidgetPanel,
      panelId: movingPanelId,
      targetIndex: destination.index,
      resourceId: resourceId!,
      resourceType: resourceType,
    });
  };

  const addNewPanel = () => {
    if (panelCountOverLimit || !manageable) {
      return;
    }

    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddWidgetPanel,
      resourceId: resourceId!,
      resourceType: resourceType,
    });
    if (result.result === ExecuteResult.Success) {
      const { panelId } = result.data as { panelId: string };
      switchActivePanel(panelId);
    }
  };

  const deletePanel = (id: string) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteWidgetPanel,
      deletePanelId: id,
      resourceId: resourceId!,
      resourceType: resourceType,
    });
  };

  /**
   * 删除第一个列表，依次激活下一个面板，
   * 删除的非地一个面板，删除后则激活第一个面板
   * 全部删除完则清空
   */
  const confirmDelete = (panelId: string) => {
    if (panelId === activeWidgetPanel.id) {
      if (widgetPanels.findIndex(item => item.id === panelId) === 0) {
        if (widgetPanels.length === 1) {
          switchActivePanel('');
        } else {
          switchActivePanel(widgetPanels[1]['id']);
        }
      } else {
        switchActivePanel(widgetPanels[0]['id']);
      }
    }
    deletePanel(panelId);
  };

  const deleteWidgetPanel = (id: string) => {
    Modal.confirm({
      title: t(Strings.delete_widget_panel_title),
      content: t(Strings.delete_widget_panel_content),
      onOk: () => {
        confirmDelete(id);
      },
      type: 'danger',
    });
  };

  return (
    <div className={classNames(styles.widgetListWrapper, isMobile && styles.widgetListWrapperMobile)}>
      <h2>
        {t(Strings.widget_panel)}（{widgetPanels.length}/3）
        <Tooltip title={t(Strings.click_to_view_instructions)} trigger={'hover'}>
          <a href={t(Strings.intro_widget)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
            <InformationSmallOutlined color={colors.thirdLevelText} />
          </a>
        </Tooltip>
      </h2>
      {widgetPanels && (
        <div className={styles.panelList}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={'1'} direction="vertical">
              {provided => {
                return (
                  <div
                    className={styles.droppable}
                    ref={element => {
                      provided.innerRef(element);
                    }}
                    {...provided.droppableProps}
                  >
                    {widgetPanels.map((item, index) => {
                      const itemBox = (
                        <OperateItem
                          key={item.id}
                          allowSort={editable && !isMobile}
                          editing={editPanelId === item.id}
                          isActive={activeWidgetPanel.id === item.id}
                          prefixIcon={<IconWidget width={16} height={16} />}
                          onItemClick={() => {
                            panelItemClick(index);
                          }}
                          id={widgetPanels[index].id}
                          inputData={{
                            value: item.name,
                            errMsg: errMsg,
                            onChange: onChange,
                            onEnter: onKeyPressEnter,
                          }}
                          operateData={{
                            delete: {
                              show: manageable,
                              tooltip: t(Strings.delete),
                              onClick(e, id) {
                                stopPropagation(e);
                                deleteWidgetPanel(id);
                              },
                            },
                            rename: {
                              show: editable,
                              tooltip: t(Strings.rename),
                              onClick(e, id) {
                                stopPropagation(e);
                                setEditPanelId(id);
                                setEditingValue(widgetPanels[index].name);
                              },
                            },
                          }}
                        />
                      );
                      if (isMobile) {
                        return itemBox;
                      }
                      return (
                        <Draggable draggableId={item.id + index} index={index} key={index} isDragDisabled={!editable}>
                          {providedChild => (
                            <div ref={providedChild.innerRef} {...providedChild.draggableProps} {...providedChild.dragHandleProps}>
                              {itemBox}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
      )}
      {!isMobile && (
        <WrapperTooltip
          wrapper={panelCountOverLimit || !manageable}
          tip={!manageable ? t(Strings.no_permission_add_widget_panel) : t(Strings.widget_panel_count_limit)}
          style={{ width: '100%' }}
        >
          <div
            className={classNames(styles.addPanel, {
              [styles.disable]: panelCountOverLimit || !manageable,
            })}
            onClick={addNewPanel}
          >
            <span className={styles.addIcon}>
              <IconAdd fill="currentColor" width={16} height={16} />
            </span>
            <span className={styles.text}>{t(Strings.add_widget_panel)}</span>
          </div>
        </WrapperTooltip>
      )}
    </div>
  );
};
