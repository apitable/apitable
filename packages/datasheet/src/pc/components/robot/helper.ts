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

import { createElement, useMemo } from 'react';
import {
  ACTION_INPUT_PARSER_BASE_FUNCTIONS,
  ACTION_INPUT_PARSER_PASS_THROUGH_FUNCTIONS,
  ConfigConstant,
  Field,
  FieldType,
  IDatasheetMap,
  IField,
  IFieldPermissionMap,
  InputParser,
  integrateCdnHost,
  MagicVariableParser,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { IFetchDatasheet } from '@apitable/widget-sdk/dist/message/interface';
import { IFetchedDatasheet } from 'pc/components/automation/controller/hooks/use_robot_fields';
import { TriggerDataSheetMap } from 'pc/components/robot/robot_detail/magic_variable_container';
import { getEnvVariables } from 'pc/utils/env';
import { getFieldTypeIcon, getFieldTypeIconOrNull } from '../multi_grid/field_setting';
import { IActionType, IJsonSchema, INodeOutputSchema, INodeType, IRobotAction, IRobotTrigger, ITriggerType } from './interface';
// @ts-ignore
import { isWecomFunc } from 'enterprise/home/social_platform/utils';

/**
 * The client parses the expression without context, skipping dynamic parameters.
 */
export const operand2PureValue = (operand: any) => {
  const parser = new MagicVariableParser(ACTION_INPUT_PARSER_BASE_FUNCTIONS, ACTION_INPUT_PARSER_PASS_THROUGH_FUNCTIONS);
  const inputParser = new InputParser(parser);
  return inputParser.render(operand, {});
};

export const getNodeTypeOptions = (nodeTypes: INodeType[]) => {
  return nodeTypes.map((nodeType) => {
    return {
      value: 'triggerTypeId' in nodeType ? nodeType.triggerTypeId : nodeType.actionTypeId,
      label: nodeType.name,
      prefixIcon: createElement(
        'img',
        {
          src: integrateCdnHost(
            'triggerTypeId' in nodeType && getEnvVariables().ROBOT_TRIGGER_ICON ? getEnvVariables().ROBOT_TRIGGER_ICON! : nodeType.service.logo,
          ),
          style: {
            width: '16px',
            height: '16px',
          },
        },
        null,
      ),
    };
  });
};

export const checkIfDatasheetResourceValid = (dataSheetMap: IDatasheetMap, dstId: string | undefined) => {
  if (!dstId) {
    return false;
  }
  try {
    return dataSheetMap[dstId]?.datasheet?.name != null;
  } catch (_e) {
    return false;
  }
};
export const getNodeOutputSchemaList = (props: {
  actionList: IRobotAction[];
  triggers: IRobotTrigger[];
  triggerTypes: ITriggerType[];
  actionTypes: IActionType[];
  triggerDataSheetMap: TriggerDataSheetMap;
  dataSheetMap: IDatasheetMap;
}) => {
  const { actionList, triggerTypes, actionTypes, triggers, dataSheetMap, triggerDataSheetMap } = props;
  const schemaList: INodeOutputSchema[] = [];

  const map = new Map<string, number[]>();

  const timeScheduleTriggerType = triggerTypes.find((item) => item.endpoint === 'scheduled_time_arrive');

  const filteredTriggers = triggers.filter((trigger) => trigger.triggerTypeId !== timeScheduleTriggerType?.triggerTypeId);

  filteredTriggers.forEach((trigger, index) => {
    const resourceId = triggerDataSheetMap[trigger.triggerId] as unknown as string;
    if (resourceId && checkIfDatasheetResourceValid(dataSheetMap, resourceId)) {
      const itemMap = map.get(resourceId) ?? [];
      map.set(resourceId, [...itemMap, index]);
    }
  });

  filteredTriggers.forEach((trigger, index) => {
    const resourceId = triggerDataSheetMap[trigger.triggerId] as unknown as string;
    const triggerType = trigger && triggerTypes.find((triggerType) => triggerType.triggerTypeId === trigger?.triggerTypeId);
    if (triggerType) {
      if (checkIfDatasheetResourceValid(dataSheetMap, resourceId)) {
        if (map.has(resourceId)) {
          const itemMap = map.get(resourceId) ?? [];

          const arrayName = itemMap.map((item) => triggerTypes.find((triggerType) => triggerType.triggerTypeId === triggers[item]?.triggerTypeId)!);

          map.delete(resourceId);
          schemaList.push({
            id: resourceId,
            title: t(Strings.automation_variable_datasheet, {
              NODE_NAME: dataSheetMap[resourceId]?.datasheet?.name,
            }),
            description:
              itemMap.length === 1
                ? t(Strings.automation_variable_trigger_one, {
                  Trigger_Name: triggerType?.name ?? '',
                })
                : t(Strings.automation_variable_trigger_many, {
                  Trigger_Multiple: arrayName
                    .slice(0, arrayName.length - 1)
                    .map((item) => item?.name)
                    .filter(Boolean)
                    .join(','),
                  Trigger_Last: arrayName[arrayName.length - 1]?.name ?? '',
                }),
            // @ts-ignore
            icon: integrateCdnHost(getEnvVariables().ROBOT_TRIGGER_ICON ? getEnvVariables().ROBOT_TRIGGER_ICON! : triggerType?.service?.logo),
            schema: {
              ...triggerType.outputJsonSchema,
              title: t(Strings.automation_variable_datasheet, {
                NODE_NAME: dataSheetMap[resourceId]?.datasheet?.name,
              }),
            },
          });
        }
      }
    }
  });
  actionList.forEach((action) => {
    const actionType = actionTypes.find((actionType) => actionType.actionTypeId === action.typeId);
    if (actionType) {
      schemaList.push({
        id: action.id,
        //description: '这是描述',
        // @ts-ignore
        icon: integrateCdnHost(actionType?.service?.logo),
        title: actionType.name,
        // TODO: After integration, remove the judgement here, the three actions that send IM messages do not have outputJsonSchema.
        schema: ['sendWecomMsg', 'sendLarkMsg', 'sendDingtalkMsg'].includes(actionType?.endpoint) ? undefined : actionType.outputJsonSchema,
      });
    }
  });
  return schemaList;
};

export const fields2Schema = (fields: IField[], fieldPermissionMap: IFieldPermissionMap): IJsonSchema => {
  // Extract all fields from fields and convert to json schema
  const fieldsSchema = {
    title: '列属性',
    type: 'object',
    icon: undefined,
    properties: {},
  };
  const getFieldCommonSchema = (field: IField) => {
    const isCryptoField = Selectors.getFieldRoleByFieldId(fieldPermissionMap, field.id) === ConfigConstant.Role.None;
    return {
      title: isCryptoField ? t(Strings.robot_variables_cant_view_field) : field.name,
      icon: getFieldTypeIconOrNull(field.type) == null ? getFieldTypeIcon(FieldType.Number) : getFieldTypeIcon(field.type),
      disabled: isCryptoField,
    };
  };
  fields.forEach((field) => {
    const fieldOpenValueJsonSchema = Field.bindModel(field).openValueJsonSchema;
    fieldsSchema.properties[field.id] = {
      ...fieldOpenValueJsonSchema,
      ...getFieldCommonSchema(field),
    };
    // @ts-ignore
    fieldsSchema.icon = getFieldCommonSchema(field).icon;
  });
  return fieldsSchema;
};

// TODO(kailang): Currently it is to pass the enterprise micro acceptance, the follow-up to change back
export const getFilterActionTypes = (actionTypes: IActionType[], ignoreActionId?: string) => {
  let tmpActionTypes = actionTypes;
  // Enterprise Web Browser blocks Feishu and Dingtalk
  if (isWecomFunc?.() && tmpActionTypes) {
    tmpActionTypes = tmpActionTypes.filter((ad) => !['sendLarkMsg', 'sendDingtalkMsg'].includes(ad.endpoint) || ad.actionTypeId === ignoreActionId);
  }
  return tmpActionTypes;
};
