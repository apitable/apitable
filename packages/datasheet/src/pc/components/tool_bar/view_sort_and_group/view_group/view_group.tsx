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

import produce from 'immer';
import { useCallback, useRef } from 'react';
import * as React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { IUseListenTriggerInfo, useListenVisualHeight } from '@apitable/components';
import { CollaCommandName, IGroupInfo, Selectors, Strings, t, ViewType } from '@apitable/core';
import { PopUpTitle } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { SyncViewTip } from '../../sync_view_tip';
import { CommonViewSet } from '../common_view_set';
import styles from '../style.module.less';
import { ViewFieldOptions } from '../view_field_options';

interface IViewSetting {
  close(e: React.MouseEvent): void;
  triggerInfo?: IUseListenTriggerInfo;
}

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 340;

export const ViewGroup: React.FC<React.PropsWithChildren<IViewSetting>> = (props) => {
  const { triggerInfo } = props;
  const activeViewGroupInfo = useAppSelector((state) => Selectors.getActiveViewGroupInfo(state));
  const activityView = useAppSelector((state) => Selectors.getCurrentView(state))!;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
  });

  const activityViewId = activityView.id;
  const exitFieldIds = activeViewGroupInfo.map((item) => item.fieldId);
  const submitGroup = useCallback(
    (data: IGroupInfo | null) => {
      executeCommandWithMirror(
        () => {
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetGroup,
            viewId: activityViewId,
            data: data || undefined,
          });
        },
        {
          groupInfo: data || undefined,
        },
      );
    },
    [activityViewId],
  );
  // Gallery view supports only one level of grouping.
  const fieldSelectVisible = [ViewType.Gallery].includes(activityView.type)
    ? !activeViewGroupInfo.length
    : activeViewGroupInfo && activeViewGroupInfo.length < 3;

  function setGroupField(index: number, fieldId: string) {
    submitGroup(
      produce(activeViewGroupInfo, (draft) => {
        if (!exitFieldIds.length) {
          // First add.
          draft.push({ fieldId, desc: false });
        } else {
          // Second update, refreshing data.
          draft[index] = { fieldId, desc: false };
        }
        return draft;
      }),
    );
  }

  // Trigger the modification sequence after the end of dragging.
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }
      submitGroup(
        produce(activeViewGroupInfo, (draft) => {
          draft.splice(destination.index, 0, draft.splice(source.index, 1)[0]);
          return draft;
        }),
      );
    },
    [submitGroup, activeViewGroupInfo],
  );

  function setGroupRules(index: number, desc: boolean) {
    submitGroup(
      produce(activeViewGroupInfo, (draft) => {
        return draft.map((item, idx) => {
          if (idx === index) {
            return { ...item, desc };
          }
          return item;
        });
      }),
    );
  }

  function deleteItem(index: number) {
    const result = activeViewGroupInfo.filter((_item, idx) => idx !== index);
    submitGroup(result.length ? result : null);
  }

  React.useEffect(() => {
    onListenResize();
  }, [activeViewGroupInfo, onListenResize]);

  return (
    <div className={styles.viewSort} style={style} ref={containerRef}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <PopUpTitle title={t(Strings.set_grouping)} infoUrl={t(Strings.group_help_url)} variant={'h7'} className={styles.boxTop} />
        <SyncViewTip style={{ paddingLeft: 20 }} />
      </ComponentDisplay>

      <main>
        <CommonViewSet
          onDragEnd={onDragEnd}
          dragData={activeViewGroupInfo}
          setField={setGroupField}
          existFieldIds={exitFieldIds}
          setRules={setGroupRules}
          deleteItem={deleteItem}
        />
      </main>
      {fieldSelectVisible && (
        <div className={styles.selectField}>
          <ViewFieldOptions
            isAddNewOption
            onChange={setGroupField.bind(null, exitFieldIds.length)}
            defaultFieldId={t(Strings.add_grouping)}
            existFieldIds={exitFieldIds}
          />
        </div>
      )}
    </div>
  );
};
