import { ResourceType } from '@apitable/core';
import { IResource } from './resource.interface';

export class Form implements IResource {
  readonly type = ResourceType.Form;

  constructor(public readonly id: string) {}
}
