import { ResourceType } from '@apitable/core';
import { IResource } from './resource.interface';

export class Mirror implements IResource {
  readonly type = ResourceType.Mirror;

  constructor(public readonly id: string) {}
}
