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
import * as React from 'react';
import { useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import {
  Button,
  Checkbox,
  ISelectValue,
  IUseListenTriggerInfo,
  // eslint-disable-next-line no-restricted-imports
  Select,
  Switch,
  Typography,
  useListenVisualHeight,
  useThemeColors,
  WrapperTooltip,
} from '@apitable/components';
import {
  CalendarStyleKeyType,
  CollaCommandName,
  DropDirectionType,
  GalleryStyleKeyType,
  ICollaCommandOptions,
  IFieldMap,
  IFieldPermissionMap,
  IViewColumn,
  KanbanStyleKey,
  NO_COVER_FIELD_ID,
  OrgChartStyleKeyType,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { DisabledOutlined, DragOutlined, ImageOutlined, InfoCircleOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { getCoverFields } from 'pc/components/gallery_view/utils';
import { HighlightWords } from 'pc/components/highlight_words';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useHideField } from 'pc/components/multi_grid/hooks';
import { HideFieldType } from 'pc/components/tool_bar/interface';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useDispatch, useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { getIsColNameVisible, getMoveColumnsResult } from 'pc/utils/datasheet';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { SyncViewTip } from '../sync_view_tip';
import styles from './style.module.less';

interface IHiddenFieldProps {
  type?: HideFieldType;
  triggerInfo?: IUseListenTriggerInfo;
  mobileModalclose?: (visible: boolean) => void;
}

interface IFieldItem {
  item: IViewColumn;
  index: number;
  disabledDrag: boolean;
  keyword: string;
  fieldPermissionMap?: IFieldPermissionMap;
  fieldMap: IFieldMap;
  onChange: (fieldId: string, checked: boolean) => void;
  isMobile: boolean;
  hiddenProp: string;
  setActiveField: (fieldId: string, isHidden: boolean, modalClose: (bool: boolean) => void) => void;
  modalClose: (bool: boolean) => void;
}

const { Option } = Select;

const FieldItem = ({
  item,
  index,
  disabledDrag,
  keyword,
  fieldPermissionMap,
  fieldMap,
  onChange,
  isMobile,
  hiddenProp,
  setActiveField,
  modalClose,
}: IFieldItem) => {
  const colors = useThemeColors();
  const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, item.fieldId);
  const { name, type } = fieldMap[item.fieldId];
  const isViewLock = useShowViewLockModal();
  const activeCell = useAppSelector((state) => Selectors.getActiveCell(state));
  const isFocus = activeCell && activeCell?.fieldId === item.fieldId;

  return (
    <Draggable key={item.fieldId} draggableId={item.fieldId} index={index} isDragDisabled={disabledDrag || isViewLock}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          key={item.fieldId}
          className={classNames(styles.hideFieldItem, 'hideenFieldItem', isFocus ? styles.hideenFieldItemFocus : null)}
          onClick={() => setActiveField(item.fieldId, item[hiddenProp]!, modalClose)}
          tabIndex={index}
        >
          {!disabledDrag && (
            <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
              <DragOutlined size={10} color={isMobile ? colors.thirdLevelText : colors.fourthLevelText} />
            </WrapperTooltip>
          )}
          <div className={styles.fieldIconAndTitle}>
            <div className={styles.iconType}>{getFieldTypeIcon(type)}</div>
            <div className={styles.fieldName}>
              <HighlightWords keyword={keyword} words={name} showTip />
            </div>
          </div>
          {fieldRole && <FieldPermissionLock isLock />}
          {isViewLock ? (
            <Tooltip title={t(Strings.view_lock_setting_desc)}>
              <Switch
                checked={!item[hiddenProp]}
                onClick={(_checked, e) => {
                  e.stopPropagation();
                  onChange(item.fieldId, item[hiddenProp]!);
                }}
                size={isMobile ? 'default' : 'small'}
                disabled={isViewLock}
              />
            </Tooltip>
          ) : (
            <Switch
              checked={!item[hiddenProp]}
              onClick={(_checked, e) => {
                e.stopPropagation();
                onChange(item.fieldId, item[hiddenProp]!);
              }}
              size={isMobile ? 'default' : 'small'}
              disabled={isViewLock}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

const getHiddenProps = (type: ViewType, hideFieldType: HideFieldType) => {
  const isExclusive = hideFieldType === HideFieldType.Exclusive;
  switch (type) {
    case ViewType.Gantt:
      if (isExclusive) return 'hiddenInGantt';
      return 'hidden';
    case ViewType.Calendar:
      return 'hiddenInCalendar';
    case ViewType.OrgChart:
      return 'hiddenInOrgChart';
    default:
      return 'hidden';
  }
};

const getFreeColumnsByViewType = (columns: IViewColumn[], viewType: ViewType, hideFieldType: HideFieldType) => {
  if (hideFieldType === HideFieldType.Common) {
    return columns.slice(1);
  }

  switch (viewType) {
    case ViewType.Gantt:
      return columns;
    case ViewType.Calendar:
    case ViewType.OrgChart:
      return columns.slice(1);
    default:
      return columns.slice(1);
  }
};

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 490;

export const HiddenField: React.FC<React.PropsWithChildren<IHiddenFieldProps>> = (props) => {
  const { type: hideFieldType = HideFieldType.Common, triggerInfo, mobileModalclose } = props;
  const colors = useThemeColors();
  const { datasheetId, mirrorId } = useAppSelector((state) => state.pageParams)!;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId))!;
  const activeView = useAppSelector((state) => Selectors.getCurrentView(state))!;
  const viewType = activeView.type;
  const isGanttView = viewType === ViewType.Gantt;
  const isCalendarView = viewType === ViewType.Calendar;
  const isExclusive = hideFieldType === HideFieldType.Exclusive;
  const isGridView = viewType === ViewType.Grid;
  const columns: IViewColumn[] = activeView.columns;
  // The grid view requires a primary key, and the other views enter their own judgment logic.
  const freeColumns = getFreeColumnsByViewType(columns, viewType, hideFieldType);
  const coverFields = getCoverFields(fieldMap);
  const [query, setQuery] = useState('');
  const execute = (cmd: ICollaCommandOptions) => resourceService.instance!.commandManager.execute(cmd);
  const hiddenProp = getHiddenProps(viewType, hideFieldType);
  const handleHideField = useHideField(activeView, hiddenProp);
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { editable } = useAppSelector((state) => Selectors.getPermissions(state));
  const isViewLock = useShowViewLockModal();

  const { style } = useListenVisualHeight({
    listenNode: containerRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const data = [
      {
        fieldId: freeColumns[source.index].fieldId,
        overTargetId: freeColumns[destination.index].fieldId,
        direction: source.index > destination.index ? DropDirectionType.BEFORE : DropDirectionType.AFTER,
      },
    ];

    executeCommandWithMirror(
      () => {
        execute({
          cmd: CollaCommandName.MoveColumn,
          viewId: activeView.id,
          data,
        });
      },
      {
        columns: getMoveColumnsResult({
          viewId: activeView.id,
          data,
          datasheetId: datasheetId!,
        }),
      },
    );
  };

  function onChange(fieldId: string, checked: boolean) {
    handleHideField([fieldId], !checked);
  }

  const visibleRows = useAppSelector((state) => Selectors.getVisibleRows(state));
  const viewManualSave = useAppSelector((state) => state.labs.includes('view_manual_save'));
  const autoSave = Boolean(activeView.autoSave);

  function setActiveField(fieldId: string, ishidden: boolean, modalClose: (bool: boolean) => void) {
    if (!(isGridView || isGanttView) || isExclusive) {
      return;
    }
    if (ishidden && (!viewManualSave || autoSave)) {
      Message.warning({ content: t(Strings.hide_fields_not_go) });
      return;
    }
    if (viewManualSave && ishidden) {
      onChange(fieldId, ishidden);
    }
    const firstRecord = visibleRows[0];
    const lastRecord = visibleRows[visibleRows.length - 1];
    dispatch(StoreActions.setFieldRanges(datasheetId!, [fieldId]));
    dispatch(
      StoreActions.setSelection({
        start: {
          recordId: firstRecord.recordId,
          fieldId,
        },
        end: {
          recordId: lastRecord.recordId,
          fieldId,
        },
      }),
    );

    if (isMobile && modalClose) {
      modalClose(false);
    }
  }

  enum ActionType {
    Hide,
    Show,
  }

  function hideOrShowAllField(type: ActionType) {
    if (isCalendarView && type === ActionType.Show && columns.length > 10) {
      Message.warning({ content: t(Strings.hidden_field_calendar_tips) });
      return;
    }
    const newColumns: IViewColumn[] = columns.slice(0, 1);
    const isHidden = type === ActionType.Hide;
    if (isGanttView) {
      newColumns.push(...freeColumns.map((item) => ({ ...item, [hiddenProp]: isHidden })));
    } else {
      newColumns.push(...freeColumns.map((item) => ({ ...item, hidden: isHidden, [hiddenProp]: isHidden })));
    }

    executeCommandWithMirror(
      () => {
        execute({
          cmd: CollaCommandName.ModifyViews,
          data: [
            {
              viewId: activeView.id,
              key: 'columns',
              value: newColumns,
            },
          ],
        });
      },
      { columns: newColumns },
    );
  }

  // Whether the cover is stretched.
  const switchCoverFit = (checked: boolean) => {
    if (activeView.type === ViewType.Kanban || activeView.type === ViewType.Gallery) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: activeView.type === ViewType.Kanban ? CollaCommandName.SetKanbanStyle : CollaCommandName.SetGalleryStyle,
            viewId: activeView.id,
            styleKey: (activeView.type === ViewType.Kanban ? KanbanStyleKey.IsCoverFit : GalleryStyleKeyType.IsCoverFit) as any,
            styleValue: checked,
          });
        },
        {
          style: {
            ...activeView.style,
            [GalleryStyleKeyType.IsCoverFit]: checked,
          },
        } as any,
      );
    }
    if (activeView.type === ViewType.OrgChart) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: CollaCommandName.SetOrgChartStyle,
            viewId: activeView.id,
            styleKey: OrgChartStyleKeyType.IsCoverFit,
            styleValue: !checked,
          });
        },
        {
          style: {
            ...activeView.style,
            [OrgChartStyleKeyType.IsCoverFit]: !checked,
          },
        },
      );
      return;
    }
  };

  const switchShowHiddenFieldWithinMirror = (checked: boolean) => {
    executeCommandWithMirror(() => {
      execute({
        cmd: CollaCommandName.ModifyViews,
        data: [
          {
            viewId: activeView.id,
            key: 'displayHiddenColumnWithinMirror',
            value: checked,
          },
        ],
      });
    }, {});
  };

  // Whether to show hidden column names
  const switchColNameVisible = (checked: boolean) => {
    if (activeView.type === ViewType.Gallery) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: CollaCommandName.SetGalleryStyle,
            viewId: activeView.id,
            styleKey: GalleryStyleKeyType.IsColNameVisible,
            styleValue: checked,
          });
        },
        {
          style: {
            ...activeView.style,
            [GalleryStyleKeyType.IsColNameVisible]: checked,
          },
        },
      );
      return;
    }
    if (activeView.type === ViewType.Calendar) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: CollaCommandName.SetCalendarStyle,
            viewId: activeView.id,
            data: [
              {
                styleKey: CalendarStyleKeyType.IsColNameVisible,
                styleValue: checked,
              },
            ],
          });
        },
        {
          style: {
            ...activeView.style,
            [GalleryStyleKeyType.IsColNameVisible]: checked,
          },
        },
      );
      return;
    }
    if (activeView.type === ViewType.OrgChart) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: CollaCommandName.SetOrgChartStyle,
            viewId: activeView.id,
            styleKey: OrgChartStyleKeyType.IsColNameVisible,
            styleValue: checked,
          });
        },
        {
          style: {
            ...activeView.style,
            [OrgChartStyleKeyType.IsColNameVisible]: checked,
          },
        },
      );
      return;
    }
    if (activeView.type === ViewType.Kanban) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: CollaCommandName.SetKanbanStyle,
            viewId: activeView.id,
            styleKey: KanbanStyleKey.IsColNameVisible,
            styleValue: checked,
          });
        },
        {
          style: {
            ...activeView.style,
            [GalleryStyleKeyType.IsColNameVisible]: checked,
          },
        },
      );
    }
  };
  // Whether to show the cover.
  const changeCoverField = (value?: ISelectValue | null) => {
    if (activeView.type === ViewType.Gallery) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: CollaCommandName.SetGalleryStyle,
            viewId: activeView.id,
            styleKey: GalleryStyleKeyType.CoverFieldId as any,
            styleValue: (value === NO_COVER_FIELD_ID ? undefined : value) as any,
          });
        },
        {
          style: {
            ...activeView.style,
            [GalleryStyleKeyType.CoverFieldId as any]: value === NO_COVER_FIELD_ID ? undefined : value,
          },
        },
      );
    }
    if (activeView.type === ViewType.OrgChart) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: CollaCommandName.SetOrgChartStyle,
            viewId: activeView.id,
            styleKey: OrgChartStyleKeyType.CoverFieldId as any,
            styleValue: (value === NO_COVER_FIELD_ID ? undefined : value) as any,
          });
        },
        {
          style: {
            ...activeView.style,
            [OrgChartStyleKeyType.CoverFieldId as string]: value === NO_COVER_FIELD_ID ? undefined : value,
          },
        },
      );
    }
    if (activeView.type === ViewType.Kanban) {
      executeCommandWithMirror(
        () => {
          execute({
            cmd: CollaCommandName.SetKanbanStyle,
            viewId: activeView.id,
            styleKey: KanbanStyleKey.CoverFieldId as any,
            styleValue: (value === NO_COVER_FIELD_ID ? undefined : value) as any,
          });
        },
        {
          style: {
            ...activeView.style,
            [KanbanStyleKey.CoverFieldId as any]: value === NO_COVER_FIELD_ID ? undefined : value,
          },
        },
      );
    }
  };
  const getDefaultCoverValue = () => {
    if (activeView.type !== ViewType.Gallery && activeView.type !== ViewType.Kanban && activeView.type !== ViewType.OrgChart) {
      return;
    }
    if (coverFields.find((item) => item.id === activeView.style.coverFieldId)) {
      return activeView.style.coverFieldId;
    }
    return NO_COVER_FIELD_ID;
  };

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const filterFreeColumns = freeColumns.filter((field) => fieldMap[field.fieldId].name.includes(query));

  return (
    <div ref={containerRef} style={style} className={styles.hideField} onClick={stopPropagation}>
      <div className={styles.header}>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <div className={styles.title}>
            <Typography variant="h7">
              {[ViewType.Gallery, ViewType.Kanban].includes(activeView.type)
                ? t(Strings.set_gallery_card_style)
                : isExclusive && isGanttView
                  ? t(Strings.set_graphic_field)
                  : t(Strings.set_field)}
            </Typography>
            {[ViewType.Gallery, ViewType.Kanban].includes(activeView.type) && (
              <a
                href={activeView.type === ViewType.Gallery ? t(Strings.gallery_style_setting_url) : t(Strings.kanban_style_setting_url)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.helpIcon}
              >
                <QuestionCircleOutlined color={colors.thirdLevelText} />
              </a>
            )}
          </div>
          <SyncViewTip style={{ padding: '2px 0px 0px', marginBottom: 16 }} content={t(Strings.view_sync_property_tip_short)} />
        </ComponentDisplay>

        {activeView.type !== ViewType.Grid && activeView.type !== ViewType.Gantt && (
          <>
            {activeView.type !== ViewType.Calendar && (
              <>
                <div className={styles.coverSetting} style={{ margin: '0 0 8px' }}>
                  <span className={styles.label}>{t(Strings.cover_field)}</span>
                </div>
                <Select
                  value={getDefaultCoverValue() || ''}
                  disabled={(activeView.style.coverFieldId === undefined && coverFields.length === 0) || isViewLock}
                  disabledTip={isViewLock ? t(Strings.view_lock_setting_desc) : ''}
                  onSelected={({ value }) => {
                    changeCoverField(value);
                  }}
                >
                  <Option value={NO_COVER_FIELD_ID} currentIndex={0}>
                    <div className={styles.coverOption}>
                      <div className={styles.optionIcon}>
                        <DisabledOutlined color={colors.thirdLevelText} size={15} />
                      </div>
                      <div className={styles.coverOptionTitle}>{t(Strings.no_cover)}</div>
                    </div>
                  </Option>
                  {coverFields.map((coverField, index) => (
                    <Option key={coverField.id} value={coverField.id} currentIndex={index + 1}>
                      <div className={styles.coverOption}>
                        <div className={styles.optionIcon}>
                          <ImageOutlined color={colors.thirdLevelText} size={15} />
                        </div>
                        <div className={styles.coverOptionTitle}>{coverField.name}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
                <div className={styles.switchCoverFit} style={{ marginTop: 8 }}>
                  <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                    <span className={styles.switchCoverFitCheckbox}>
                      <Checkbox checked={activeView.style.isCoverFit} onChange={switchCoverFit} size={14} disabled={isViewLock} />
                    </span>
                  </WrapperTooltip>
                  <span style={{ paddingLeft: 4 }}>{t(Strings.gallery_img_stretch)}</span>
                </div>
              </>
            )}
            <div className={styles.label} style={{ marginTop: 16 }}>
              {t(Strings.view_field)}
              {activeView.type === ViewType.Calendar && (
                <Tooltip title={t(Strings.hidden_field_calendar_tips)} trigger={['hover']}>
                  <span className={styles.tip}>
                    <InfoCircleOutlined />
                  </span>
                </Tooltip>
              )}
            </div>
            <div className={styles.coverSetting} style={{ margin: '8px 0 4px' }}>
              <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                <span>
                  <Checkbox
                    checked={getIsColNameVisible(activeView.style.isColNameVisible)}
                    onChange={switchColNameVisible}
                    size={14}
                    disabled={isViewLock}
                  />
                </span>
              </WrapperTooltip>
              <div className={styles.switchCoverFit}>
                <span style={{ paddingLeft: 4 }}>{t(Strings.show_name)}</span>
              </div>
            </div>
          </>
        )}

        {/* Config: Do not display hidden fields in mirror? */}
        {!mirrorId && !isExclusive && editable && (
          <div className={styles.switchCoverFit}>
            <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
              <span className={styles.switchCoverFitCheckbox}>
                <Checkbox
                  checked={typeof activeView.displayHiddenColumnWithinMirror === 'boolean' ? activeView.displayHiddenColumnWithinMirror : true}
                  onChange={switchShowHiddenFieldWithinMirror}
                  size={14}
                  disabled={isViewLock}
                />
              </span>
            </WrapperTooltip>

            <span style={{ paddingLeft: 4 }}>{t(Strings.mirror_show_hidden_checkbox)}</span>
          </div>
        )}

        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <LineSearchInput
            placeholder={t(Strings.search)}
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            style={{ marginTop: 8 }}
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
      <div className={styles.fields}>
        {filterFreeColumns.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fieldList" direction="vertical">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} id="hiddenCard">
                  {filterFreeColumns.map((item, index) => (
                    <FieldItem
                      item={item}
                      keyword={query}
                      index={index}
                      key={item.fieldId}
                      disabledDrag={Boolean(query.length)}
                      fieldPermissionMap={fieldPermissionMap}
                      fieldMap={fieldMap}
                      onChange={onChange}
                      isMobile={isMobile}
                      hiddenProp={hiddenProp}
                      setActiveField={setActiveField}
                      modalClose={mobileModalclose!}
                    />
                  ))}
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
          <Button size="small" onClick={() => hideOrShowAllField(ActionType.Hide)} disabled={isViewLock}>
            {t(Strings.hide_all_fields)}
          </Button>
        </WrapperTooltip>
        <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
          <Button size="small" onClick={() => hideOrShowAllField(ActionType.Show)} disabled={isViewLock}>
            {t(Strings.show_all_fields)}
          </Button>
        </WrapperTooltip>
      </div>
      {/* TODO: Column permissions open when online. */}
      {/* <Button
       type='link'
       onClick={() => window.open('#')}
       className={styles.tips}
       >
       {t(Strings.tip_do_you_want_to_know_about_field_permission)}
       </Button> */}
    </div>
  );
};
