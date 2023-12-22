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

import axios from 'axios';
import { useAtomValue } from 'jotai';
import { atomsWithQuery } from 'jotai-tanstack-query';
import { getLanguage } from '@apitable/core';

import { getFilterActionTypes } from 'pc/components/robot/helper';
import { IActionType, ITriggerType } from 'pc/components/robot/interface';
import { loadableWithDefault } from 'pc/components/robot/robot_detail/api';
import { covertThemeIcon } from 'pc/components/robot/utils';
import { useAppSelector } from 'pc/store/react-redux';

import { getEnvVariables } from 'pc/utils/env';

const nestReq = axios.create({
  baseURL: '/nest/v1/',
});

const [triggerTypesAtom] = atomsWithQuery((get) => ({
  queryKey: [`/automation/trigger-types?lang=${getLanguage()}`],
  queryFn: async ({ queryKey: [url] }) => {
    const resp = await nestReq.get(String(url));
    return resp?.data?.data;
  },
  cacheTime: Infinity,
}));

const loadableTriggerAtom = loadableWithDefault(triggerTypesAtom, []);

const [actionTypesAtom] = atomsWithQuery((get) => ({
  queryKey: [`/automation/action-types?lang=${getLanguage()}`],
  queryFn: async ({ queryKey: [url] }) => {
    const r = await nestReq.get(String(url));
    return r?.data?.data;
  },
  cacheTime: Infinity,
}));

const loadableActionTypesAtom = loadableWithDefault(actionTypesAtom, []);

