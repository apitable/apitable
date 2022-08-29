import Joi from 'joi';
import { isEqual } from 'lodash';
import { IReduxState, Selectors } from 'store';
import { IAPIMetaFieldProperty } from 'types/field_api_property_types';
import { IAPIMetaField } from 'types/field_api_types';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { BasicValueType, FieldType, IField, IFieldProperty, IStandardValue } from 'types/field_types';
import { BasicOpenValueType } from 'types/field_types_open';
import { IAddOpenFieldProperty, IEffectOption, IUpdateOpenFieldProperty } from 'types/open/open_field_write_types';
import { IJsonSchema } from 'types/utils';
import { FOperator, FOperatorDescMap, IFilterCondition } from 'types/view_types';
import { getFieldTypeString, IBindFieldContext, IBindFieldModel } from '../index';
import { ICellToStringOption, ICellValue } from '../record';
import { StatTranslate, StatType } from './stat';
import { joiErrorResult } from './validate_schema';

// 中文敏感字符串比较的 collators 构造函数。
const zhIntlCollator = typeof Intl !== 'undefined' ? new Intl.Collator('zh-CN') : undefined;

/**
 * 业务类不要变成复杂的容器，最好只是数据流的管道
 * 这里我们使用类的形式去构建业务计算方法，但是使用的时候并不直接进行 new 去初始化，而是只将需要处理的数据绑定到实例上，并且用完即走。
 * 假设我们要调用 cellValueToString
 *
 * 示例：
 * const field: ITextField = // 假设这里有一个文本列的列属性数据;
 * const value = Field.bindContext(field, state).cellValueToString();
 *
 * 可以看到，每次使用 Field 类上面的方法时候，只需要 bindContext 进行数据绑定，然后调用计算方法拿到想要的返回值，
 * 不需要持有一个具体的 Field 的实例。这在我们结合 redux 不可变数据一起使用的时候就非常有用。
 * 因为不可变数据都是通过 reducer 去管理的，随时有可能更新，而在我们的方法类就不能去持有数据，
 * 而是每次使用都从最新的 state 里面获得最新的数据参与计算。
 */
export abstract class Field {
  // static bindModel: IBindFieldModel;
  static bindContext: IBindFieldContext;

  static bindModel: IBindFieldModel;

  constructor(public field: IField, public state: IReduxState) { }

  /**
   * Field Meta API 返回的字段 Property。与内部使用的接口不同，API 暴露的是转化后的结果。
   * - 更加友好的信息，数字枚举转字符串。
   * - 剔除不必要暴露的字段信息
   */
  abstract get apiMetaProperty(): IAPIMetaFieldProperty | null;

  /**
   * 每个字段都有自己的 openValue，用于在小组件 SDK 、机器人变量中和后续的开放场景中使用。
   * 这个是开放给开发者的，会对 cellValue 做一些处理。这个方法描述字段 openValue 的结构。目前用在机器人变量中。
   */
  abstract get openValueJsonSchema(): IJsonSchema;

  /**
   * cellValue 转换为外部调用的中使用的值（事件中会包含原始值和转换值，主要暴露给外部开发者使用，automation、widget-sdk）
   * @param cellValue 
   */
  abstract cellValueToOpenValue(cellValue: ICellValue): BasicOpenValueType | null;

  /**
   * openWriteValue 转换为 cellValue（主要暴露给外部开发者使用，automation、widget-sdk 写入数据）
   * @param openWriteValue 
   */
  abstract openWriteValueToCellValue(openWriteValue: any): ICellValue;

  /**
   * API 返回的字段 meta 信息。
   * @param dstId 
   * @returns 
   */
  getApiMeta(dstId?: string): IAPIMetaField {
    const views = Selectors.getViewsList(this.state, dstId);
    const firstFieldId = views[0].columns[0].fieldId;

    const res: IAPIMetaField = {
      id: this.field.id,
      name: this.field.name,
      type: getFieldTypeString(this.field.type),
      property: this.apiMetaProperty || undefined,
      editable: this.recordEditable(),
    };
    if (this.field.id === firstFieldId) {
      res.isPrimary = true;
    }
    if (this.field.desc) {
      res.desc = this.field.desc;
    }
    return res;
  }

