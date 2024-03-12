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

import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import produce from 'immer';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useContextMenu, useThemeColors } from '@apitable/components';
import {
  ConfigConstant,
  FieldType,
  IField,
  IMemberField,
  Selectors,
  Strings,
  t,
  ThemeName,
  UN_GROUP,
  IKanbanViewProperty,
  KanbanStyleKey,
} from '@apitable/core';
// import numeral from 'numeral';
import { MoreOutlined } from '@apitable/icons';
import { getAvatarRandomColor, Modal } from 'pc/components/common';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { KANBAN_GROUP_MORE } from 'pc/components/kanban_view/group_header/head_more_option';
import { InsertPlace, useAddNewCard } from 'pc/components/kanban_view/kanban_group/kanban_group';
import { inquiryValueByKey } from 'pc/components/multi_grid/cell/cell_options';
import { store } from 'pc/store';

import { useAppSelector } from 'pc/store/react-redux';
import { useCommand } from '../hooks/use_command';
import { IGroupHeaderProps } from './interface';
import { MemberFieldHead } from './member_field_head';
import { OptionFieldHead } from './option_field_head';
import styles from './styles.module.less';

interface ICollapseWrapper {
  isCollapse?: boolean;
  children: any;
}

const CollapseWrapper = ({ isCollapse, children }: ICollapseWrapper) => {
  if (isCollapse) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    );
  }
  return <>{children}</>;
};

