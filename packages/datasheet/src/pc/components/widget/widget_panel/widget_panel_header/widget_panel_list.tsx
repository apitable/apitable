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

import { useUnmount } from 'ahooks';
import classNames from 'classnames';
import { FC } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { CollaCommandName, ExecuteResult, ResourceType, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { AddOutlined, QuestionCircleOutlined, WidgetOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Modal, Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { OperateItem } from 'pc/components/tool_bar/view_switcher/view_item/operate_item';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from '../../../../utils/dom';
import { useVerifyOperateItemTitle } from '../../../tool_bar/view_switcher/view_switcher';
import { WrapperTooltip } from './wrapper_tooltip';
import styles from './style.module.less';

export const WidgetPanelList: FC<React.PropsWithChildren<{ onClickItem?: (panelIndex: number) => void }>> = ({ onClickItem }) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const colors = useThemeColors();
  const dispatch = useDispatch();
  const { datasheetId, mirrorId } = useAppSelector((state) => state.pageParams);
  const { manageable, editable } = useAppSelector((state) => {
    return Selectors.getResourcePermission(state, datasheetId!, ResourceType.Datasheet);
  });

  const resourceId = mirrorId || datasheetId!;
  const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;

  const widgetPanels = useAppSelector((state) => {
    return Selectors.getResourceWidgetPanels(state, resourceId, resourceType);
  })!;
  const activeWidgetPanel = useAppSelector((state) => {
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

  const {
    errMsg,
    editingId: editPanelId,
    setEditingId: setEditPanelId,
    onChange,
    onKeyPressEnter,
    setEditingValue,
  } = useVerifyOperateItemTitle(widgetPanels, modifyWidgetName);

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
   * 1. Delete the first list and activate the next panel, in turn.
   * 2. Deleted non-directional panel, when deleted, activates the first panel.
   * 3. Deleted non-directional panel, when deleted, activates the first panel.
   */
  const confirmDelete = (panelId: string) => {
    if (panelId === activeWidgetPanel.id) {
      if (widgetPanels.findIndex((item) => item.id === panelId) === 0) {
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
            <QuestionCircleOutlined color={colors.thirdLevelText} />
          </a>
        </Tooltip>
      </h2>
      {widgetPanels && (
        <div className={styles.panelList}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={'1'} direction="vertical">
              {(provided) => {
                return (
                  <div
                    className={styles.droppable}
                    ref={(element) => {
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
                          prefixIcon={<WidgetOutlined size={16} />}
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
                          {(providedChild) => (
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
              <AddOutlined color="currentColor" size={16} />
            </span>
            <span className={styles.text}>{t(Strings.add_widget_panel)}</span>
          </div>
        </WrapperTooltip>
      )}
    </div>
  );
};
