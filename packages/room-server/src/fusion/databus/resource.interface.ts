import { ResourceType } from '@apitable/core';

export interface IResource {
  readonly id: string;
  readonly type: ResourceType;
}
