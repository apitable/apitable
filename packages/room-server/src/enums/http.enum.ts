import Enum from 'enums/enum';

export enum FusionApiVersion {
  /**
   * v1.1版本
   */
  V11 = '1.1',
  /**
   * 默认版本v1.0
   */
  V10 = '1.0',
}

export const ApiHttpMethod = new Enum([
  { key: 'get', value: 1 },
  { key: 'post', value: 2 },
  { key: 'patch', value: 3 },
  { key: 'put', value: 4 },
]);