  // 不包含 Array 的基础值类型。
  get valueType(): Omit<BasicValueType, BasicValueType.Array> {
    if (this.basicValueType === BasicValueType.Array) {
      return this.innerBasicValueType;
    }
    return this.basicValueType;
  }

  // 默认 String，Array 类型字段重载
  get innerBasicValueType(): BasicValueType {
    return BasicValueType.String;
  }

  showFOperatorDesc(type: FOperator) {
    return FOperatorDescMap[type];
  }

  /**
   * 该字段是否支持分组
   */
  get canGroup(): boolean {
    return true;
  }

  /**
   * 计算字段是否错误
   */
  get hasError(): boolean {
    return false;
  }

  /**
   * 计算字段异常信息
   */
  get warnText(): string {
    return '';
  }

  /**
   * 当前字段统计栏可选项
   */
  get statTypeList(): StatType[] {
    return [
      StatType.None,
      StatType.CountAll,
      StatType.Empty,
      StatType.Filled,
      StatType.Unique,
      StatType.PercentEmpty,
      StatType.PercentFilled,
      StatType.PercentUnique,
    ];
  }

  /**
   * 当前字段的单元格值的基础类型。
   */
  abstract get basicValueType(): BasicValueType;

  /**
   * 当前 fieldType 所支持的 operator 类型，以及在下拉框中的展示顺序
   * 每个继承的 field 都要实现
   */
  abstract get acceptFilterOperators(): FOperator[];

  /**
   * 每个单元格的值都是通过 snapshot 里面的 field record 关系计算出来的。
   * 但是这里的计算指是 LookUp、RollUp、Formula 等字段，其单元格值的计算依赖其它基础单元格的值。
   * 此类字段称之为 「计算字段」, 需要覆盖此方法。
   * @readonly
   * @memberof Field
   */
  get isComputed() {
    return false;
  }

  /**
   * 判断 filter 是属于哪个 FieldType
   *
   * @template T
   * @param {T} t
   * @param {IFilterCondition<FieldType>} v
   * @returns {v is Extract<IFilterCondition<T>, IFilterCondition<FieldType>>}
   * @memberof Field
   */
  static isFilterBelongFieldType<T extends FieldType>(
    t: T,
    v: IFilterCondition<FieldType>,
  ): v is Extract<IFilterCondition<T>, IFilterCondition<FieldType>> {
    return v.fieldType === t;
  }

  isEmptyOrNot(operator: FOperator.IsEmpty | FOperator.IsNotEmpty, cellValue: ICellValue) {
    switch (operator) {
      /**
       * isEmpty 和 isNotEmpty 的逻辑基本通用
       */
      case FOperator.IsEmpty: {
        return cellValue == null;
      }

      case FOperator.IsNotEmpty: {
        return cellValue != null;
      }

      default: {
        throw new Error('compare operator type error');
      }
    }
  }

  /**
   * 当前字段是否可以编辑
   * 并不是所有的字段都允许用户编辑，如果是计算字段，比如 rollUp, lookup, formula 这类字段，天然不允许用户进行编辑
   * 另外关联字段，只有用户在拥有当前关联字段关联的表的编辑权限时，才允许编辑。
   */
  recordEditable(datasheetId?: string, mirrorId?: string): boolean {
    return Selectors.getPermissions(this.state, datasheetId, this.field.id, mirrorId).cellEditable;
  }

  /**
   * 当前字段的属性是否允许编辑
   * 这里是根据权限因素来判断，允许编辑字段则为 true。
   */
  propertyEditable(): boolean {
    return Selectors.getPermissions(this.state, undefined, this.field.id).fieldPropertyEditable;
  }

