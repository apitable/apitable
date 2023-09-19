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
import { Box } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { INodeType, IRobotRunHistoryDetail } from '../../interface';
// import webhookOutputJsonSchema from '../node_form/data/webhook_output.json';
import { StyledTitle } from './common';
import { ErrorStacks } from './error_stacks';
import { FormDataRender } from './form_data_render';

interface IRobotRunHistoryActionDetail {
  nodeType: INodeType;
  nodeDetail: IRobotRunHistoryDetail['nodeByIds'][string];
}

const webhookJsonSchema = {
  schema: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        title: t(Strings.robot_run_history_status_code),
        type: 'number',
      },
      json: {
        title: t(Strings.robot_run_history_returned_data),
        type: 'object',
      },
    },
    additionalProperties: false,
  },
  uiSchema: {
    'ui:order': ['status', 'json'],
  },
};

const mailJsonSchema = {
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        title: 'message',
      },
    },
    additionalProperties: false,
  },
  uiSchema: {
    'ui:order': ['message'],
  },
};

export const RobotRunHistoryActionDetail = (props: IRobotRunHistoryActionDetail) => {
  const { nodeDetail } = props;

  // TODO: Remove
  const nodeType = produce(props.nodeType, (nodeType) => {
    if (nodeType.endpoint === 'sendRequest') {
      nodeType.outputJsonSchema = { ...webhookJsonSchema };
    } else if (nodeType.endpoint === 'sendMail') {
      nodeType.outputJsonSchema = { ...mailJsonSchema };
    } else {
      nodeType.outputJsonSchema = undefined;
    }
    return nodeType;
  });

  const hasError = nodeDetail.errorStacks && nodeDetail.errorStacks.length > 0;
  return (
    <Box width={'100%'}>
      <StyledTitle>{t(Strings.robot_run_history_input)}</StyledTitle>
      <FormDataRender nodeSchema={nodeType.inputJsonSchema} formData={nodeDetail.input} />
      <StyledTitle hasError={hasError}>{hasError ? t(Strings.robot_run_history_error) : t(Strings.robot_run_history_output)}</StyledTitle>
      {hasError ? (
        <ErrorStacks errorStacks={nodeDetail.errorStacks} />
      ) : (
        <FormDataRender nodeSchema={nodeType.outputJsonSchema} formData={nodeDetail.output.data} />
      )}
    </Box>
  );
};