export const GroupHeader: React.FC<React.PropsWithChildren<IGroupHeaderProps>> = (props) => {
  const colors = useThemeColors();
  const cacheTheme = useAppSelector(Selectors.getTheme);
  const { groupId, kanbanGroupMap, provided, setCollapse, collapse, scrollToItem } = props;
  const datasheetId = useAppSelector((state) => state.pageParams.datasheetId)!;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId))!;
  const kanbanFieldId = useAppSelector(Selectors.getKanbanFieldId)!;
  const field = useAppSelector((state) => Selectors.getField(state, kanbanFieldId));
  const view = useAppSelector(Selectors.getCurrentView) as IKanbanViewProperty;
  const cellValue = field.type === FieldType.Member ? [groupId] : groupId;
  const [editing, setEditing] = useState(false);
  const triggerRef = useRef<any>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const command = useCommand();
  const readOnly = useAppSelector((state) => !Selectors.getPermissions(state).manageable);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { show } = useContextMenu({
    id: KANBAN_GROUP_MORE,
  });

  const fieldRole = useAppSelector((state) => {
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    return Selectors.getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId);
  });
  const isCryptoField = fieldRole === ConfigConstant.Role.None;

  function onCommand(result: IField | string[]) {
    if (field.type === FieldType.SingleSelect) {
      setFieldAttr(result as IField);
    }

    if (field.type === FieldType.Member) {
      setRecord(result as string[]);
    }

    setEditing(false);
  }

  function setRecord(value: string[] | null) {
    const records = kanbanGroupMap[groupId] || [];
    command.setRecords(
      records.map((item) => {
        return {
          recordId: item.id,
          fieldId: kanbanFieldId,
          fieldType: FieldType.Member,
          value,
        };
      }),
    );
  }

  function deleteMemberGroup() {
    const records = kanbanGroupMap[groupId] || [];
    if (records.length) {
      setRecord(null);
    }
    const newField = {
      ...field,
      property: { ...field.property, unitIds: field.property.unitIds.filter((item: string) => item !== groupId) },
    };
    setFieldAttr(newField);
  }

  function setFieldAttr(value: IField) {
    command.setFieldAttr(field.id, value);
  }

  function getBgColor(theme: ThemeName) {
    const field = fieldMap![kanbanFieldId];
    if (groupId === UN_GROUP) {
      return colors.borderCommonDefault;
    }
    if (field.type === FieldType.SingleSelect) {
      return inquiryValueByKey('color', groupId, field, theme);
    }
    return getAvatarRandomColor(groupId);
  }

  const isCollapse = collapse && collapse.includes(groupId);

  function onClick() {
    if (!isCollapse) {
      return;
    }
    setCollapse(collapse!.filter((item) => item !== groupId));
  }

  const calcHeaderHeight = useCallback(() => {
    const dom = divRef.current;
    if (!dom) {
      return;
    }
    const parentNode = dom.parentElement!;
    if (isCollapse) {
      const grandParentNode = parentNode?.parentElement;
      const height = grandParentNode?.clientHeight;
      parentNode.style.width = height! - 24 + 'px';
      return;
    }
    parentNode.style.width = '';
  }, [isCollapse]);

  useEffect(() => {
    const resize = () => {
      setTimeout(calcHeaderHeight, 0);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [calcHeaderHeight]);

  useLayoutEffect(() => {
    calcHeaderHeight();
  }, [calcHeaderHeight]);

  const simpleCount = kanbanGroupMap[groupId]?.length || 0;
  // numeral(kanbanGroupMap[groupId]?.length).format('0a');

  const addNewRecord = useAddNewCard(
    groupId,
    () => {
      triggerRef.current?.close();
      scrollToItem && scrollToItem(0);
    },
    InsertPlace.Top,
  );

  function collapseGroup() {
    const state = store.getState();
    const groupingCollapseState = Selectors.getKanbanGroupCollapse(state);
    setCollapse([...groupingCollapseState, groupId]);
  }

  function hideGroup() {
    const hiddenGroupMap = view.style.hiddenGroupMap || {};
    const nextHiddenGroupMap = produce(hiddenGroupMap, (draft) => {
      draft[groupId] = true;
    });

    command.setKanbanStyle({
      styleKey: KanbanStyleKey.HiddenGroupMap,
      styleValue: nextHiddenGroupMap,
    });
  }

  function deleteGroup() {
    triggerRef.current?.close();
    Modal.confirm({
      title: t(Strings.delete_kanban_tip_title),
      content: t(Strings.delete_kanban_tip_content),
      okText: t(Strings.confirm),
      type: 'warning',
      onOk: () => {
        if (field.type === FieldType.Member) {
          deleteMemberGroup();
          return;
        }
        const newField = {
          ...field,
          property: { ...field.property, options: field.property.options.filter((item: { id: string }) => item.id !== groupId) },
        };
        setFieldAttr(newField);
        notifyWithUndo(t(Strings.delete_kanban_group), NotifyKey.DeleteKanbanGroup);
      },
    });
  }

  const showMore = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    show(e, {
      props: {
        deleteGroup,
        collapseGroup,
        hideGroup,
        addNewRecord,
        setEditing,
        groupId,
      },
    });
  };

  // Implemented at the top of the member column so that the member column can go beyond displaying ellipses and
  // adapts to the width of the statistics on the right
  useClickAway(
    () => {
      field.type !== FieldType.SingleSelect && setEditing(false);
    },
    wrapperRef,
    'mousedown',
  );

  return (
    <div
      {...provided?.dragHandleProps}
      className={styles.boardHead}
      style={{
        cursor: groupId === UN_GROUP ? '' : 'cursor',
        padding: isCollapse ? 0 : '',
      }}
      onClick={onClick}
      onContextMenu={!isCollapse ? showMore : undefined}
      tabIndex={0}
      onMouseDown={(e) => {
        e.currentTarget.focus();
      }}
      ref={divRef}
    >
      <div
        className={classNames({
          [styles.colorLine]: true,
          [styles.collapse]: isCollapse,
        })}
        style={{ background: getBgColor(cacheTheme) }}
      />
      <CollapseWrapper isCollapse={isCollapse}>
        {isCollapse && (
          <span className={styles.count} style={{ marginRight: 16, marginLeft: 24 }}>
            ({simpleCount})
          </span>
        )}
        <div
          className={classNames({
            [styles.innerWrapper]: true,
            [styles.collapse]: isCollapse,
            [styles.noPermission]: fieldRole,
          })}
          ref={wrapperRef}
        >
          {groupId === UN_GROUP && (
            <span
              className={styles.noGroupHead}
              style={{
                color: isCryptoField ? colors.fourthLevelText : '',
              }}
            >
              {isCryptoField ? t(Strings.kanban_no_permission) : t(Strings.kaban_not_group)}
            </span>
          )}
          {groupId !== UN_GROUP &&
            (field.type === FieldType.SingleSelect ? (
              <OptionFieldHead
                cellValue={cellValue as string}
                field={field}
                editing={editing}
                setEditing={setEditing}
                onCommand={onCommand}
                readOnly={readOnly}
              />
            ) : (
              <MemberFieldHead
                cellValue={cellValue as string[]}
                field={field as IMemberField}
                editing={editing}
                setEditing={setEditing}
                onCommand={onCommand}
                readOnly={readOnly}
              />
            ))}
          {(!collapse || !collapse.includes(groupId)) && (
            <span onClick={() => setEditing(false)} className={styles.count}>
              ({simpleCount})
            </span>
          )}
        </div>
      </CollapseWrapper>
      {(!collapse || !collapse.includes(groupId)) && (
        <span className={styles.more} onClick={showMore}>
          <MoreOutlined className={styles.dot} color={colors.thirdLevelText} />
        </span>
      )}
    </div>
  );
};
