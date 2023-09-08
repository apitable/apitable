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

import { useHover } from 'ahooks';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRef } from 'react';
import { mutate } from 'swr';
import {
  Box,
  Button,
  ContextMenu,
  IconButton,
  FloatUiTooltip as Tooltip,
  Typography,
  useContextMenu,
  useTheme
} from '@apitable/components';
import { Strings, t, validateMagicForm } from '@apitable/core';
import { DeleteOutlined, MoreStandOutlined, WarnCircleFilled } from '@apitable/icons';
import { Modal } from 'pc/components/common';
import { flatContextData } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { automationPanelAtom } from '../../../automation/controller';
import { getNodeTypeOptions } from '../../helper';
import { useDeleteRobotAction, useRobot, useTriggerTypes } from '../../hooks';
import { IRobotNodeType } from '../../interface';
import { useFormEdit } from '../form_edit';
import { MagicVariableForm } from './ui';

// FIXME: form type
// Trigger and Action's From form, wrapped in a layer here.
export const NodeForm = (props: any) => {
  const ref = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { description, title, type = 'trigger', children, ...restProps } = props;

  const { hasError } =useFormEdit();
  const theme = useTheme();

  return (
    <Box
      height={'100%'}
      display={'flex'}
      flexDirection={'column'}
      paddingTop="16px"
    >
      <Box flex={'1 1 auto'} overflow={'auto'}>
        <Typography variant="h7" color={theme.color.fc1}>
          {title}
        </Typography>

        <Typography variant="body4" style={{ marginTop: 4 }} color={theme.color.fc3}>
          {description}
        </Typography>

        <MagicVariableForm
          {...restProps}

          ref={ref}
          liveValidate
          style={{ marginTop: -24 }}
        >
          <></>
        </MagicVariableForm>
      </Box>

      <Box
        flex={'0 0 32px'}
        marginTop="16px"
        display="flex"
        width={'100%'}
        justifyContent={'center'}
        flexDirection="row-reverse"
      >
        <Box
          display="flex"
        >
          <Button
            variant="fill"
            disabled={hasError}
            size="middle"
            onClick={() => {
              (ref.current as any)?.submit();
            }}
            color="primary"
          >
            {t(Strings.robot_save_step_button)}
          </Button>
        </Box>

      </Box>
    </Box>
  );
};

export const NodeFormInfo = (props: any) => {
  const { title, serviceLogo, type = 'trigger', nodeId, children, onClick, index = 0, ...restProps } = props;
  const theme = useTheme();
  const { data: triggerTypes, loading: triggerTypesLoading } = useTriggerTypes();

  const options = getNodeTypeOptions(triggerTypes);
  console.log('options', options);
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
        deleteOk && mutate(`/automation/robots/${currentRobotId}/actions`);
      },
      onCancel: () => {
        return;
      },
      type: 'warning',
    });
  };

  const [panelState] = useAtom(automationPanelAtom);
  const isActive = panelState.dataId === nodeId;
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
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const { show: showMenu } = useContextMenu({
    id: menuId
  });

  return (
    <Box
      border={
        !isActive ?
          `1px solid ${theme.color.lineColor}`:
          `1px solid ${theme.color.borderBrandDefault}`
      }
      borderRadius="4px"
      ref={ref}
      width="100%"
      padding="12px"
      onClick={() => {
        onClick?.();
      }}
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
          width="100%"
          style={{ cursor: 'pointer' }}
        >
          <span
            style={{
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              marginRight: '16px'
            }}
          >
            <Image
              src={(type === IRobotNodeType.Trigger && getEnvVariables().ROBOT_TRIGGER_ICON) ?
                      getEnvVariables().ROBOT_TRIGGER_ICON! : serviceLogo || '?'}
              width={48}
              height={48}
              alt=""
            />
          </span>

          <Box display={'flex'} flexDirection={'column'}>
            <Typography variant="h7" ellipsis style={{
              textTransform: 'capitalize'
            }}>
              {type}
            </Typography>

            <Box display={'flex'} flexDirection={'row'}>
              {children}
              {
                hasError && <Box
                  marginLeft="8px"
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
          </Box>
        </Box>
        {
          type === 'action' && (isHovering ) && <>
            <IconButton
              shape="square"
              icon={MoreStandOutlined}
              onClick={(e) => showMenu(e)}
            />
          </>
        }
        <ContextMenu
          overlay={flatContextData(menuData, true)}
          menuId={menuId}
        />
      </Box>
    </Box>
  );
};
