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

import {
  Box, ContextMenu, IconButton, TextButton, Tooltip, Typography, useContextMenu
} from '@apitable/components';
import { Message } from 'pc/components/common';
import { Selectors, Strings, t } from '@apitable/core';
import {
  ChevronLeftOutlined,
  DeleteOutlined, InfoCircleOutlined, EditOutlined, HistoryOutlined, QuestionCircleOutlined, MoreStandOutlined
} from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useSelector } from 'react-redux';
import { deleteRobot, refreshRobotList } from '../api';
import { useRobot } from '../hooks';
import { flatContextData } from 'pc/utils';

const MenuID = 'RobotDetailMoreAction';
export const RobotDetailHead = () => {
  const datasheetId = useSelector(Selectors.getActiveDatasheetId);
  const {
    currentRobotId, setCurrentRobotId, setIsHistory, setIsEditingRobotName, setIsEditingRobotDesc
  } = useRobot();

  const { show } = useContextMenu({ id: MenuID });

  const handleDeleteRobot = () => {
    if (!currentRobotId) {
      return;
    }
    Modal.confirm({
      title: t(Strings.robot_delete),
      content: t(Strings.robot_delete_confirm_desc),
      cancelText: t(Strings.cancel),
      okText: t(Strings.confirm),
      onOk: async() => {
        const ok = await deleteRobot(currentRobotId);
        if (ok) {
          refreshRobotList(datasheetId!);
          Message.success({
            content: t(Strings.delete_succeed)
          });
          setCurrentRobotId();
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
        text: t(Strings.robot_rename),
        icon: <EditOutlined />,
        onClick: () => {
          setIsEditingRobotName(true);
        }
      },
      {
        text: t(Strings.robot_edit_desc),
        icon: <InfoCircleOutlined />,
        onClick: () => {
          setIsEditingRobotDesc(true);
        }
      },
    ],
    [
      {
        text: t(Strings.robot_delete),
        icon: <DeleteOutlined />,
        onClick: handleDeleteRobot
      },
    ]
  ];
  return (
    <>
      <TextButton
        size="small"
        onClick={() => {
          setCurrentRobotId();
        }}
        prefixIcon={<ChevronLeftOutlined />}>
        <span style={{ lineHeight: 1 }}>{t(Strings.robot_return)}</span>
      </TextButton>
      <Box display="flex" alignItems="center">
        <Typography variant="h6">
          {t(Strings.robot_config_panel_title)}
        </Typography>
        <Tooltip content={t(Strings.robot_config_panel_help_tooltip)} placement="top-center">
          <Box display="flex" alignItems="center">
            <IconButton
              shape="square"
              icon={QuestionCircleOutlined} onClick={() => {
                window.open(t(Strings.robot_config_help_url));
              }} />
          </Box>
        </Tooltip>
      </Box>
      <Box
        display="flex"
        width="48px"
        justifyContent="space-between"
        marginRight="16px"
      >
        <Tooltip content={t(Strings.robot_run_history_tooltip)} placement="top-center">
          <Box display="flex" alignItems="center">
            <IconButton
              shape="square"
              icon={HistoryOutlined}
              onClick={() => setIsHistory(true)}
            />
          </Box>
        </Tooltip>
        <div style={{ padding: 8 }} />
        <Tooltip content={t(Strings.robot_more_operations_tooltip)} placement="top-center">
          <Box display="flex" alignItems="center">
            <IconButton
              shape="square"
              onClick={(e) => show(e)}
              icon={MoreStandOutlined}
            />
          </Box>
        </Tooltip>
      </Box>
      <ContextMenu
        menuId={MenuID}
        overlay={flatContextData(menuData, true)}
      />
    </>
  );
};
