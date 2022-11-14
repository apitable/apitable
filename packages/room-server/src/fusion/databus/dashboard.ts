import { ResourceType } from '@apitable/core';
import { IResource } from './resource.interface';

export class Dashboard implements IResource {
  readonly type = ResourceType.Dashboard;

  constructor(public readonly id: string) {}
}
