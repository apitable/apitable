export const getDefaultValue = (type: string) => {
  switch (type) {
    case 'string':
      return 'New Value';
    case 'array':
      return [];
    case 'boolean':
      return false;
    case 'null':
      return null;
    case 'number':
      return 0;
    case 'object':
      return {};
    default:
      // We don't have a datatype for some reason (perhaps additionalProperties was true)
      return 'New Value';
  }
};