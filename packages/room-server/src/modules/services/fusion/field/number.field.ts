import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { FieldManager } from '../field.manager';
import { BaseNumberField } from 'modules/services/fusion/field/base.number.field';

@Injectable()
export class NumberField extends BaseNumberField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(NumberField.name, this);
  }
}
