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

// import { Message } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { Message, Modal } from 'pc/components/common';
import { useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import { mutate } from 'swr';
import { changeActionTypeId, updateActionInput } from '../../api';
import { getFilterActionTypes, getNodeTypeOptions, operand2PureValue } from '../../helper';
import { useRobotTriggerType } from '../../hooks';
import { IActionType, INodeOutputSchema, IRobotAction } from '../../interface';
import { MagicTextField } from '../magic_variable_container';
import { NodeForm } from '../node_form';
import { Select } from '../select';

interface IRobotActionProps {
  index: number;
  actionTypes: IActionType[];
  action: IRobotAction;
  robotId: string;
  nodeOutputSchemaList: INodeOutputSchema[];
}

export const RobotAction = (props: IRobotActionProps) => {
  const { actionTypes, action, robotId, nodeOutputSchemaList, index = 0 } = props;
  const triggerType = useRobotTriggerType(robotId);
  const actionType = actionTypes.find(item => item.actionTypeId === action.typeId);
  const propsFormData = action.input;
  const handleActionTypeChange = useCallback((actionTypeId: string) => {
    if (actionTypeId === action?.typeId) {
      return;
    }
    Modal.confirm({
      title: t(Strings.robot_change_action_tip_title),
      content: t(Strings.robot_change_action_tip_content),
      cancelText: t(Strings.cancel),
      okText: t(Strings.confirm),
      onOk: () => {
        changeActionTypeId(action?.id!, actionTypeId).then(() => {
          mutate(`/robots/${robotId}/actions`);
        });
      },
      onCancel: () => {
        return;
      },
      type: 'warning',
    });
  }, [action, robotId]);

  if (!actionType) {
    return null;
  }

  const handleActionFormSubmit = (props: any) => {
    const newFormData = props.formData;
    if (!shallowEqual(newFormData, propsFormData)) {
      updateActionInput(action.id, newFormData).then(() => {
        mutate(`/robots/${robotId}/actions`);
        Message.success({
          content: t(Strings.robot_save_step_success)
        });
      }).catch(() => {
        Message.error({
          content: '步骤保存失败'
        });
      });
    }
  };
  // Find the position of the current action in the nodeOutputSchemaList and return only the schema before that
  const currentActionIndex = nodeOutputSchemaList.findIndex(item => item.id === action.id);
  const prevActionSchemaList = nodeOutputSchemaList.slice(0, currentActionIndex);
  const actionTypeOptions = getNodeTypeOptions(getFilterActionTypes(actionTypes, action.typeId));
  const { uiSchema, schema } = actionType.inputJsonSchema;
  // FIXME: Temporary solution, simple checksum rules should be configurable via json instead of writing code here.
  const validate = (formData: any, errors: any) => {
    // FIXME: No business code should appear here
    if (actionType && actionType.endpoint === 'sendLarkMsg') {
      try {
        const formDataValue = operand2PureValue(formData);
        const { type, content } = formDataValue || {};
        const markdownImageSyntaxRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/;
        if (type === 'markdown' && markdownImageSyntaxRegex.test(content)) {
          errors.addError(t(Strings.robot_action_send_lark_message_markdown_error));
        }
      } catch (error) {
        console.error('robot form validate error', error);
      }
    }

    return errors;
  };

  return <NodeForm
    nodeId={action.id}
    type="action"
    index={index}
    key={action.id}
    // noValidate
    // noHtml5Validate
    title={actionType.name}
    validate={validate}
    onSubmit={handleActionFormSubmit}
    description={actionType.description}
    formData={propsFormData}
    serviceLogo={integrateCdnHost(actionType.service.logo)}
    schema={schema}
    uiSchema={uiSchema}
    nodeOutputSchemaList={prevActionSchemaList}
    widgets={
      {
        TextWidget: (props: any) => {
          return <MagicTextField
            {...props}
            nodeOutputSchemaList={prevActionSchemaList}
            triggerType={triggerType}
          />;
        }
      }
    }
  >
    <Select options={actionTypeOptions} onChange={handleActionTypeChange} value={action.typeId} />
  </NodeForm>;
};
