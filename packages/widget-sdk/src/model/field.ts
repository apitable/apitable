import {
  BasicValueType, Field as FieldCore, getFieldResultByStatType, FieldType as CoreFieldType, 
  ICurrencyFieldProperty, IDateTimeFieldProperty, IField, INumberFieldProperty,
  INumberFormatFieldProperty, LookUpField, Selectors, StatType, getFieldTypeString,
  IEffectOption,
  ICollaCommandExecuteResult,
  CollaCommandName,
  ExecuteResult,
  IUpdateOpenMagicLinkFieldProperty,
  Conversion,
  Strings,
  t
} from 'core';
import { cmdExecute } from 'iframe_message/utils';
import { IWidgetContext, IFormatType, FieldType, IPermissionResult, IPropertyInView } from 'interface';
import { errMsg } from 'utils/private';
import { Record } from './record';
import { getNewId, IDPrefix } from '@vikadata/core';

/**
 * @hidden
 * 企业微信兼容判断，三方应用不支持显示成员字段
 * @param type 
 * @returns 
 */
export const showField = (type: FieldType) => {
  if (!window['_isSocialWecom']) {
    return true;
  }
  if (![FieldType.CreatedBy, FieldType.LastModifiedBy, FieldType.Member].includes(type)) {
    return true;
  }
  return navigator.userAgent.toLowerCase().indexOf('wxwork') === -1;
};

const getNoAcceptableFieldString = (type: FieldType, fieldName: string) => {
  const stringMap = {
    [FieldType.Member]: t(Strings.wecom_widget_member_field_name, { fieldName }),
    [FieldType.CreatedBy]: t(Strings.wecom_widget_created_by_field_name, { fieldName }),
    [FieldType.LastModifiedBy]: t(Strings.wecom_widget_last_edited_by_field_name, { fieldName }),
  };
  return stringMap[type] || 'NoAcceptable';
};

// 字段描述长度
const MAX_DESC = 200;

/**
 * 数表列操作和信息。
 * 
 * 操作数表列，可以使用 {@link useField}（单个列信息）、{@link useFields}（多个列信息）。
 */
export class Field {
  private fieldEntity: FieldCore;
  /**
   * @hidden
   */
  constructor(
    public datasheetId: string,
    private wCtx: IWidgetContext,
    public fieldData: IField
  ) {
    this.fieldEntity = FieldCore.bindContext(fieldData, wCtx.globalStore.getState());
  }

  /**
   * 是否有更新字段的权限
   */
  private checkPermissionUpdateField(): IPermissionResult {
    if (!this.fieldEntity.propertyEditable()) {
      return errMsg(`无 ${this.fieldData.name}(${this.id}) 列的写入权限`);
    }
    return { acceptable: true };
  }

  /**
   * 字段 id, 列的唯一标识
   * @returns
   *
   * #### 示例
   * ```js
   * console.log(myField.id);
   * // => 'fld1234567'
   * ```
   */
  get id(): string {
    return showField(this.type) ? this.fieldData.id : getNewId(IDPrefix.Field);
  }
  /**
   * 列名称, 不同列名称为不重复值
   * 
   * @returns
   *
   * #### 示例
   * ```js
   * console.log(myField.name);
   * // => 'Name'
   * ```
   */
  get name(): string {
    return showField(this.type) ? this.fieldData.name : getNoAcceptableFieldString(this.type, this.fieldData.name);
  }
  /**
   * 列类型，列类型为枚举值，具体可参阅 {@link FieldType}
   * 
   * @returns
   *
   * #### 示例
   * ```js
   * console.log(myField.type);
   * // => 'SingleLineText'
   * ```
   */
  get type(): FieldType {
    return getFieldTypeString(this.fieldData.type);
  }

  /**
   * 返回当前字段的描述
   *
   * @returns
   * 
   * #### 示例
   * ```js
   * console.log(myField.description);
   * // => 'This is my field'
   * ```
   */
  get description(): string | null {
    return this.fieldData.desc || null;
  }

  /**
   * 
   * 返回字段的属性配置，不同类型的字段有不同的属性配置。
   * 返回 null 则代表这个字段没有属性配置。
   * 具体可参阅 {@link FieldType}
   * 
   * @return {@link FieldType}
   *
   * #### 示例
   * ```js
   * import { FieldType } from '@vikadata/widget-sdk';
   *
   * if (myField.type === FieldType.Currency) {
   *     console.log(myField.options.symbol);
   *     // => '￥'
   * }
   * ```
   */
  get property(): any {
    return this.fieldEntity.openFieldProperty;
  }

