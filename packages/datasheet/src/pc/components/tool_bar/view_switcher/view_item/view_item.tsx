import { Selectors, Strings, t } from '@apitable/core';
import { useThemeColors } from '@vikadata/components';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ViewIcon } from '../view_icon';
import { OperateItem } from './operate_item';
import { AutosaveOutlined } from '@vikadata/icons';
import { Tooltip } from 'antd';

interface IViewItemOwnProps {
  currentViewId: string;
  currentViewName: string;
  viewLength: number;
  currentViewIndex: number;
  activityViewId: string;
  isEditingId: string;
  errorMsg: string;
  viewType: number;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter: () => void;
  switchView: (e: React.MouseEvent, id: string) => void;
  confirmDelete: (e: React.MouseEvent, id: string) => void;
  renameEvent: (id: string, name: string) => void;
  duplicateView: (id: string) => void;
  autoSave?: boolean;
  isViewLock?: boolean
}

type IViewItemProps = IViewItemOwnProps;

// TODO: Deletion requires pop-up confirmation.
export const ViewItem: React.FC<IViewItemProps> = props => {
  const {
    currentViewId, currentViewName, isEditingId, renameEvent, viewType,
    switchView, confirmDelete, errorMsg, onInput, onPressEnter,
    duplicateView, autoSave,isViewLock
  } = props;
  const colors = useThemeColors();
  const { viewCreatable, viewRenamable, viewMovable, viewRemovable } = useSelector(Selectors.getPermissions);
  const spaceManualSaveViewIsOpen = useSelector(state => {
    return state.labs.includes('view_manual_save');
  });

  const rename = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    renameEvent(currentViewId, currentViewName);
  };

  // The type of view icon.
  const viewIconFill = props.activityViewId === currentViewId ? colors.primaryColor : colors.thirdLevelText;

  const clickView = (e: React.MouseEvent) => {
    stopPropagation(e);
    switchView(e, currentViewId);
  };

  const showSuffixIcon = props.activityViewId === currentViewId && spaceManualSaveViewIsOpen && autoSave;
  return (
    <OperateItem
      allowSort={viewMovable}
      editing={isEditingId === currentViewId}
      prefixIcon={<ViewIcon viewType={viewType} width={16} height={16} fill={viewIconFill} onClick={stopPropagation} />}
      isActive={props.activityViewId === currentViewId}
      onItemClick={clickView}
      id={currentViewId}
      suffixIcon={
        showSuffixIcon ? <Tooltip title={t(Strings.auto_save_has_been_opend)}>
          <span style={{ marginLeft: 4, display: 'flex', alignItems: 'center' }}><AutosaveOutlined color={colors.primaryColor} /></span>
        </Tooltip> : undefined
      }
      inputData={
        {
          value: currentViewName,
          errMsg: errorMsg,
          onEnter: onPressEnter,
          onChange: onInput,
        }
      }
      operateData={{
        delete: {
          show: viewRemovable && props.viewLength > 1 && !isViewLock,
          tooltip: t(Strings.delete),
          onClick: (e) => { confirmDelete(e as any as React.MouseEvent, currentViewId); },
        },
        duplicate: {
          show: viewCreatable,
          tooltip: t(Strings.duplicate),
          onClick: () => { duplicateView(currentViewId); },
        },
        rename: {
          show: viewRenamable,
          tooltip: t(Strings.rename),
          onClick: (e) => { rename(e); },
        },
      }}
    />
  );
};