  /**
   * 比较两个 cv 是否相等.
   * 默认使用深比较比较，cv 复杂的需要重载此方法。
   * TODO: 将 eq 的逻辑和 compare 的逻辑合并，删除 eq
   */
  eq(cv1: ICellValue, cv2: ICellValue): boolean {
    return isEqual(cv1, cv2);
  }

  /**
   * 在该 field 上比较两个 cellValue 的大小，用于排序
   * 默认是转为字符串比较，如果不是此逻辑，请自行实现
   * @orderInCellValueSensitive {boolean}
   *  在分组的时候，单元格中的顺序不敏感，要分到一组
   *  在排序的时候，单元格顺序是敏感的，要与顺序有关
   *  测试的时候可以看多选、成员、关联都保持相同的逻辑
   * @returns {number} 负数 => 小于、0 => 等于、正数 => 大于
   */
  compare(cellValue1: ICellValue, cellValue2: ICellValue, orderInCellValueSensitive?: boolean): number {
    if (this.eq(cellValue1, cellValue2)) {
      return 0;
    }
    if (cellValue1 == null) {
      return -1;
    }
    if (cellValue2 == null) {
      return 1;
    }

    let str1 = this.cellValueToString(cellValue1, { orderInCellValueSensitive });
    let str2 = this.cellValueToString(cellValue2, { orderInCellValueSensitive });

    if (str1 === str2) {
      return 0;
    }
    if (str1 == null) {
      return -1;
    }
    if (str2 == null) {
      return 1;
    }

    str1 = str1.trim();
    str2 = str2.trim();

    // 测试中文拼音排序
    return str1 === str2 ? 0 :
      zhIntlCollator ? zhIntlCollator.compare(str1, str2) : (str1.localeCompare(str2, 'zh-CN') > 0 ? 1 : -1);
  }

  /**
   * 除了判断是否为空之外的 operator 计算函数，其他函数需要各自继承实现
   * 当没有继承的时候，默认都返回 true，表示不进行过滤
   */
  isMeetFilter(operator: FOperator, cellValue: ICellValue, _: IFilterCondition['value']) {
    switch (operator) {
      case FOperator.IsEmpty:
      case FOperator.IsNotEmpty: {
        return this.isEmptyOrNot(operator, cellValue);
      }
      default: {
        console.warn('Method should be overwrite!');
        return true;
      }
    }
  }

  protected stringInclude(str: string, searchStr: string) {
    return str.toLowerCase().includes(searchStr.trim().toLowerCase());
  }

  abstract cellValueToString(cellValue: ICellValue, cellToStringOption?: ICellToStringOption): string | null;

  // 用于复制粘贴/类型转换 获得新record 之前，根据 record 中的
  // 数据填充Field 中的property, 比如 single/multi 中的选项
  enrichProperty(stdVals: IStandardValue[]): IFieldProperty {
    return this.field.property;
  }

  abstract cellValueToStdValue(cellValue: ICellValue | null): IStandardValue;

  /**
   * 转换为api的标准输出
   * @param cellValue
   */
  abstract cellValueToApiStandardValue(cellValue: ICellValue): any;

  /**
   * 转换为用户在表格看见的输出
   * @param cellValue
   */
  abstract cellValueToApiStringValue(cellValue: ICellValue): string | null;

  abstract stdValueToCellValue(stdValue: IStandardValue): ICellValue | null;

  abstract validate(value: any): boolean;

  /*校验 property 的值 */
  abstract validateProperty(): Joi.ValidationResult;

  /**
   * 每种列类型都会对应一种数据格式，通过检查数据格式，判定写入单元格的数据是否符合预期
   * @returns {Joi.ValidationResult}
   */
  abstract validateCellValue(cellValue: ICellValue): Joi.ValidationResult;

  /**
   * 每种列类型都会对应一种数据格式，通过检查数据格式，判定写入单元格的数据是否符合预期
   * @returns {Joi.ValidationResult}
   */
  abstract validateOpenWriteValue(openWriteValue: any): Joi.ValidationResult;