  /**
   * 判断当前字段是否是“计算字段”
   * “计算字段”的意思是，不允许用户主动写入值的字段类型。（比如：自增数字、公式、神奇引用、修改时间、创建时间、修改人、创建人）
   *
   * @returns
   * 
   * #### 示例
   * ```js
   * console.log(mySingleLineTextField.isComputed);
   * // => false
   * console.log(myAutoNumberField.isComputed);
   * // => true
   * ```
   */
  get isComputed(): boolean {
    return this.fieldEntity.isComputed;
  }

  /**
   * TODO 为了兼容留下，后续删除 
   * @hidden
   * 返回当前字段是否属于主字段，在维格表中，主字段永远是第一列所在的字段。
   * @returns
   */
  get isPrimaryField(): boolean {
    return this.isPrimary;
  }

  /**
   * 返回当前字段是否属于主字段，在维格表中，主字段永远是第一列所在的字段。
   * @returns
   */
  get isPrimary(): boolean {
    const state = this.wCtx.globalStore.getState();
    const snapshot = Selectors.getSnapshot(state, this.datasheetId);
    return Boolean(snapshot?.meta.views[0].columns[0].fieldId === this.fieldData.id);
  }

  /**
   * 神奇表单是否必填
   */
  get required(): boolean | null {
    return this.fieldData.required || null;
  }

  /**
   * 获取当前视图特征属性，如该字段在某个视图中是否被隐藏
   * 
   * @param viewId 视图ID
   * @return
   * 
   * #### 示例
   * ``` js
   * const propertyInView = field.getPropertyInView('viwxxxxx');
   * console.log(propertyInView?.hidden)
   * ```
   */
  getPropertyInView(viewId: string): IPropertyInView | null {
    const state = this.wCtx.globalStore.getState();
    const snapshot = Selectors.getSnapshot(state, this.datasheetId);
    const view = snapshot && Selectors.getViewById(snapshot, viewId);
    const viewField = view?.columns.find(column => column.fieldId === this.id);
    if (!viewField) {
      return null;
    }
    return {
      hidden: viewField.hidden,
    };
  }

  /**
   * 更新字段的描述。
   *
   * 如果没有写入权限，该 API 会抛出异常信息。
   * 
   * @param description 字段描述
   * @returns
   * 
   * #### 示例
   * ```js
   *  field.updateDescription('this is a new description')
   * ```
   */
  updateDescription(description: string | null): Promise<void> {
    const desc = description || undefined;
    if (description && description.length > MAX_DESC) {
      throw new Error('Description exceeds the maximum length limit of 200');
    }
    return new Promise(async(resolve) => {
      const result: ICollaCommandExecuteResult<any> = await cmdExecute({
        cmd: CollaCommandName.SetFieldAttr,
        datasheetId: this.datasheetId,
        fieldId: this.fieldData.id,
        data: {
          ...this.fieldData,
          desc
        }
      }, this.wCtx.resourceService);
      if (result.result === ExecuteResult.Fail) {
        throw new Error(result.reason);
      }
      if (result.result === ExecuteResult.None) {
        throw new Error('update description method has been ignored');
      }
      resolve();
    });
  }

