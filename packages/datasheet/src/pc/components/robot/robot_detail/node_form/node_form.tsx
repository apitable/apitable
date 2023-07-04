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

import { Box, Button, ContextMenu, IconButton, Tooltip, Typography, useContextMenu, useTheme } from '@apitable/components';
import { Strings, t, validateMagicForm } from '@apitable/core';
import { DeleteOutlined, MoreStandOutlined, WarnCircleFilled } from '@apitable/icons';
import Image from 'next/image';
import { Modal } from 'pc/components/common';
import { flatContextData } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { useRef, useState } from 'react';
import { mutate } from 'swr';
import { IRobotNodeType } from '../../interface';
import { useDeleteRobotAction, useRobot } from '../../hooks';
import { MagicVariableForm } from './ui';
// FIXME: form type
// Trigger and Action's From form, wrapped in a layer here.
export const NodeForm = (props: any) => {
  const ref = useRef<any>(null);
  const [show, setShow] = useState(false);
  const { title, serviceLogo, children, description, type = 'trigger', nodeId, index = 0, ...restProps } = props;
  const theme = useTheme();
  const text = type === IRobotNodeType.Trigger ? t(Strings.robot_trigger_guide) : t(Strings.robot_action_guide);
  const selectTitle = type === IRobotNodeType.Trigger ? t(Strings.robot_trigger_type) : t(Strings.robot_action_type);
  const configTitle = type === IRobotNodeType.Trigger ? t(Strings.robot_trigger_config) : t(Strings.robot_action_config);

  const { hasError } = validateMagicForm(restProps.schema, restProps.formData);
  const deleteRobotAction = useDeleteRobotAction();
  const { currentRobotId } = useRobot();

  const handleDeleteRobotAction = () => {
    Modal.confirm({
      title: t(Strings.robot_action_delete),
      content: t(Strings.robot_action_delete_confirm_desc),
      cancelText: t(Strings.cancel),
      okText: t(Strings.confirm),
      onOk: async() => {
        const deleteOk = await deleteRobotAction(nodeId);
        deleteOk && mutate(`/robots/${currentRobotId}/actions`);
      },
      onCancel: () => {
        return;
      },
      type: 'warning',
    });
  };

  const menuId = `robot_${type}_${nodeId}`;
  const menuData = [
    [
      {
        text: t(Strings.robot_action_delete),
        icon: <DeleteOutlined />,
        onClick: handleDeleteRobotAction,
      },
    ]
  ];
  const { show: showMenu } = useContextMenu({
    id: menuId
  });

  return (
    <>
      {
        index === 0 && <Box display="flex" alignItems="center">
          <Box
            height="12px"
            width="2px"
            backgroundColor={theme.color.fc0}
            marginRight="4px"
          />
          <Typography variant="body2">
            {text}
          </Typography>
        </Box>
      }
      <Box
        border={`1px solid ${theme.color.lineColor}`}
        borderRadius="8px"
        height={show ? 'max-content' : '48px'}
        width="100%"
        margin="8px 0px"
        padding="12px"
        backgroundColor={theme.color.fc8}
        id={`robot_node_${nodeId}`}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box display="flex" alignItems="center"
            onClick={() => setShow(!show)}
            width="100%"
            style={{ cursor: 'pointer' }}
          >
            <span
              style={{
                borderRadius: 4,
                marginRight: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Image
                src={(type === IRobotNodeType.Trigger && getEnvVariables().ROBOT_TRIGGER_ICON) ? getEnvVariables().ROBOT_TRIGGER_ICON! : serviceLogo || '?'}
                width={24}
                height={24}
              />
            </span>
            <Typography variant="h7" ellipsis>
              {title}
            </Typography>
            {
              hasError && <Box
                marginLeft="4px"
                display="flex"
                alignItems="center"
              >
                <Tooltip content={t(Strings.robot_config_incomplete_tooltip)}>
                  <Box
                    as="span"
                    marginLeft="4px"
                    display="flex"
                    alignItems="center"
                  >
                    <WarnCircleFilled color={theme.color.textWarnDefault} />
                  </Box>
                </Tooltip>
              </Box>
            }
          </Box>
          {
            type === 'action' && <>
              <IconButton
                shape="square"
                icon={MoreStandOutlined}
                onClick={(e) => showMenu(e)}
              />
              <ContextMenu
                overlay={flatContextData(menuData, true)}
                menuId={menuId}
              />
            </>
          }
        </Box>
        {
          show && <Box
            marginTop="13px"
            paddingTop="16px"
            borderTop={`1px solid ${theme.color.lineColor}`}
          >
            <Box display="flex" alignItems="center" style={{ marginBottom: 4 }}>
              <Box
                height="12px"
                width="2px"
                backgroundColor={theme.color.fc0}
                marginRight="4px"
              />
              <Typography variant="h7" color={theme.color.fc1}>
                {selectTitle}
              </Typography>
            </Box>
            {children}
            <Typography variant="body4" style={{ marginTop: 4 }} color={theme.color.fc3}>
              {description}
            </Typography>
            <Box display="flex" alignItems="center" style={{ marginTop: 16, marginBottom: -16 }}>
              <Box
                height="12px"
                width="2px"
                backgroundColor={theme.color.fc0}
                marginRight="4px"
              />
              <Typography variant="h7" color={theme.color.fc1}>
                {configTitle}
              </Typography>
            </Box>
            <MagicVariableForm
              {...restProps}
              ref={ref}
              liveValidate
              style={{ marginTop: -24 }}
            >
              <Box
                marginTop="16px"
                display="flex"
                flexDirection="row-reverse"
              >
                <Box
                  display="flex"
                >
                  <Button
                    onClick={() => setShow(!show)}
                    variant="fill"
                    size="small"
                    style={{ marginRight: 16 }}
                  >
                    {t(Strings.robot_cancel_save_step_button)}
                  </Button>
                  <Button
                    variant="fill"
                    size="small"
                    onClick={() => {
                      (ref.current as any)?.submit();
                    }}
                    color="primary"
                  >
                    {t(Strings.robot_save_step_button)}
                  </Button>
                </Box>

              </Box>
            </MagicVariableForm>
          </Box>
        }
      </Box>
    </>
  );
};
