import { 
  ConfigConstant, FieldType, IField, IMemberField, 
  IRecord, ISelectField, Selectors, Strings, 
  t, ThemeName, UN_GROUP, IKanbanViewProperty,
  KanbanStyleKey, 
} from '@vikadata/core';
import classNames from 'classnames';
import produce from 'immer';
// import numeral from 'numeral';
import { getAvatarRandomColor, Modal } from 'pc/components/common';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { KANBAN_GROUP_MORE } from 'pc/components/kanban_view/group_header/head_more_option';
import { InsertPlace, useAddNewCard } from 'pc/components/kanban_view/kanban_group/kanban_group';
import { inquiryValueByKey } from 'pc/components/multi_grid/cell/cell_options';
import { store } from 'pc/store';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import IconDot from 'static/icon/common/common_icon_more.svg';
import { useClickAway } from 'ahooks';

import { useContextMenu, useThemeColors } from '@vikadata/components';

import { useCommand } from '../hooks/use_command';
import { MemberFieldHead } from './member_field_head';
import { OptionFieldHead } from './option_field_head';
import styles from './styles.module.less';

interface IGroupHeaderProps {
  groupId: string;
  kanbanGroupMap: {
    [key: string]: IRecord[];
  };
  setCollapse: (value: string[]) => void;
  scrollToItem?(index: number): void;
  provided?: DraggableProvided;
  collapse?: string[];
}

interface IHeadProps<T, K, P> {
  cellValue: T;
  field: K;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onCommand(result: P): void;
  readOnly?: boolean;
  isAdd?: boolean;
  isNewBoard?: boolean;
}

export type IHeadOptionProps = IHeadProps<string, ISelectField, IField>;
export type IHeadMemberProps = IHeadProps<string[], IMemberField, string[]>;

const CollapseWrapper = ({ isCollapse, children }) => {
  if (isCollapse) {
    return <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>;
  }
  return <>
    {children}
  </>;
};

export const GroupHeader: React.FC<IGroupHeaderProps> = props => {
  const colors = useThemeColors();
  const cacheTheme = useSelector(Selectors.getTheme);
  const { groupId, kanbanGroupMap, provided, setCollapse, collapse, scrollToItem } = props;
  const datasheetId = useSelector(state => state.pageParams.datasheetId)!;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, datasheetId))!;
  const kanbanFieldId = useSelector(Selectors.getKanbanFieldId)!;
  const field = useSelector(state => Selectors.getField(state, kanbanFieldId));
  const view = useSelector(Selectors.getCurrentView) as IKanbanViewProperty;
  const cellValue = field.type === FieldType.Member ? [groupId] : groupId;
  const [editing, setEditing] = useState(false);
  const triggerRef = useRef<any>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const command = useCommand();
  const readOnly = useSelector(state => !Selectors.getPermissions(state).manageable);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { show } = useContextMenu({
    id: KANBAN_GROUP_MORE,
  });

  const fieldRole = useSelector(state => {
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
    command.setRecords(records.map(item => {
      return {
        recordId: item.id,
        fieldId: kanbanFieldId,
        fieldType: FieldType.Member,
        value,
      };
    }));
  }

  function deleteMemberGroup() {
    const records = kanbanGroupMap[groupId] || [];
    if (records.length) {
      setRecord(null);
    }
    const newField = {
      ...field,
      property: { ...field.property, unitIds: field.property.unitIds.filter(item => item !== groupId) },
    };
    setFieldAttr(newField);
  }

  function setFieldAttr(value: IField) {
    command.setFieldAttr(field.id, value);
  }

  function getBgColor(theme: ThemeName) {
    const field = fieldMap![kanbanFieldId];
    if (groupId === UN_GROUP) {
      return colors.borderCommon;
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
    setCollapse(collapse!.filter(item => item !== groupId));
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
      parentNode.style.width = (height! - 24) + 'px';
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

  const addNewRecord = useAddNewCard(groupId, () => {
    triggerRef.current?.close();
    scrollToItem && scrollToItem(0);
  }, InsertPlace.Top);

  function collapseGroup() {
    const state = store.getState();
    const groupingCollapseState = Selectors.getKanbanGroupCollapse(state);
    setCollapse([...groupingCollapseState, groupId]);
  }

  function hideGroup() {
    const hiddenGroupMap = view.style.hiddenGroupMap || {};
    const nextHiddenGroupMap = produce(hiddenGroupMap, draft => {
      draft[groupId] = true;
    });

    command.setKanbanStyle({
      styleKey: KanbanStyleKey.HiddenGroupMap,
      styleValue: nextHiddenGroupMap
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
          property: { ...field.property, options: field.property.options.filter(item => item.id !== groupId) },
        };
        setFieldAttr(newField);
        notifyWithUndo(
          t(Strings.delete_kanban_group),
          NotifyKey.DeleteKanbanGroup,
        );
      },
    });
  }

  const showMore = (e) => {
    e.preventDefault();
    show(e, {
      props: {
        deleteGroup,
        collapseGroup,
        hideGroup,
        addNewRecord,
        setEditing,
        groupId
      }
    });
  };

  // 在成员列上层实现，是为了成员列可以超出显示省略号并且自适应右侧统计数字宽度
  useClickAway(() => {
    field.type !== FieldType.SingleSelect && setEditing(false);
  }, wrapperRef, 'mousedown');

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
      onMouseDown={(e) => { e.currentTarget.focus(); }}
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
        {
          isCollapse && <span className={styles.count} style={{ marginRight: 16, marginLeft: 24 }}>
            ({simpleCount})
          </span>
        }
        <div
          className={classNames({
            [styles.innerWrapper]: true,
            [styles.collapse]: isCollapse,
            [styles.noPermission]: fieldRole
          })}
          ref={wrapperRef}
        >
          {
            groupId === UN_GROUP &&
            <span
              className={styles.noGroupHead}
              style={{
                color: isCryptoField ? colors.fourthLevelText : '',
              }}
            >
              {
                isCryptoField ? t(Strings.kanban_no_permission) : t(Strings.kaban_not_group)
              }
            </span>
          }
          {
            groupId !== UN_GROUP &&
            (
              field.type === FieldType.SingleSelect ?
                <OptionFieldHead
                  cellValue={cellValue as string}
                  field={field}
                  editing={editing}
                  setEditing={setEditing}
                  onCommand={onCommand}
                  readOnly={readOnly}
                /> :
                <MemberFieldHead
                  cellValue={cellValue as string[]}
                  field={field as IMemberField}
                  editing={editing}
                  setEditing={setEditing}
                  onCommand={onCommand}
                  readOnly={readOnly}
                />
            )
          }
          {
            (!collapse || !collapse.includes(groupId)) &&
            <span onClick={() => setEditing(false)} className={styles.count}>
              ({simpleCount})
            </span>
          }
        </div>
      </CollapseWrapper>
      {
        (!collapse || !collapse.includes(groupId)) &&
        <span className={styles.more} onClick={showMore}>
          <IconDot className={styles.dot} fill={colors.thirdLevelText} />
        </span>
      }
    </div>
  );
};
