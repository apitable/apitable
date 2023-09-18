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

import { Space } from 'antd';
import { useAtom } from 'jotai';
import React, { FC, memo } from 'react';
import {
  Box,
  ContextMenu,
  IconButton,
  Skeleton,
  FloatUiTooltip as Tooltip,
  useContextMenu,
  colorVars,
  useThemeColors,
  Button,
} from '@apitable/components';
import { DATASHEET_ID, Strings, t } from '@apitable/core';
import { CloseOutlined, DeleteOutlined, MoreStandOutlined } from '@apitable/icons';
import { flatContextData } from '../../utils';
import { Message, Modal } from '../common';
import { deleteRobot } from '../robot/api';
import { useRobot } from '../robot/hooks';
import { EditableInputDescription, InputTitle } from '../robot/robot_detail/input_title';
import { useRobotListState } from '../robot/robot_list';
import { AutomationPanelContent } from './content';
import { automationHistoryAtom, automationStateAtom, showAtomDetailModalAtom } from './controller';
import AutomationHistoryPanel from './run_history/modal/modal';
import styles from './style.module.less';

const MenuID = 'MoreAction';
export const AutomationPanel: FC<{onClose ?:() => void}> = memo(({ onClose }) => {
  const { show } = useContextMenu({ id: MenuID });

  const { currentRobotId, reset } = useRobot();
  const [automationState, setAutomationState] = useAtom(automationStateAtom);
  const [historyDialog, setHistoryDialog] = useAtom(automationHistoryAtom);
  const [, setShowModal] = useAtom(showAtomDetailModalAtom);

  const loading = false;
  const { api } = useRobotListState();

  const handleDeleteRobot = () => {
    Modal.confirm({
      title: t(Strings.robot_delete),
      content: t(Strings.robot_delete_confirm_desc),
      cancelText: t(Strings.cancel),
      okText: t(Strings.confirm),
      onOk: async () => {
        if (!currentRobotId) {
          return;
        }
        const ok = await deleteRobot(currentRobotId);
        if (ok) {
          setAutomationState(undefined);
          Message.success({
            content: t(Strings.delete_succeed),
          });
          setShowModal(false);
          await api.refresh();
        }
      },
      onCancel: () => {
        return;
      },
      type: 'danger',
    });
  };
  const menuData = [
    [
      {
        text: t(Strings.robot_delete),
        icon: <DeleteOutlined />,
        onClick: handleDeleteRobot,
      },
    ],
  ];

  const colors = useThemeColors();

  if (currentRobotId == null) {
    return null;
  }

  return (
    <Box display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'} overflowY={'hidden'}>
      <Box
        flex={'0 0 72px'}
        backgroundColor={colors.bgCommonDefault}
        borderBottom={`1px solid ${colors.borderCommonDefault}`}
        className={styles.tabBarWrapper1}
        id={DATASHEET_ID.VIEW_TAB_BAR}
      >
        {loading ? (
          <Space style={{ margin: '8px 20px' }}>
            <Skeleton style={{ height: 24, width: 340, marginTop: 0 }} />
          </Space>
        ) : (
          <Box
            display={'flex'}
            height={'100%'}
            width={'100%'}
            flexDirection={'row'}
            padding={'0 20px'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Box display={'flex'} flexDirection={'column'}>
              <InputTitle />
              <EditableInputDescription />
            </Box>

            <Box display="flex" alignItems="center">
              <Tooltip content={t(Strings.robot_more_operations_tooltip)}>
                <IconButton shape="square" onClick={(e) => show(e)} icon={MoreStandOutlined} />
              </Tooltip>
              <IconButton
                component="button"
                shape="square"
                icon={() => <CloseOutlined size={16} color={colorVars.fc3} />}
                onClick={onClose}
                style={{ marginLeft: 8 }}
              />
            </Box>
          </Box>
        )}
      </Box>

      <ContextMenu menuId={MenuID} overlay={flatContextData(menuData, true)} />

      <Box flex={'1 1 auto'} height={'100%'} overflowY={'hidden'}>
        <AutomationPanelContent />
      </Box>

      {historyDialog.dialogVisible && (
        <AutomationHistoryPanel
          onClose={() => {
            setHistoryDialog((draft) => ({
              ...draft,
              dialogVisible: false,
            }));
          }}
        />
      )}
    </Box>
  );
});
