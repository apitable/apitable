import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseNumberField } from 'fusion/field/base.number.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class NumberField extends BaseNumberField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(NumberField.name, this);
  }
}