  /**
   * 
   * Beta API, 未来有可能变更。
   *
   * 更新字段的属性配置，注意，更新属性配置必须全量覆盖。
   *
   * 如果配置格式不正确，或者没有写入权限，该 API 会抛出异常信息。
   *
   * 请先阅读 {@link FieldType}【字段属性配置文档】来确定不同字段的写入格式。
   *
   * @param property 字段的新属性配置
   * @param options 允许会产生副作用的property
   * @returns
   *
   * #### 示例
   * ```js
   * function addOptionToSelectField(selectField, nameForNewOption) {
   *     const updatedOptions = {
   *         options: [
   *             ...selectField.options,
   *             {name: nameForNewOption},
   *         ]
   *     };
   *
   *     if (selectField.hasPermissionToUpdateOptions(updatedOptions)) {
   *         selectField.updateProperty(updatedOptions);
   *     }
   * }
   * ```
   */
  updateProperty(property: any, options?: IEffectOption): Promise<void> {
    const { error } = this.fieldEntity.validateUpdateOpenProperty(property, options);
    if (error) {
      throw new Error(JSON.stringify(error));
    }
    const updateProperty = this.fieldEntity.updateOpenFieldPropertyTransformProperty(property);
    let deleteBrotherField: boolean;
    // 神奇关联特殊字段，需要判断是否删除关联表的关联字段
    if (this.type === FieldType.MagicLink) {
      const { conversion } = property as IUpdateOpenMagicLinkFieldProperty;
      deleteBrotherField = conversion === Conversion.Delete;
    }
    return new Promise(async(resolve) => {
      const result: ICollaCommandExecuteResult<any> = await cmdExecute({
        cmd: CollaCommandName.SetFieldAttr,
        datasheetId: this.datasheetId,
        fieldId: this.fieldData.id,
        deleteBrotherField,
        data: {
          ...this.fieldData,
          property: updateProperty
        }
      }, this.wCtx.resourceService);
      if (result.result === ExecuteResult.Fail) {
        throw new Error(result.reason);
      }
      if (result.result === ExecuteResult.None) {
        throw new Error('update property method has been ignored');
      }
      resolve();
    });
  }

  /**
   * 
   * 检查是否有权限更新字段描述
   * 
   * @param description 字段描述 最长限制 200
   * @returns
   * 
   * #### 示例
   * ``` js
   * const canUpdateFieldDescription = field.hasPermissionForUpdateDescription();
   * if (!canUpdateFieldDescription) {
   *   alert('not allowed!');
   * }
   * ```
   */
  hasPermissionForUpdateDescription(description?: string): boolean {
    if (description && description.length > 200) {
      return false;
    }
    return this.checkPermissionUpdateField().acceptable;
  }

  /**
   * 
   * 检查是否有权限更新字段属性配置
   * 
   * property 有关更新写入格式，请参阅 {@link FieldType}
   * 
   * @param property  要检查的字段属性，如果不传则不检查格式
   * @returns
   * 
   * #### 示例
   * ``` js
   * const canUpdateFieldProperty = field.hasPermissionForUpdateProperty();
   * if (!canUpdateFieldProperty) {
   *   alert('not allowed!');
   * }
   * ```
   */
  hasPermissionForUpdateProperty(property?: any): boolean {
    return this.checkPermissionForUpdateProperty(property).acceptable;
  }

  /**
   * 校验用户是否有权限更新字段属性
   * 
   * @param property 要检查的字段属性，如果不传则不检查格式
   * @returns
   * 
   * 
   * #### 描述
   * 接受一个可选的 valuesMap  输入，valuesMap 是 key 为 fieldId, value 为单元格内容的 object
   *
   * property 有关更新写入格式，请参阅 {@link FieldType}
   *
   * 如果有权限操作则返回 `{acceptable: true}`
   *
   * 如果无权限操作则返回 `{acceptable: false, message: string}` ，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * // 校验用户是否有更新字段的权限，当更新的同时也有写入值的话，也可以一并进行校验
   * const updatePropertyCheckResult = field.checkPermissionForUpdateProperty({
   *   defaultValue: '1',
   * });
   * if (!updatePropertyCheckResult.acceptable) {
   *   alert(updatePropertyCheckResult.message);
   * }
   *
   * // 校验用户是否有更新字段的权限，但并不校验具体的值（示例：可以用来在 UI 控制创建按钮可用状态）
   * const updatePropertyCheckResult =
   *   field.checkPermissionForUpdateProperty();
   * ```
   */
  checkPermissionForUpdateProperty(property?: any): IPermissionResult {
    const updateFieldPermissionResult = this.checkPermissionUpdateField();
    if (!updateFieldPermissionResult.acceptable) {
      return updateFieldPermissionResult;
    }
    if (!this.fieldEntity.propertyEditable()) {
      return errMsg(`无 ${this.fieldData.name}(${this.id}) 列的写入权限`);
    }
    if(property) {
      const { error } = this.fieldEntity.validateUpdateOpenProperty(property);
      if (error) {
        return errMsg(`${this.fieldData.name}字段 当前写入值 ${JSON.stringify(property)} 不符合的格式，请检查：${error.message}`);
      }
    }
    return { acceptable: true };
  }