export const useTriggerTypes = (): { loading: boolean; data: ITriggerType[] } => {
  const themeName = useAppSelector((state) => state.theme);
  const value = useAtomValue(loadableTriggerAtom);

  const data = {
    success: true,
    code: 200,
    message: 'SUCCESS',
    data: [
      {
        triggerTypeId: 'attyfxYdq9GqAPxcbZ',
        name: '有新的表单提交时',
        description: '当指定表单收到新的提交时，自动化会开始运行',
        endpoint: 'form_submitted',
        inputJsonSchema: {
          schema: {
            type: 'object',
            required: ['formId'],
            properties: {
              formId: {
                type: 'string',
                title: '选择神奇表单',
              },
            },
            additionalProperties: false,
          },
          uiSchema: {},
        },
        outputJsonSchema: {
          type: 'object',
          title: '有新的表单提交时',
          required: ['datasheetId', 'datasheetName', 'recordId', 'recordUrl'],
          properties: {
            recordId: {
              type: 'string',
              title: '记录 ID',
            },
            recordUrl: {
              type: 'string',
              title: '记录 URL',
            },
            datasheetId: {
              type: 'string',
              title: '表格 ID',
            },
            datasheetName: {
              type: 'string',
              title: '表格名称',
            },
          },
        },
        service: {
          serviceId: 'asvct0KiIrKQTsTRCN',
          name: 'Datasheet',
          logo: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
          themeLogo: {
            light: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
            dark: 'space/2023/04/18/9e38324f3a1b441e886255850e8b36c8',
          },
          slug: 'vika',
        },
      },
      {
        triggerTypeId: 'att3AB2qZ47Qldul5K',
        name: '有记录满足条件时',
        description: '当表中有记录满足指定条件时，机器人会开始运行',
        endpoint: 'record_matches_conditions',
        inputJsonSchema: {
          schema: {
            type: 'object',
            required: ['datasheetId', 'filter'],
            properties: {
              filter: {
                type: 'string',
                title: '选择匹配条件',
                description:
                  '注意：不支持在匹配条件中添加日期列或者包含日期函数的公式列来实现定时触发或到期触发 [FAQ 参考](https://help.apitable.com/docs/guide/manual-automation-robot/#robot-scene-related-faq)',
              },
              datasheetId: {
                type: 'string',
                title: '选择表格',
              },
            },
            additionalProperties: false,
          },
          uiSchema: {
            'ui:order': ['datasheetId', 'filter'],
          },
        },
        outputJsonSchema: {
          type: 'object',
          title: '有记录满足条件时',
          required: ['datasheetId', 'datasheetName', 'recordId', 'recordUrl'],
          properties: {
            recordId: {
              type: 'string',
              title: '记录 ID',
            },
            recordUrl: {
              type: 'string',
              title: '记录 URL',
            },
            datasheetId: {
              type: 'string',
              title: '表格 ID',
            },
            datasheetName: {
              type: 'string',
              title: '表格名称',
            },
          },
        },
        service: {
          serviceId: 'asvct0KiIrKQTsTRCN',
          name: 'Datasheet',
          logo: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
          themeLogo: {
            light: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
            dark: 'space/2023/04/18/9e38324f3a1b441e886255850e8b36c8',
          },
          slug: 'vika',
        },
      },
      {
        triggerTypeId: 'attpoKSLIWLT0UEO4e',
        name: '有新的记录创建时',
        description: '只要表中有新的记录被创建（比如手动创建记录、API 创建记录、收到表单提交），机器人都会开始运行',
        endpoint: 'record_created',
        inputJsonSchema: {
          schema: {
            type: 'object',
            required: ['datasheetId'],
            properties: {
              datasheetId: {
                type: 'string',
                title: '选择表格',
              },
            },
            additionalProperties: false,
          },
          uiSchema: {},
        },
        outputJsonSchema: {
          type: 'object',
          title: '有新的记录创建时',
          required: ['datasheetId', 'datasheetName', 'recordId', 'recordUrl'],
          properties: {
            recordId: {
              type: 'string',
              title: '记录 ID',
            },
            recordUrl: {
              type: 'string',
              title: '记录 URL',
            },
            datasheetId: {
              type: 'string',
              title: '表格 ID',
            },
            datasheetName: {
              type: 'string',
              title: '表格名称',
            },
          },
        },
        service: {
          serviceId: 'asvct0KiIrKQTsTRCN',
          name: 'Datasheet',
          logo: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
          themeLogo: {
            light: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
            dark: 'space/2023/04/18/9e38324f3a1b441e886255850e8b36c8',
          },
          slug: 'vika',
        },
      },
      {
        triggerTypeId: 'attB8t2rmYlQAMLWeg',
        name: '按钮被点击时',
        description: '当用户点击你新建的按钮列时，自动化会开始运行',
        endpoint: 'button_clicked',
        inputJsonSchema: {
          schema: {
            type: 'object',
            required: ['datasheetId', 'fieldId'],
            properties: {
              fieldId: {
                type: 'string',
                title: '选择按钮字段',
              },
              datasheetId: {
                type: 'string',
                title: '选择维格表',
              },
            },
            additionalProperties: false,
          },
          uiSchema: {
            'ui:order': ['datasheetId', 'fieldId'],
          },
        },
        outputJsonSchema: {
          type: 'object',
          title: '按钮被点击时',
          required: ['clickedBy', 'datasheetId', 'datasheetName', 'recordId', 'recordUrl'],
          properties: {
            recordId: {
              type: 'string',
              title: '记录 ID',
            },
            clickedBy: {
              type: 'string',
              title: '点击者',
            },
            recordUrl: {
              type: 'string',
              title: '记录 URL',
            },
            datasheetId: {
              type: 'string',
              title: '维格表 ID',
            },
            datasheetName: {
              type: 'string',
              title: '维格表名称',
            },
          },
        },
        service: {
          serviceId: 'asvct0KiIrKQTsTRCN',
          name: '维格表',
          logo: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
          themeLogo: {
            light: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
            dark: 'space/2023/04/18/9e38324f3a1b441e886255850e8b36c8',
          },
          slug: 'vika',
        },
      },
      {
        triggerTypeId: 'attL7XLxHtx8aWC9HN',
        name: '定时任务触发时',
        description: '当到达预定时间时，自动化会开始运行',
        endpoint: 'scheduled_time_arrive',
        inputJsonSchema: {
          schema: {
            type: 'object',
            required: ['timeZone', 'scheduleType', 'scheduleRule'],
            properties: {
              timeZone: {
                type: 'string',
                title: '时区',
              },
              scheduleRule: {
                type: 'string',
                title: '选择匹配条件',
                description:
                  '注意：不支持在匹配条件中添加日期列或者包含日期函数的公式列来实现定时触发或到期触发 [FAQ 参考](https://help.apitable.com/docs/guide/manual-automation-robot/#robot-scene-related-faq)',
              },
              scheduleType: {
                enum: ['hour', 'day', 'week', 'month'],
                enumNames: ['按时', 'day', 'week', 'month'],
                enumName: ['hour', 'day', 'week', 'month'],
                type: 'string',
                title: '定时类型',
              },
            },
            additionalProperties: false,
          },
          uiSchema: {
            'ui:order': ['timeZone', 'scheduleType', 'scheduleRule'],
          },
        },
        outputJsonSchema: {},
        service: {
          serviceId: 'asvct0KiIrKQTsTRCN',
          name: '维格表',
          logo: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
          themeLogo: {
            light: 'space/2023/04/18/3e28c30a956b4f95aebc08e5eb0dc0cf',
            dark: 'space/2023/04/18/9e38324f3a1b441e886255850e8b36c8',
          },
          slug: 'vika',
        },
      },
    ],
  };

  if (value.loading) {
    return {
      loading: true,
      data: [],
    };
  }

  return {
    loading: false,
    data: covertThemeIcon(value.data, themeName),
  };
};

export const useActionTypes = (): { loading: boolean; originData: IActionType[]; data: IActionType[] } => {
  const themeName = useAppSelector((state) => state.theme);
  const actionTypeData = useAtomValue(loadableActionTypesAtom);
  const themedList = covertThemeIcon(actionTypeData?.data, themeName);
  if (actionTypeData.loading) {
    return {
      loading: true,
      data: [],
      originData: [],
    };
  }
  return {
    loading: false,
    originData: themedList,
    // @ts-ignore
    data: getFilterActionTypes(themedList),
  };
};
