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

import { useHover, usePrevious } from 'ahooks';
import { useAtom, useAtomValue } from 'jotai';
import { JSONSchema7 } from 'json-schema';
import Image from 'next/image';
import { memo, ReactElement, useEffect, useRef } from 'react';
import { mutate } from 'swr';
import {
  Box,
  Button,
  ContextMenu,
  IconButton,
  FloatUiTooltip as Tooltip,
  Typography,
  useContextMenu,
  useTheme,
  useThemeColors,
} from '@apitable/components';
import { IJsonSchema, Strings, t, validateMagicForm } from '@apitable/core';
import { DeleteOutlined, MoreStandOutlined, WarnCircleFilled } from '@apitable/icons';
import { Modal } from 'pc/components/common';
import { flatContextData } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { automationPanelAtom, automationStateAtom } from '../../../automation/controller';
import { useDeleteRobotAction, useRobot, useTriggerTypes } from '../../hooks';
import { INodeOutputSchema, INodeSchema, IRobotNodeType } from '../../interface';
import { useRobotListState } from '../../robot_list';
import { useCssColors } from '../trigger/use_css_colors';
import { IFormProps } from './core/interface';
import { MagicVariableForm } from './ui';

type INodeFormProps<T> = Omit<IFormProps<T>, 'schema' | 'nodeOutputSchemaList'> & {
  index: number;
  schema: IJsonSchema;
  description?: string;
  serviceLogo?: string;
  nodeOutputSchemaList?: INodeOutputSchema[];
  nodeId: string;
  title?: string;
  type?: 'trigger' | 'action';
  children?: ReactElement;
  handleClick?: () => void;
};

// FIXME: form type
// Trigger and Action's From form, wrapped in a layer here.
export const NodeForm = memo((props: INodeFormProps<any>) => {
  const ref = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { description, title, type = 'trigger', children, handleClick, ...restProps } = props;

  const theme = useTheme();
  // FIXME
  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      <Box flex={'1 1 auto'} overflow={'auto'}>
        <Typography variant="h7" color={theme.color.fc1}>
          {title}
        </Typography>

        <Typography variant="body4" style={{ marginTop: 4 }} color={theme.color.fc3}>
          {description}
        </Typography>

        <MagicVariableForm {...restProps} ref={ref} liveValidate style={{ marginTop: -24 }}>
          <></>
        </MagicVariableForm>
      </Box>

      <Box flex={'0 0 32px'} marginTop="16px" display="flex" width={'100%'} justifyContent={'center'} flexDirection="row-reverse">
        <Box display="flex">
          <Button
            variant="fill"
            style={{ width: '128px' }}
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
});

export const NodeFormInfo = memo((props: INodeFormProps<any>) => {
  const { title, serviceLogo, type = 'trigger', nodeId, children, handleClick, index = 0, ...restProps } = props;
  const theme = useTheme();
  const { hasError } = validateMagicForm(restProps.schema as JSONSchema7, restProps.formData);
  const deleteRobotAction = useDeleteRobotAction();
  const { currentRobotId } = useRobot();

  const automationState = useAtomValue(automationStateAtom);
  const {
    api: { refresh },
  } = useRobotListState();
  const colors = useCssColors();

  const handleDeleteRobotAction = () => {
    Modal.confirm({
      title: t(Strings.robot_action_delete),
      content: t(Strings.robot_action_delete_confirm_desc),
      cancelText: t(Strings.cancel),
      okText: t(Strings.confirm),
      onOk: async() => {
        const deleteOk = await deleteRobotAction(nodeId);
        if (deleteOk) {
          console.log('automationStateautomationStateautomationStateautomationState', automationState);
          if (!automationState?.resourceId) {
            return;
          }
          await refresh({
            resourceId: automationState?.resourceId!,
            robotId: automationState?.currentRobotId!,
          });
          await mutate(`/automation/robots/${currentRobotId}/actions`);
        }
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
    ],
  ];
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const { show: showMenu } = useContextMenu({
    id: menuId,
  });

  return (
    <Box
      border={!isActive ? `1px solid ${theme.color.lineColor}` : `1px solid ${theme.color.borderBrandDefault}`}
      borderRadius="4px"
      ref={ref}
      width="100%"
      padding="16px"
      onClick={handleClick}
      backgroundColor={theme.color.fc8}
      id={`robot_node_${nodeId}`}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <Box display="flex" alignItems="center" width="100%" style={{ cursor: 'pointer' }}>
          <span
            style={{
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              marginRight: '16px',
            }}
          >
            <Image
              src={
                type === IRobotNodeType.Trigger && getEnvVariables().ROBOT_TRIGGER_ICON ? getEnvVariables().ROBOT_TRIGGER_ICON! : serviceLogo || '?'
              }
              width={48}
              height={48}
              alt=""
            />
          </span>

          <Box display={'flex'} flexDirection={'column'}>
            <Typography
              variant="body4"
              ellipsis
              color={colors.textCommonTertiary}
              style={{
                textTransform: 'capitalize',
              }}
            >
              {type == IRobotNodeType.Trigger ? t(Strings.robot_trigger_guide) : t(Strings.action)}
            </Typography>

            <Box display={'flex'} flexDirection={'row'}>
              {children}
              {hasError && (
                <Box marginLeft="8px" display="flex" alignItems="center">
                  <Tooltip content={t(Strings.robot_config_incomplete_tooltip)}>
                    <Box as="span" marginLeft="4px" display="flex" alignItems="center">
                      <WarnCircleFilled color={theme.color.textWarnDefault} />
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {type === 'action' && isHovering && (
          <>
            <IconButton shape="square" icon={MoreStandOutlined} onClick={(e) => showMenu(e)} />
          </>
        )}
        <ContextMenu overlay={flatContextData(menuData, true)} menuId={menuId} />
      </Box>
    </Box>
  );
});