  /**
   * @hidden
   * 对于非 lookup 字段，entityType === type。
   */
  get entityType(): FieldType {
    if (this.type === FieldType.MagicLookUp) {
      const lookUpEntityField = (this.fieldEntity as LookUpField).getLookUpEntityField();
      if (!lookUpEntityField) return FieldType.NotSupport;
      return getFieldTypeString(lookUpEntityField.type);
    }
    return this.type;
  }

  /**
   * @hidden
   * 字段值的基础类型
   */
  get basicValueType(): BasicValueType {
    return this.fieldEntity.basicValueType;
  }

  /**
   * @hidden
   * 一些字段存在格式化，获取格式化类型
   */
  get formatType(): IFormatType {
    switch (this.type) {
      // 日期
      case FieldType.DateTime:
      case FieldType.CreatedTime:
      case FieldType.LastModifiedTime:
        const { dateFormat, timeFormat, includeTime } = this.fieldData.property as IDateTimeFieldProperty;
        return {
          type: 'datetime',
          formatting: { dateFormat, timeFormat, includeTime },
        };
      // 数字
      case FieldType.Number: {
        const { precision, commaStyle } = this.fieldData.property as INumberFieldProperty;
        return {
          type: 'number',
          formatting: { precision, commaStyle },
        };
      }
      case FieldType.Currency: 
        const { symbol, precision } = this.fieldData.property as ICurrencyFieldProperty;
        return {
          type: 'currency',
          formatting: { symbol, precision },
        };
      case FieldType.Percent:
        return {
          type: 'percent',
          formatting: { precision: (this.fieldData.property as ICurrencyFieldProperty).precision },
        };
      case FieldType.Formula:
      case FieldType.MagicLookUp:
        if (!(this.fieldData.property?.formatting)) return null;
        switch (this.fieldEntity.valueType) {
          case BasicValueType.Number:
            const { symbol, precision, formatType } = this.fieldData.property.formatting as INumberFormatFieldProperty;
            switch (formatType) {
              case CoreFieldType.Number:
                return {
                  type: 'number',
                  formatting: { precision },
                };
              case CoreFieldType.Percent:
                return {
                  type: 'percent',
                  formatting: { precision },
                };
              case CoreFieldType.Currency:
                return {
                  type: 'currency',
                  formatting: { symbol, precision },
                };
              default:
                return null;
            }
          case BasicValueType.DateTime:
            const { dateFormat, timeFormat, includeTime } = this.fieldData.property.formatting as IDateTimeFieldProperty;
            return {
              type: 'datetime',
              formatting: { dateFormat, timeFormat, includeTime },
            };
          default:
            return null;
        }
    }
    return null;
  }
  /**
   * @hidden
   * 将字符串类型的数据尝试转换为当兼容当前字段的数据类型。
   * 若果不兼容的话，则返回 null
   *
   * @param string The string to parse.
   * #### 示例
   * ```js
   * const inputString = '42';
   * const cellValue = myNumberField.convertStringToCellValue(inputString);
   * console.log(cellValue === 42);
   * // => true
   * ```
   */
  convertStringToCellValue(string: string): any {
    const stdValue = {
      sourceType: CoreFieldType.Text,
      data: [{ text: string }],
    };
    return this.fieldEntity.stdValueToCellValue(stdValue);
  }

  /**
   * @hidden
   */
  convertCellValueToString(cv: any): string | null {
    let _cv = cv;
    if (this.basicValueType === BasicValueType.Array) {
      _cv = _cv == null ? null : [cv].flat();
    }
    return this.fieldEntity.cellValueToString(_cv, { datasheetId: this.datasheetId });
  }

  /**
   * @hidden
   */
  getFieldResultByStatType(statType: StatType, records: Record[]) {
    const recordIds = records.map(record => record.id);
    const state = this.wCtx.globalStore.getState();
    const snapshot = Selectors.getSnapshot(state, this.datasheetId)!;
    return getFieldResultByStatType(statType, recordIds, this.fieldData, snapshot, state);
  }

  /**
   * @hidden
   */
  statType2text(type: StatType) {
    return this.fieldEntity.statType2text(type);
  }

  /**
   * @hidden
   */
  get statTypeList() {
    return this.fieldEntity.statTypeList;
  }
}
