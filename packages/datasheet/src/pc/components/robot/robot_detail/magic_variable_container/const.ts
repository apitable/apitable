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