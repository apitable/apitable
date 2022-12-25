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

const triggerOutputSchema = {
  type: 'object',
  required: ['datasheet', 'record'],
  properties: {
    record: {
      type: 'object',
      required: ['id', 'url', 'fields'],
      properties: {
        id: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        areYouOk: {
          type: 'boolean',
        },
        fields: {
          type: 'object',
        },
      },
    },
    datasheet: {
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
      },
    },
  },
  additionalProperties: false,
};

const actionOutputSchema = {
  type: 'object',
  required: ['datasheet', 'record'],
  properties: {
    record: {
      type: 'object',
      required: ['id', 'url', 'fields'],
      properties: {
        id: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        areYouOk: {
          type: 'boolean',
        },
        fields: {
          type: 'object',
        },
      },
    },
    datasheet: {
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
      },
    },
  },
  additionalProperties: false,
};

export const schemaMapList = [
  {
    id: 'trigger',
    title: '表单提交时',
    schema: triggerOutputSchema,
  },
  {
    id: 'action',
    title: '查找记录',
    schema: actionOutputSchema,
  },
];
