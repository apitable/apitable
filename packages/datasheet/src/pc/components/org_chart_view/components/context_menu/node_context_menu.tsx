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
import parser from 'html-react-parser';
import { FC, useContext } from 'react';
import { ContextMenu, useThemeColors } from '@apitable/components';
import { CollaCommandName, ExecuteResult, Strings, t, Selectors } from '@apitable/core';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  LinkOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExpandOutlined,
  EyeCloseOutlined,
  EyeOpenOutlined,
  ArchiveOutlined
} from '@apitable/icons';
import { Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData } from 'pc/utils';
import { copyLink, copyRecord } from '../../../multi_grid/context_menu/record_menu';
import { ORG_NODE_MENU } from '../../constants';
import { FlowContext } from '../../context/flow_context';
import { INode } from '../../interfaces';
import { addRecord } from '../record_list';

export const NodeContextMenu: FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const { linkField, viewId, nodeStateMap, setNodeStateMap, rowsCount, fieldEditable, onChange } = useContext(FlowContext);

  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId)!;
  const { manageable } = useAppSelector((state) => Selectors.getPermissions(state, datasheetId));

  const toggleNodeCollapse = (id: string) => {
    setNodeStateMap((s) => ({
      ...s,
      [id]: {
        ...s?.[id],
        collapsed: !s?.[id]?.collapsed,
      },
    }));
  };

  const handleDelete = (recordId: string) => {
    const data: string[] = [recordId];
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteRecords,
      data,
    });

    if (ExecuteResult.Success === result) {
      notifyWithUndo(
        t(Strings.notification_delete_record_by_count, {
          count: data.length,
        }),
        NotifyKey.DeleteRecord,
      );
    }
  };

  const linkFieldId = linkField.id;

  const getArchiveNotice = (content) => {
    return <div>{parser(content)}</div>;
  };

  function archiveRecord(recordId: string) {
    const data: string[] = [];

    data.push(recordId);

    // The setTimeout is used here to ensure that the user is alerted that a large amount of data is being deleted before it is deleted
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ArchiveRecords,
      data,
    });

    if (ExecuteResult.Success === result) {
      Message.success({ content: t(Strings.archive_record_success) });

    }
  }

  return (
    <ContextMenu
      menuId={ORG_NODE_MENU}
      overlay={flatContextData(
        [
          [
            {
              icon: <ArrowUpOutlined />,
              text: t(Strings.org_chart_insert_into_parent),
              onClick: async ({ props: { node } }: any) => {
                const parent = node?.data?.parents?.[0] as INode;
                if (parent) {
                  const { id: preId } = parent;
                  const newRecordId = await addRecord(viewId, rowsCount);
                  onChange([
                    {
                      recordId: preId,
                      fieldId: linkFieldId,
                      value: parent.data.linkIds.filter((id) => id !== node.id).concat(newRecordId!),
                    },
                    {
                      recordId: newRecordId!,
                      fieldId: linkFieldId,
                      value: [node.id],
                    },
                  ]);
                }
              },
              hidden: ({ props: { node } }: any) => {
                if (!fieldEditable || node.data.parents.length === 0) {
                  return true;
                }
                if (linkField.property.limitSingleRecord && node?.data?.parents[0]?.data.linkIds?.length) {
                  return true;
                }
                return false;
              },
            },
            {
              icon: <ArrowDownOutlined />,
              text: t(Strings.org_chart_insert_into_child),
              onClick: ({ props: { node } }: any) => {
                const newRecordId = addRecord(viewId, rowsCount);
                onChange([
                  {
                    recordId: node.id,
                    fieldId: linkFieldId,
                    value: [...node.data.linkIds, newRecordId],
                  },
                ]);
                if (nodeStateMap?.[node.id]?.collapsed) {
                  toggleNodeCollapse(node.id);
                }
              },
              hidden: ({ props: { node } }: any) => {
                if (!fieldEditable) {
                  return true;
                }
                if (linkField.property.limitSingleRecord && node?.data?.linkIds?.length) {
                  return true;
                }
                return false;
              },
            },
          ],
          [
            {
              icon: <EyeCloseOutlined color={colors.thirdLevelText} />,
              text: t(Strings.org_chart_collapse_node),
              onClick: ({ props: { node } }: any) => {
                toggleNodeCollapse(node.id);
              },
              hidden: ({ props: { node } }: any) => {
                return Boolean(nodeStateMap?.[node.id]?.collapsed || node?.data.linkIds?.length === 0);
              },
            },
            {
              icon: <EyeOpenOutlined color={colors.thirdLevelText} />,
              text: t(Strings.org_chart_expand_node),
              onClick: ({ props: { node } }: any) => {
                toggleNodeCollapse(node.id);
              },
              hidden: ({ props: { node } }: any) => {
                return !nodeStateMap?.[node.id]?.collapsed;
              },
            },
          ],
          [
            {
              icon: <LinkOutlined color={colors.thirdLevelText} />,
              text: t(Strings.org_chart_copy_record_url),
              onClick: ({ props: { node } }: any) => {
                copyLink(node.id);
              },
            },
            {
              icon: <CopyOutlined color={colors.thirdLevelText} />,
              text: t(Strings.org_chart_create_a_node_copy),
              onClick: async ({ props: { node } }: any) => {
                const result = await copyRecord(node.id);
                if (result.result === ExecuteResult.Success) {
                  const newRecordId = result.data && result.data[0];
                  const parent = node?.data.parents?.[0];
                  if (parent) {
                    const {
                      data: { linkIds },
                      id: preId,
                    } = parent;
                    const targetIndex = linkIds.indexOf(node.id);
                    const newLinkIds = [...linkIds];
                    newLinkIds.splice(targetIndex, 0, newRecordId);
                    onChange([
                      {
                        recordId: preId,
                        fieldId: linkFieldId,
                        value: newLinkIds,
                      },
                      {
                        recordId: newRecordId,
                        fieldId: linkFieldId,
                        value: [],
                      },
                    ]);
                  }
                }
              },
              hidden: ({ props: { node } }: any) => {
                if (!fieldEditable || node.data.parents.length === 0) {
                  return true;
                }
                if (linkField.property.limitSingleRecord && node?.data?.parents[0]?.data.linkIds?.length) {
                  return true;
                }
                return false;
              },
            },
            {
              icon: <ExpandOutlined color={colors.thirdLevelText} />,
              text: t(Strings.org_chart_expand_record),
              onClick: ({ props: { node } }: any) => {
                expandRecordIdNavigate(node.id);
              },
            },
          ],
          [
            {
              icon: <ArchiveOutlined color={colors.thirdLevelText} />,
              text: t(Strings.menu_archive_record),
              hidden: !manageable,
              onClick: ({ props: { node } }: any) => {
                Modal.warning({
                  title: t(Strings.menu_archive_record),
                  content: getArchiveNotice(t(Strings.archive_notice)),
                  onOk: () => archiveRecord(node.id),
                  closable: true,
                  hiddenCancelBtn: false,
                });
              },
            },
            {
              icon: <DeleteOutlined color={colors.thirdLevelText} />,
              text: t(Strings.delete),
              onClick: ({ props: { node } }: any) => {
                handleDelete(node.id);
              },
              hidden: () => {
                if (!fieldEditable) {
                  return true;
                }
                return false;
              },
            },
          ],
        ],
        true,
      )}
    />
  );
};
