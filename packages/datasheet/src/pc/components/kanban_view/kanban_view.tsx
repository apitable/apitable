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

import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, DragStart, Droppable, DropResult } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { Message } from '@apitable/components';
import {
  CollaCommandName,
  ConfigConstant,
  DropDirectionType,
  FieldType,
  IKanbanViewProperty,
  IMemberField,
  IMemberProperty,
  ISelectFieldOption,
  ISelectFieldProperty,
  moveArrayElement,
  Selectors,
  StoreActions,
  Strings,
  t,
  UN_GROUP,
} from '@apitable/core';
import { GroupHeadMenu } from 'pc/components/kanban_view/group_header/head_more_option';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage/storage';
import { stopPropagation } from '../../utils/dom';
import { ScreenSize } from '../common/component_display';
import { RecordMenu } from '../multi_grid/context_menu/record_menu';
import { AddGroup } from './add_group';
import { GroupHeader } from './group_header';
import { useCommand } from './hooks/use_command';
import { KanbanFieldSettingModal } from './kanban_field_setting';
import { KanbanGroup } from './kanban_group/kanban_group';
import { KanbanSkeleton } from './kanban_skeleton';
import styles from './styles.module.less';

interface IKanbanViewProps {
  height: number;
  width: number;
}

export const KanbanView: React.FC<React.PropsWithChildren<IKanbanViewProps>> = (props) => {
  const { width, height } = props;
  const groupIds = useAppSelector(Selectors.getKanbanGroupMapIds) || [];
  const view = useAppSelector(Selectors.getCurrentView) as IKanbanViewProperty;
  const hiddenGroupMap = view.style.hiddenGroupMap || {};
  const visibleGroupIds = groupIds.filter((id) => !hiddenGroupMap[id]);
  const kanbanGroupMap = useAppSelector(Selectors.getKanbanGroupMap)!;
  const kanbanFieldId = useAppSelector(Selectors.getKanbanFieldId);
  const { viewId, datasheetId } = useAppSelector((state) => state.pageParams);
  const field = useAppSelector((state) => Selectors.getField(state, kanbanFieldId || ''));
  const collapse = useAppSelector(Selectors.getKanbanGroupCollapse);
  const command = useCommand();
  const { fieldPropertyEditable } = useAppSelector(Selectors.getPermissions);
  const [draggingInfo, setDraggingInfo] = useState({
    isDragging: false,
    dragId: '',
  });

  const storageId = `${datasheetId},${viewId}`;
  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();

  const [toolTipLeft, setToolTipLeft] = useState(0);

  const fieldRole = useAppSelector((state) => {
    if (!kanbanFieldId) {
      return;
    }
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    return Selectors.getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId);
  });

  const setCollapse = (value: string[]) => {
    dispatch(StoreActions.setKanbanGroupingExpand(datasheetId!, value));
  };

  useEffect(() => {
    const collapse = getStorage(StorageName.KanbanCollapse);
    setCollapse(collapse && collapse[storageId] ? collapse[storageId] : []);
    // eslint-disable-next-line
  }, [storageId]);

  useEffect(() => {
    setStorage(StorageName.KanbanCollapse, { [storageId]: collapse });
    // eslint-disable-next-line
  }, [collapse]);

  const ref = useRef<HTMLDivElement>(null);

  function dragWithinView(result: DropResult) {
    const { destination } = result;
    if (!destination || !destination!.droppableId) {
      return;
    }
    if (kanbanGroupMap[destination!.droppableId].length === 0) {
      // There is nothing in the target kanban view
      command.setRecords(getRecordData(result) || []);
      return;
    }
    moveRow(result);
  }

  function getRecordData(result: DropResult) {
    const { destination, source } = result;
    if (destination?.droppableId === source.droppableId) {
      return;
    }
    if (fieldRole && fieldRole !== ConfigConstant.Role.Editor) {
      Message.warning({
        content: t(Strings.no_permission_edit_value),
      });
      return;
    }
    const recordId = kanbanGroupMap[source.droppableId][source.index].id;
    return [
      {
        recordId,
        fieldId: kanbanFieldId!,
        fieldType: field.type,
        value:
          destination!.droppableId === UN_GROUP ? null : FieldType.Member === field.type ? [destination!.droppableId!] : destination?.droppableId!,
      },
    ];
  }

  function getDirection(result: DropResult) {
    const { destination, source } = result;
    if (destination?.droppableId !== source.droppableId) {
      return DropDirectionType.BEFORE;
    }
    return destination!.index > source.index ? DropDirectionType.AFTER : DropDirectionType.BEFORE;
  }

  function moveRow(result: DropResult) {
    const { destination, source } = result;
    if (source.droppableId === destination?.droppableId && source.index === destination?.index) {
      return;
    }

    const destinationRows = kanbanGroupMap![destination!.droppableId];
    const sourceRows = kanbanGroupMap![source.droppableId];
    let direction: DropDirectionType = getDirection(result);
    let dragOverRecordId = '';

    if (destination!.index === 0) {
      dragOverRecordId = destinationRows[0].id;
      direction = DropDirectionType.BEFORE;
    }

    if (destination!.index === destinationRows.length) {
      dragOverRecordId = destinationRows[destinationRows.length - 1].id;
      direction = DropDirectionType.AFTER;
    }

    if (destination!.index !== 0 && destination!.index !== destinationRows.length) {
      dragOverRecordId = destinationRows[destination!.index].id;
    }

    const moveData = {
      recordId: sourceRows[source.index].id,
      overTargetId: dragOverRecordId,
      direction,
    };

    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.MoveRow,
      data: [moveData],
      viewId: viewId!,
      recordData: getRecordData(result),
    });
  }

  function dragWithinGroup(result: DropResult) {
    moveRow(result);
  }

  function dragGroup(result: DropResult) {
    const { destination, source } = result;
    const headIds = field.type === FieldType.SingleSelect ? field.property.options : (field as IMemberField).property.unitIds;
    const headIdsCopy = [...headIds];
    const newProperty = {
      ...field.property,
    };

    const sourceId = visibleGroupIds[source.index];
    const actualSourceIndex = groupIds.indexOf(sourceId);

    const destinationId = visibleGroupIds[destination!.index];
    const actualDestinationIndex = groupIds.indexOf(destinationId);

    moveArrayElement(headIdsCopy, actualSourceIndex, actualDestinationIndex);

    if (field.type === FieldType.SingleSelect) {
      (newProperty as ISelectFieldProperty).options = headIdsCopy as ISelectFieldOption[];
    } else {
      (newProperty as IMemberProperty).unitIds = headIdsCopy as string[];
    }

    command.setFieldAttr(field.id, { ...field, property: newProperty });
  }

  function onDragEnd(result: DropResult) {
    const { destination, source } = result;
    setDraggingInfo({ isDragging: false, dragId: '' });
    if (source.droppableId !== destination?.droppableId) {
      // Dragging across kanban
      return dragWithinView(result);
    }

    if (source.droppableId === viewId && destination?.droppableId === viewId) {
      // Kanban dragging
      return dragGroup(result);
    }

    // Dragging within the current kanban view
    dragWithinGroup(result);
  }

  function onDragStart(initial: DragStart) {
    setDraggingInfo({
      isDragging: true,
      dragId: initial.draggableId,
    });
  }

  function renderKanbanGroup(groupId: string, provided?: DraggableProvided, snapshot?: DraggableStateSnapshot) {
    return (
      <KanbanGroup
        provided={provided}
        groupId={groupId}
        height={height}
        kanbanFieldId={kanbanFieldId!}
        setCollapse={setCollapse}
        isDragging={snapshot?.isDragging || draggingInfo.isDragging}
        dragId={draggingInfo.dragId}
        isLastGroup={visibleGroupIds[visibleGroupIds.length - 1] === groupId}
      />
    );
  }

  function renderGroupHeader(groupId: string, provided?: DraggableProvided) {
    return <GroupHeader groupId={groupId} kanbanGroupMap={kanbanGroupMap} provided={provided} setCollapse={setCollapse} collapse={collapse} />;
  }

  const commonStyle: React.CSSProperties = {
    width: 80,
    marginTop: screenIsAtMost(ScreenSize.md) ? 24 : 0,
    position: 'relative',
    height: '100%',
  };

  if (isNaN(height) || isNaN(width)) {
    return null;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.pageY + 12 >= document.body.clientHeight) {
      if (ref.current && ref.current.getBoundingClientRect().width <= width) {
        return;
      }
      const target = e.currentTarget as HTMLDivElement;
      const rate = target.clientWidth / target.scrollWidth;
      const scrollBarLen = rate * target.clientWidth;
      const scrollLeft = target.scrollLeft;
      const left = target.getBoundingClientRect().left;

      // Observe that the distance to the left border of the container in the native scrollbar is not scrollLeft, but scrollLeft * rate
      setToolTipLeft(left + scrollLeft * rate + scrollBarLen / 2);
    } else {
      setToolTipLeft(0);
    }
  };

  return (
    <div className={styles.viewContainer} style={{ width, height }} onMouseMove={handleMouseMove} onScroll={() => setToolTipLeft(0)}>
      {!kanbanFieldId ? (
        <KanbanFieldSettingModal />
      ) : (
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId={viewId!} direction="horizontal" type="column">
            {(provided) => {
              provided?.innerRef(ref.current);
              return (
                <div
                  {...provided?.droppableProps}
                  ref={ref}
                  onContextMenu={stopPropagation}
                  style={{
                    display: 'flex',
                    height,
                    width: 'min-content',
                  }}
                >
                  {!hiddenGroupMap[UN_GROUP] &&
                    (collapse.includes(UN_GROUP) ? (
                      <div
                        style={{
                          marginLeft: screenIsAtMost(ScreenSize.md) ? 24 : 0,
                          ...commonStyle,
                        }}
                      >
                        <div className={styles.collapse}>{renderGroupHeader(UN_GROUP)}</div>
                      </div>
                    ) : (
                      renderKanbanGroup(UN_GROUP)
                    ))}
                  {visibleGroupIds.map((groupId, index) => {
                    return (
                      <Draggable draggableId={groupId} index={index} key={groupId} isDragDisabled={!fieldPropertyEditable}>
                        {(provided, snapshot) => (
                          <>
                            {collapse.includes(groupId) ? (
                              <div {...provided?.draggableProps} ref={provided.innerRef}>
                                <div
                                  style={{
                                    ...commonStyle,
                                    width: 80,
                                  }}
                                >
                                  <div
                                    className={classNames({
                                      [styles.collapse]: true,
                                      [styles.isDragging]: snapshot.isDragging,
                                    })}
                                  >
                                    {renderGroupHeader(groupId, provided)}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              renderKanbanGroup(groupId, provided, snapshot)
                            )}
                          </>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  {fieldPropertyEditable && (!fieldRole || fieldRole === ConfigConstant.Role.Editor) && (
                    <div>
                      <AddGroup kanbanFieldId={kanbanFieldId!} />
                    </div>
                  )}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      )}
      <RecordMenu />
      <GroupHeadMenu />
      {!kanbanFieldId && <KanbanSkeleton />}
      {Boolean(toolTipLeft) && <FancyTooltip left={toolTipLeft} />}
    </div>
  );
};

export const FancyTooltip: React.FC<React.PropsWithChildren<{ left: number }>> = ({ left }) => {
  const shareId = useAppSelector((state) => state.pageParams.shareId);

  return ReactDOM.createPortal(
    <CSSMotion motionName="zoom-big-fast">
      {({ className: motionClassName }) => {
        return (
          <div
            className={classNames(motionClassName, styles.tooltip)}
            style={{
              left: left - 83,
              bottom: shareId ? 40 : 20,
            }}
          >
            {t(Strings.tip_shift_scroll)}
            <div className={styles.arrow} />
          </div>
        );
      }}
    </CSSMotion>,

    document.body,
  );
};
