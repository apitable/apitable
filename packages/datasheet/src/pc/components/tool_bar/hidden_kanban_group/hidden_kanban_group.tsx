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

import { Tooltip } from 'antd';
import classNames from 'classnames';
import produce from 'immer';
import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Button, Typography, useThemeColors, useListenVisualHeight, IUseListenTriggerInfo, WrapperTooltip, Switch } from '@apitable/components';
import {
  FieldType,
  IKanbanViewProperty,
  IMemberField,
  IMemberProperty,
  ISelectFieldOption,
  ISelectFieldProperty,
  KanbanStyleKey,
  moveArrayElement,
  Selectors,
  Strings,
  t,
  UN_GROUP,
} from '@apitable/core';
import { DragOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { useCommand } from 'pc/components/kanban_view/hooks/use_command';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { CellMember } from 'pc/components/multi_grid/cell/cell_member';
import { CellOptions, inquiryValueByKey } from 'pc/components/multi_grid/cell/cell_options';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { usePlatform } from 'pc/hooks/use_platform';

import { useAppSelector } from 'pc/store/react-redux';
import { SyncViewTip } from '../sync_view_tip';
import styles from './styles.module.less';

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 340;

export const HiddenKanbanGroup = (props: { triggerInfo?: IUseListenTriggerInfo }) => {
  const { triggerInfo } = props;
  const { mobile } = usePlatform();
  const isViewLock = useShowViewLockModal();
  const view = useAppSelector(Selectors.getCurrentView) as IKanbanViewProperty;
  const kanbanFieldId = useAppSelector(Selectors.getKanbanFieldId)!;
  const field = useAppSelector((state) => Selectors.getField(state, kanbanFieldId));
  const unitMap = useAppSelector(Selectors.getUnitMap)!;
  const groupIds = useAppSelector(Selectors.getKanbanGroupMapIds);
  const cacheTheme = useAppSelector(Selectors.getTheme);
  const [isDragging, setIsDragging] = useState(false);
  const hiddenGroupMap = view.style.hiddenGroupMap || {};
  const isMemberField = field.type === FieldType.Member;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { style } = useListenVisualHeight({
    listenNode: containerRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
  });

  const command = useCommand();
  const colors = useThemeColors();

  const [query, setQuery] = useState('');

  const groupInfoForRender = useMemo(() => {
    const _groupIds = [...groupIds];
    return _groupIds
      .map((id) => {
        let name;
        if (isMemberField) {
          name = unitMap[id]?.name;
        } else {
          name = inquiryValueByKey('name', id, field, cacheTheme);
        }
        return {
          id,
          name,
        };
      })
      .filter((info) => {
        return info.name.includes(query);
      });
  }, [groupIds, query, field, isMemberField, unitMap, cacheTheme]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    const headIds = field.type === FieldType.SingleSelect ? field.property.options : (field as IMemberField).property.unitIds;
    const headIdsCopy = [...headIds];
    const newProperty = {
      ...field.property,
    };

    setIsDragging(false);
    moveArrayElement(headIdsCopy, source.index, destination!.index);

    if (field.type === FieldType.SingleSelect) {
      (newProperty as ISelectFieldProperty).options = headIdsCopy as ISelectFieldOption[];
    } else {
      (newProperty as IMemberProperty).unitIds = headIdsCopy as string[];
    }

    command.setFieldAttr(field.id, { ...field, property: newProperty });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const toggleHidden = (id: string | null, status?: boolean) => {
    const nextHiddenGroupMap = produce(hiddenGroupMap, (draft) => {
      if (!id) {
        groupIds.forEach((_id) => {
          draft[_id] = Boolean(status);
        });
        draft[UN_GROUP] = Boolean(status);
      } else {
        draft[id] = !draft[id];
      }
    });

    command.setKanbanStyle({
      styleKey: KanbanStyleKey.HiddenGroupMap,
      styleValue: nextHiddenGroupMap,
    });
  };

  const CellWrapper = isMemberField ? CellMember : CellOptions;

  const groupItem = (provided: any, isDragDisabled: boolean, visible: boolean | undefined, id: any) => (
    <div
      key={id}
      className={classNames({
        [styles.groupItem]: true,
        [styles.isDragging]: isDragging && id === UN_GROUP,
      })}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => !isViewLock && toggleHidden(id)}
    >
      <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
        <div className={styles.dragHandle}>{!isDragDisabled && <DragOutlined size={10} color={mobile ? colors.fc3 : colors.fc4} />}</div>
      </WrapperTooltip>

      {id !== UN_GROUP ? (
        <CellWrapper cellValue={isMemberField ? [id] : id} field={field as IMemberField} />
      ) : (
        <div className={styles.optionWrapper}>
          <div className={styles.optionText}>
            <span className={styles.name}>{t(Strings.kaban_not_group)}</span>
          </div>
        </div>
      )}
      {isViewLock ? (
        <Tooltip title={t(Strings.view_lock_setting_desc)}>
          <Switch checked={visible} size={mobile ? 'default' : 'small'} disabled={isViewLock} />
        </Tooltip>
      ) : (
        <Switch onChange={() => toggleHidden(id)} checked={visible} size={mobile ? 'default' : 'small'} disabled={isViewLock} />
      )}
    </div>
  );

  return (
    <div ref={containerRef} style={style} className={styles.hiddenGroupWrapper}>
      <div className={styles.header}>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <div className={styles.title}>
            <Typography variant="h7">{t(Strings.set_grouping)}</Typography>
          </div>
          <SyncViewTip style={{ padding: '2px 0px 0px' }} content={t(Strings.view_sync_property_tip_short)} />
        </ComponentDisplay>

        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <LineSearchInput
            placeholder={t(Strings.search)}
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
        </ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <div className={styles.searchWrapper}>
            <LineSearchInput
              size="small"
              placeholder={t(Strings.search)}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
          </div>
        </ComponentDisplay>
      </div>
      <div className={styles.content}>
        {t(Strings.kaban_not_group).includes(query) && groupItem({}, true, !hiddenGroupMap?.[UN_GROUP], UN_GROUP)}
        {groupInfoForRender.length > 0 ? (
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable droppableId="kanbanGroupList" direction="vertical">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {groupInfoForRender.map(({ id }, index) => {
                    const isDragDisabled = Boolean(query.length > 0 || id === UN_GROUP);
                    const visible = !hiddenGroupMap?.[id];
                    return (
                      <Draggable key={id} draggableId={id} index={index} isDragDisabled={isDragDisabled || isViewLock}>
                        {(provided) => groupItem(provided, isDragDisabled, visible, id)}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className={styles.noResult}>
            <span>{t(Strings.no_search_result)}</span>
          </div>
        )}
      </div>

      <div className={styles.opAll}>
        <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
          <Button size="small" onClick={() => toggleHidden(null, true)} block disabled={isViewLock}>
            {t(Strings.hide_all_fields)}
          </Button>
        </WrapperTooltip>
        <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
          <Button size="small" onClick={() => toggleHidden(null, false)} block disabled={isViewLock}>
            {t(Strings.show_all_fields)}
          </Button>
        </WrapperTooltip>
      </div>
    </div>
  );
};
