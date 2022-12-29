import { ResourceType } from '@apitable/core';
import { IResource } from './resource.interface';

export class Widget implements IResource {
  readonly type = ResourceType.Widget;

  constructor(public readonly id: string) {}
}
