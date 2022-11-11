import { Injectable, PipeTransform } from '@nestjs/common';
import { getFieldTypeByString, getNewId, IDPrefix
  , getFieldClass, IField, Field, IReduxState, ApiTipConstant } from '@apitable/core';
import { ApiException } from '../../exception';
import { FieldCreateRo } from '../../../fusion/ros/field.create.ro';
import { CreateDatasheetPipe } from './create.datasheet.pipe';

@Injectable()
export class CreateFieldPipe implements PipeTransform {

  transform(ro: FieldCreateRo): FieldCreateRo {
    this.validate(ro);
    this.transformProperty(ro);
    return ro;
  }

  public transformProperty(field) {
    const pipe = new CreateDatasheetPipe(null);
    pipe.transformProperty([field]);
  }

  public validate(field: FieldCreateRo) {
    if(!field.name) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'name' });
    }
    if(field.name && field.name.length > 100){
      throw ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'name', value: 100 });
    }
    const fieldType = getFieldTypeByString(field.type as any)!;
    if(!fieldType) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'type', value: field.type });
    }
    const fieldInfo = {
      id: getNewId(IDPrefix.Field),
      name: field.name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState); 
    const { error } = fieldContext.validateAddOpenFieldProperty(field.property||null);
    if (error) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'property', value: field.property });
    }
    return true;
  }

}