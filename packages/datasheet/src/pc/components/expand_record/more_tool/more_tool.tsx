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

import { useContext, useState } from 'react';
import * as React from 'react';
import { useDispatch, shallowEqual } from 'react-redux';
import { IconButton, LinkButton, useThemeColors } from '@apitable/components';
import { CollaCommandName, ExecuteResult, Selectors, StoreActions, DatasheetApi, Strings, t } from '@apitable/core';
import { AttentionOutlined, DeleteOutlined, InfoCircleOutlined, LinkOutlined, MoreStandOutlined } from '@apitable/icons';

import { Message } from 'pc/components/common';
import { Popover } from 'pc/components/common/mobile/popover';
import { notifyWithUndo } from 'pc/components/common/notify';

import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { useRequest } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard } from 'pc/utils';

import EditorTitleContext from '../editor_title_context';
import style from './style.module.less';

interface IMoreToolProps {
  recordId: string;
  onClose(): void;
  commentPaneShow: boolean;
  datasheetId: string;
  mirrorId?: string;
}
export const MoreTool: React.FC<React.PropsWithChildren<IMoreToolProps>> = (props) => {
  const colors = useThemeColors();
  const { recordId, onClose, datasheetId, mirrorId } = props;

  const dispatch = useDispatch();

  const { rowRemovable, subscriptions } = useAppSelector((state) => {
    return {
      rowRemovable: Selectors.getPermissions(state).rowRemovable,
      subscriptions: state.subscriptions,
    };
  }, shallowEqual);
  const { shareId, templateId, embedId } = useAppSelector((state) => state.pageParams);

  const { fieldDescCollapseStatusMap = {}, setFieldDescCollapseStatusMap } = useContext(EditorTitleContext);

  const fieldDescCollapseStatus = fieldDescCollapseStatusMap[datasheetId];
  const closeAllFieldsDesc = Boolean(fieldDescCollapseStatus?.collapseAll);
  const nextState = !closeAllFieldsDesc;

  const { run: subscribeRecordByIds } = useRequest(DatasheetApi.subscribeRecordByIds, { manual: true });
  const { run: unsubscribeRecordByIds } = useRequest(DatasheetApi.unsubscribeRecordByIds, { manual: true });

  const deleteRecord = () => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteRecords,
      data: [recordId],
    });
    if (ExecuteResult.Success === result.result) {
      notifyWithUndo(
        t(Strings.notification_delete_record_by_count, {
          count: 1,
        }),
        NotifyKey.DeleteRecord,
      );
    }
    onClose();
  };

  const copyLink2clipBoard = () => {
    copy2clipBoard(window.location.href, () => {
      Message.success({ content: t(Strings.link_copy_success) });
    });
    setVisible(false);
  };

  const onSubOrUnsub = async () => {
    if (subscriptions.includes(recordId)) {
      const { data } = await unsubscribeRecordByIds({ datasheetId, mirrorId, recordIds: [recordId] });

      if (data?.success) {
        Message.info({ content: t(Strings.cancel_watch_record_success) });
        dispatch(StoreActions.setSubscriptionsAction(subscriptions.filter((id) => id !== recordId)));
        setVisible(false);
      } else {
        Message.error({ content: data.message });
      }

      return;
    }

    const { data } = await subscribeRecordByIds({ datasheetId, mirrorId, recordIds: [recordId] });

    if (data?.success) {
      Message.info({ content: t(Strings.watch_record_success) });
      dispatch(StoreActions.setSubscriptionsAction([...new Set([...subscriptions, recordId])]));
      setVisible(false);
    } else {
      Message.error({ content: data.message });
    }
  };

  const toggleFieldsDesc = () => {
    const fieldDescCollapseMap = fieldDescCollapseStatus?.fieldDescCollapseMap || {};
    const nextFieldDescCollapseMap = Object.keys(fieldDescCollapseMap).reduce((acc, cur) => {
      acc[cur] = nextState;
      return acc;
    }, {});

    setFieldDescCollapseStatusMap({
      ...fieldDescCollapseStatusMap,
      [datasheetId]: {
        ...fieldDescCollapseStatus,
        collapseAll: nextState,
        fieldDescCollapseMap: nextFieldDescCollapseMap,
      },
    });
    if (nextState) {
      Message.info({ content: t(Strings.message_hidden_field_desc) });
    } else {
      Message.info({ content: t(Strings.message_shown_field_desc) });
    }
  };

  const subOrUnsubText = React.useMemo(
    () => (subscriptions.includes(recordId) ? t(Strings.cancel_watch_record_mobile) : t(Strings.record_watch_mobile)),
    [recordId, subscriptions],
  );

  const toolItemData = [
    {
      icon: <AttentionOutlined size={16} color={colors.white} />,
      name: subOrUnsubText,
      onClick: onSubOrUnsub,
      visible: !shareId && !templateId && !embedId,
    },
    {
      icon: <InfoCircleOutlined size={16} color={colors.white} />,
      name: nextState ? t(Strings.hidden_field_desc) : t(Strings.show_field_desc),
      onClick: toggleFieldsDesc,
      visible: true,
    },
    {
      icon: <LinkOutlined size={16} color={colors.white} />,
      name: t(Strings.copy_url_line),
      onClick: copyLink2clipBoard,
      visible: !embedId,
    },
    {
      icon: <DeleteOutlined size={16} color={colors.white} />,
      name: t(Strings.delete_row),
      onClick: deleteRecord,
      visible: rowRemovable,
    },
  ];

  const content = (
    <div className={style.content}>
      {toolItemData.map((item) => {
        if (!item.visible) {
          return null;
        }
        return (
          <div className={style.moreToolItem} onClick={item.onClick} key={item.name}>
            <LinkButton underline={false} className={style.moreToolBtn} prefixIcon={item.icon}>
              <span className={style.toolName}>{item.name}</span>
            </LinkButton>
          </div>
        );
      })}
    </div>
  );

  const [visible, setVisible] = useState(false);

  return (
    <Popover content={content} popupVisible={visible} onPopupVisibleChange={(visible) => setVisible(visible)}>
      <IconButton icon={() => <MoreStandOutlined size={16} color={colors.black[50]} />} shape="square" className={style.trigger} />
    </Popover>
  );
};
