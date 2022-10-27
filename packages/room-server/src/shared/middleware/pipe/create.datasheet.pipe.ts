import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getFieldTypeByString, getNewId, IDPrefix
  , getFieldClass, IField, Field, IReduxState, getMaxFieldCountPerSheet, FieldTypeDescriptionMap } from '@apitable/core';
import { REQUEST_HOOK_FOLDER, REQUEST_HOOK_PRE_NODE, SPACE_ID_HTTP_DECORATE } from '../../common';
import { NodeEntity } from '../../../datasheet/entities/node.entity';
import { ApiTipIdEnum } from 'shared/enums/string.enum';
import { ApiException } from '../../exception';
import { genDatasheetDescriptionDto } from '../../../datasheet/dtos/datasheet.description.dto';
import { DatasheetCreateRo } from '../../../fusion/ros/datasheet.create.ro';
import { DatasheetFieldCreateRo } from '../../../fusion/ros/datasheet.field.create.ro';

@Injectable()
export class CreateDatasheetPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  transform(ro: DatasheetCreateRo): DatasheetCreateRo {
    if(ro.name && ro.name.length > 100){
      throw ApiException.tipError(ApiTipIdEnum.apiParamsMaxLengthError, { property: 'name', value: 100 });
    }
    if(ro.fields && ro.fields.length > 0) {
      const fieldLenthLimit = getMaxFieldCountPerSheet();
      if(ro.fields.length > fieldLenthLimit) {
        throw ApiException.tipError(ApiTipIdEnum.apiParamsMaxCountError, { property: 'fields', value: fieldLenthLimit });
      }
      this.validateFields(ro.fields);
      this.validatePrimaryFieldType(ro.fields[0].type);
    }
    if(ro.description) {
      if(ro.description.length > 500){
        throw ApiException.tipError(ApiTipIdEnum.apiParamsMaxLengthError, { property: 'description', value: 500 });
      }
      ro.description = JSON.stringify(genDatasheetDescriptionDto(ro.description));
    }
    if(this.request.body) {
      const folder = this.request[REQUEST_HOOK_FOLDER];
      const preNode = this.request[REQUEST_HOOK_PRE_NODE];
      const spaceId = this.request[SPACE_ID_HTTP_DECORATE];
      this.validateFolderAndPreNode(spaceId, folder, preNode);
    }
    if(ro.fields) {
      ro.fields = this.transformProperty(ro.fields);
    }
    return ro;
  }

  public transformProperty(fields: DatasheetFieldCreateRo[]): DatasheetFieldCreateRo[]{
    fields.forEach(field => { 
      switch(field.type) {
        case 'Number': 
          this.transformNumberProperty(field);
          break;
      }
    });
    return fields;
  }

  private transformNumberProperty(field: DatasheetFieldCreateRo) {
    const property: any = field.property;
    if (typeof property.precision === 'string') {
      property.precision = Number(property.precision);
    }
    field.property = property;
  }

  public validatePrimaryFieldType(type: string) {
    const fieldType = getFieldTypeByString(type as any)!;
    const canBePrimaryField = FieldTypeDescriptionMap[fieldType].canBePrimaryField;
    if(!canBePrimaryField) {
      throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidPrimaryFieldTypeError, { value: type });
    }
  }

  public validateFields(fields: DatasheetFieldCreateRo[]) {
    fields.forEach(field => {
      this.validate(field);
    });
    const seen = new Set();
    const hasDuplicatedFieldName = fields.some(function(field) {
      return seen.size === seen.add(field.name).size;
    });
    if (hasDuplicatedFieldName) {
      throw ApiException.tipError(ApiTipIdEnum.apiParamsMustUnique, { property: 'field.name' });
    }
  }

  public validate(field: DatasheetFieldCreateRo) {
    if(!field.name) {
      throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: 'field.name' });
    }
    if(field.name.length > 100){
      throw ApiException.tipError(ApiTipIdEnum.apiParamsMaxLengthError, { property: 'field.name', value: 100 });
    }
    const fieldType = getFieldTypeByString(field.type as any)!;
    if(!fieldType) {
      throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: `fields[${field.name}].type`, value: field.type });
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
      throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: `fields[${field.name}].property`, value: field.property });
    }
    return true;
  }

  public validateFolderAndPreNode(spaceId: string, folder: NodeEntity, preNode: NodeEntity) {
    const isFolderGiven: boolean = this.request.body['folderId']?true:false;
    const isPreNodeGiven: boolean = this.request.body['preNodeId']?true:false;
    if(isFolderGiven) {
      if(!folder) {
        throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: 'folderId' });
      } else if(spaceId !== folder.spaceId){
        throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: 'folderId' });
      }
    }
    if(isPreNodeGiven) {
      if(!preNode) {
        throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: 'preNodeId' });
      } else if(spaceId !== preNode.spaceId){
        throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: 'preNodeId' });
      }
    }

    if(isFolderGiven && isPreNodeGiven) {
      if(preNode.parentId !== folder.nodeId) {
        throw ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: 'preNodeId' });
      }
    }
    return true;
  }

}