  /**
   * 是否多选值类型的字段。
   * 如多选，协作者字段，就是返回 true。
   * NOTE: 需要保证返回 true 的字段，value 是数组。
   */
  isMultiValueField(): boolean {
    return false;
  }

  abstract defaultValueForCondition(
    condition: IFilterCondition,
  ): ICellValue;

  /**
   * 返回新增 record 时字段属性配置的默认值
   */
  defaultValue(): ICellValue {
    return null;
  }

  /**
   * @description 将统计的参数转换成中文
   */
  statType2text(type: StatType): string {
    const result = StatTranslate[type];
    return result;
  }

  /**
   * 获取property （小程序、机器人、api）
   */
  get openFieldProperty(): IOpenFieldProperty {
    return null;
  }
  
  /**
   * 校验更新字段 property
   * @returns {Joi.ValidationResult}
   */
  validateUpdateOpenProperty(updateProperty: IUpdateOpenFieldProperty, effectOption?: IEffectOption): Joi.ValidationResult {
    return joiErrorResult(`${getFieldTypeString(this.field.type)} not support set property`);
  }

  /**
   * 对外返回字段信息
   * @param dstId 
   */
  getOpenField(dstId?: string): IOpenField {
    const views = Selectors.getViewsList(this.state, dstId);
    const firstFieldId = views[0].columns[0].fieldId;
    const { id, name, desc: description, type, required } = this.field;
    const res: IOpenField = {
      id,
      name,
      description,
      type: getFieldTypeString(type),
      property: this.openFieldProperty,
      editable: this.recordEditable(),
      required
    };
    if (this.field.id === firstFieldId) {
      res.isPrimary = true;
    }
    return res;
  }

  /**
   * 校验创建字段时的 property
   */
  validateAddOpenFieldProperty(addProperty: IAddOpenFieldProperty): Joi.ValidationResult {
    return this.validateUpdateOpenProperty(addProperty);
  }

  /**
   * 校验删除字段参数是否合格
   * @param deleteFieldSchema 删除字段参数
   */
  validateOpenDeleteField(deleteFieldSchema: any): Joi.ValidationResult {
    return Joi.object({
      id: Joi.string().required(),
      conversion: Joi.boolean(),
    }).required().validate(deleteFieldSchema);
  }

  /**
   * 暂时所有字段创建和更新都一样，除了关联字段更新的时候多了个conversion，所以就直接用更新时候的转换了
   * 
   * 新增字段，对传入的property进行转换成可以用cmd发送的结构
   * 注意：这一步不会对传入的参数进行校验，默认通过了校验
   * @param openFieldProperty 
   */
  addOpenFieldPropertyTransformProperty(addOpenFieldProperty: IAddOpenFieldProperty): IFieldProperty {
    return this.updateOpenFieldPropertyTransformProperty(addOpenFieldProperty);
  }

  /**
   * 更新字段属性，对传入的property进行转换成可以用cmd发送的结构
   * 注意：这一步不会对传入的参数进行校验，默认通过了校验
   * @param openFieldProperty 
   */
  updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenFieldProperty): IFieldProperty {
    return openFieldProperty;
  }
}

export abstract class ArrayValueField extends Field {
  // 谁组值的字段需要制定数组里值得类型
  static _acceptFilterOperators = [
    FOperator.Is,
    FOperator.IsNot,
    FOperator.Contains,
    FOperator.DoesNotContain,
    FOperator.IsEmpty,
    FOperator.IsNotEmpty,
    FOperator.IsRepeat,
  ];

  get acceptFilterOperators() {
    return ArrayValueField._acceptFilterOperators;
  }

  // 将原 cellValue 数组里的自定义类型值转成基础类型，不允许有自定义数据结构
  abstract cellValueToArray(cellValue: any): (number | string | boolean)[] | null;

  // 不同与 cellValueToString, 这里是将 cellValueToArray 返回基础类型的值转成字符串。
  // 大部分 arrayValueToString 的 field 直接 join 就好了，number dataTime 的有 format 需要先进行 format。
  abstract arrayValueToString(cellValues: any[] | null): string | null;
}
