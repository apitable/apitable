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
import { useAtom, useAtomValue } from 'jotai';
import { JSONSchema7 } from 'json-schema';
import Image from 'next/image';
import { forwardRef, memo, ReactElement, useImperativeHandle, useRef } from 'react';
import { Box, Button, ContextMenu, FloatUiTooltip as Tooltip, IconButton, Typography, useContextMenu, useTheme } from '@apitable/components';
import { IJsonSchema, Strings, t, validateMagicFormWithCustom } from '@apitable/core';
import { DeleteOutlined, MoreStandOutlined, WarnCircleFilled } from '@apitable/icons';
import { Modal } from 'pc/components/common';
import { deleteRobotAction, deleteTrigger } from 'pc/components/robot/api';
import { flatContextData } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { automationPanelAtom, automationStateAtom, PanelName, useAutomationController } from '../../../automation/controller';
import { useAutomationResourcePermission } from '../../../automation/controller/use_automation_permission';
import { OrEmpty } from '../../../common/or_empty';
import { useDeleteRobotAction } from '../../hooks';
import { INodeOutputSchema, IRobotNodeType } from '../../interface';
import { useCssColors } from '../trigger/use_css_colors';
import { IFormProps } from './core/interface';
import { MagicVariableForm } from './ui';

type INodeFormProps<T> = Omit<IFormProps<T>, 'schema' | 'nodeOutputSchemaList'> & {
  index: number;
  itemId?: string;
  schema: IJsonSchema;
  description?: string;
  serviceLogo?: string;
  onChange?: (value: string) => void;
  nodeOutputSchemaList?: INodeOutputSchema[];
  nodeId: string;
  title?: string;
  type?: 'trigger' | 'action';
  children?: ReactElement;
  handleClick?: () => void;
  handleDelete?: () => void;
  handleSubmit?: () => void;
  unsaved?: boolean;
};

export interface INodeFormControlProps {
  submit?: () => void;
}
export const NodeForm = memo(
  forwardRef<INodeFormControlProps, INodeFormProps<any>>((props: INodeFormProps<any>, ref) => {
    const formRef = useRef<any>(null);
    const { description, title, unsaved, type = 'trigger', children, handleClick, ...restProps } = props;
    const colors = useCssColors();

    useImperativeHandle(ref, () => ({
      submit: () => {
        (formRef.current as any)?.submit();
      },
    }));

    return (
      <Box height={'100%'} display={'flex'} flexDirection={'column'}>
        <Box flex={'1 1 auto'} overflow={'auto'}>
          <Typography variant="h6" color={colors.textCommonPrimary}>
            {title}
          </Typography>

          <Typography variant="body4" style={{ marginTop: 8 }} color={colors.textCommonTertiary}>
            {description}
          </Typography>

          <MagicVariableForm {...restProps} ref={formRef} liveValidate noValidate={false} style={{ marginTop: -24 }}>
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
                (formRef.current as any)?.submit();
              }}
              color="primary"
            >
              {t(Strings.robot_save_step_button)}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }),
);

export const NodeFormInfo = memo(
  forwardRef<INodeFormControlProps, INodeFormProps<any>>((props: INodeFormProps<any>, ref) => {
    const { title, serviceLogo, itemId, handleDelete, unsaved, type = 'trigger', nodeId, children, handleClick, index = 0, ...restProps } = props;
    const theme = useTheme();
    // @ts-ignore
    const { hasError } = validateMagicFormWithCustom(restProps.schema as JSONSchema7, restProps.formData, restProps?.validate);
    const deleteRobotAction = useDeleteRobotAction();
    const [, setAutomationPanel] = useAtom(automationPanelAtom);

    const automationState = useAtomValue(automationStateAtom);
    const {
      api: { refresh },
    } = useAutomationController();
    const colors = useCssColors();

    useImperativeHandle(ref, () => ({
      submit: () => {
        console.error('is not supported');
      },
    }));

    const handleDeleteRobotAction = () => {
      Modal.confirm({
        title: type === 'action' ? t(Strings.robot_action_delete) : t(Strings.robot_trigger_delete),
        content: t(Strings.robot_action_delete_confirm_desc),
        cancelText: t(Strings.cancel),
        okText: t(Strings.confirm),
        onOk: async () => {
          let deleteOk;
          handleDelete?.();
          if (type === 'trigger') {
            deleteOk = await deleteTrigger(automationState?.resourceId!, nodeId, automationState?.robot?.robotId!);
          } else {
            deleteOk = await deleteRobotAction(nodeId);
          }

          if (deleteOk) {
            if (!automationState?.resourceId) {
              return;
            }
            await refresh({
              resourceId: automationState?.resourceId!,
              robotId: automationState?.currentRobotId!,
            });
            setAutomationPanel((draft) => {
              draft.panelName = PanelName.BasicInfo;
            });
          }
        },
        onCancel: () => {
          return;
        },
        type: 'danger',
      });
    };

    const [panelState] = useAtom(automationPanelAtom);
    const isActive = panelState.dataId === nodeId && panelState?.panelName !== PanelName.BasicInfo;
    const permissions = useAutomationResourcePermission();
    const menuId = `robot_${type}_${nodeId}`;
    const menuData = [
      [
        {
          text: type === 'trigger' ? t(Strings.robot_trigger_delete) : t(Strings.robot_action_delete),
          icon: <DeleteOutlined />,
          onClick: handleDeleteRobotAction,
        },
      ],
    ];
    const itemRef = useRef(null);
    const isHovering = useHover(itemRef);
    const { show: showMenu } = useContextMenu({
      id: menuId,
    });

    return (
      <Box
        border={!isActive ? `1px solid ${theme.color.lineColor}` : `1px solid ${theme.color.borderBrandDefault}`}
        borderRadius="4px"
        ref={itemRef}
        width="100%"
        padding="16px"
        onClick={handleClick}
        backgroundColor={theme.color.fc8}
        id={itemId ?? `robot_node_${nodeId}`}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Box display="flex" alignItems="center" width="100%" style={{ cursor: props.disabled ? 'not-allowed' : 'pointer' }}>
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
                {unsaved && (
                  <Box marginLeft="8px" display="flex" alignItems="center">
                    <Tooltip content={t(Strings.there_are_unsaved_content_in_the_current_step)}>
                      <Box as="span" marginLeft="4px" display="flex" alignItems="center">
                        <WarnCircleFilled color={theme.color.textWarnDefault} />
                      </Box>
                    </Tooltip>
                  </Box>
                )}
                {hasError && !unsaved && (
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
          <OrEmpty visible={permissions.editable}>
            <>{(isHovering || isActive) && <IconButton shape="square" icon={MoreStandOutlined} onClick={(e) => showMenu(e)} />}</>
          </OrEmpty>
          <ContextMenu overlay={flatContextData(menuData, true)} menuId={menuId} />
        </Box>
      </Box>
    );
  }),
);
