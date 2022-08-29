import { FieldType, IInsertPosition, IPermissionResult, IWidgetContext, IWidgetDatasheetState } from 'interface';
import {
  CollaCommandName, ConfigConstant, ExecuteResult, Field as CoreField, ICollaCommandExecuteResult, ISetRecordOptions, Selectors,
  FieldType as CoreFieldType, IDPrefix, getNewId, getFieldClass, IField, Conversion,
  getFieldTypeByString
} from 'core';
import { cmdExecute } from 'iframe_message/utils';
import { getWidgetDatasheet } from 'store';
import { errMsg } from 'utils/private';

/**
 * 表格操作
 * 
 * 如果想操作表格，如获取表格数据、新增记录、删除记录等，推荐使用 {@link useDatasheet} 钩子函数
 * 
 * 如果需要获取记录数据，可以使用 {@link useRecord}（查询单条记录数据）、{@link useRecords}（批量查询记录数据）
 *
 * - {@link addRecord}: 新增记录
 *
 * - {@link addRecords}: 批量新增记录
 *
 * - {@link setRecord}: 修改记录的值
 *
 * - {@link setRecords}: 批量修改记录的值
 *
 * - {@link deleteRecord}: 删除记录
 *
 * - {@link deleteRecords}: 批量删除记录
 * 
 * - {@link addField}: 新增字段
 * 
 * - {@link deleteField}: 删除字段
 *
 * - {@link checkPermissionsForAddRecord}: 校验用户是否有权限新增记录
 *
 * - {@link checkPermissionsForAddRecords}: 校验用户是否有权限批量新增记录
 *
 * - {@link checkPermissionsForSetRecord}: 校验用户是否有有权限修改记录的值
 *
 * - {@link checkPermissionsForSetRecords}: 校验用户是否有有权限批量修改记录的值
 *
 * - {@link checkPermissionsForDeleteRecord}: 校验用户是否有权限删除记录
 *
 * - {@link checkPermissionsForDeleteRecords}: 校验用户是否有权限批量删除记录
 * 
 * - {@link checkPermissionsForAddField}: 校验用户是否有权限新增字段
 *
 * - {@link checkPermissionsForDeleteField}: 校验用户是否有权限删除字段
 *
 */
export class Datasheet {
  private datasheetData: IWidgetDatasheetState | null | undefined;

  /**
   * @inner
   * @hidden
   */
  constructor(
    public datasheetId: string,
    private wCtx: IWidgetContext,
  ) {
    this.datasheetData = wCtx.widgetStore?.getState().datasheetMap[this.datasheetId];
  }

  /**
   * 表格 id, 表格的唯一标识
   * @returns
   *
   * #### 示例
   * ```js
   * console.log(myDatasheet.id);
   * // => 'dstxxxxxxx'
   * ```
   */
  get id() {
    return this.datasheetData?.datasheet?.datasheetId;
  }

  /**
   * 表格名称
   * 
   * @returns
   *
   * #### 示例
   * ```js
   * console.log(myDatasheet.name);
   * // => 'Name'
   * ```
   */
  get name() {
    return this.datasheetData?.datasheet?.datasheetName; 
  }

  private checkRecordsValues(records: { [key: string]: any }[]) {
    const state = this.wCtx.globalStore.getState();
    const fieldDataMap = Selectors.getFieldMap(state, this.datasheetId)!;

    records.forEach(valuesMap => {
      Object.entries(valuesMap).forEach(([fieldId, cellValue]) => {
        const fieldData = fieldDataMap[fieldId];
        if (!fieldData) {
          throw new Error(`FieldId: ${fieldId} is not exist in datasheet`);
        }

        const coreField = CoreField.bindModel(fieldDataMap[fieldId], state);
        if (!coreField.recordEditable(this.datasheetId)) {
          throw new Error(`FieldId: ${fieldId} is not editable`);
        }

        if (coreField.validateCellValue(cellValue).error) {
          throw new Error(`CellValue: ${cellValue} is not validate for field ${fieldId}(${fieldData.name})`);
        }
      });
    });
  }

  private transformRecordValues(records: { [key: string]: any }[]): { [key: string]: any }[] {
    const state = this.wCtx.globalStore.getState();
    const fieldDataMap = Selectors.getFieldMap(state, this.datasheetId)!;
    return records.map(valuesMap => {
      const coreFieldMap: Record<string, any> = {};
      Object.entries(valuesMap).forEach(([fieldId, cellValue]) => {
        const coreField = CoreField.bindModel(fieldDataMap[fieldId], state);
        // 兼容一下 cellValue 为 undefined 情况
        coreFieldMap[fieldId] = cellValue === undefined ? null : coreField.openWriteValueToCellValue(cellValue);
      });
      return coreFieldMap;
    });
  }

  private checkRecordIdsExist(recordIds: (string | undefined)[]): IPermissionResult {
    const state = this.wCtx.globalStore.getState();
    const datasheetId = this.datasheetId;
    for (const recordId of recordIds) {
      // 未传入 recordId 则不进行存在性校验
      if (!recordId) {
        return { acceptable: true };
      }
      const record = Selectors.getRecord(state, recordId, datasheetId);
      if (!record) {
        return { acceptable: false, message: `record:${recordId} 不存在` };
      }
    }
    return { acceptable: true };
  }

  private checkBasicPermissions(): IPermissionResult {
    const state = this.wCtx.widgetStore.getState();
    const datasheetId = this.datasheetId;
    const datasheet = getWidgetDatasheet(state, datasheetId);
    const sourceId = state.widget?.snapshot.sourceId;
    const globalState = this.wCtx.globalStore.getState();
    const permissions = Selectors.getPermissions(globalState, datasheetId, undefined, sourceId?.startsWith('mir') ? sourceId : '');

    if (!datasheet || !permissions) {
      return { acceptable: false, message: '维格表数据加载失败' };
    }

    if (!permissions.editable) {
      return { acceptable: false, message: '维格表权限为只读，无法进行写入操作' };
    }

    return { acceptable: true };
  }

  private checkPermissionsForRecordsValues(records: ({ [key: string]: any } | undefined)[]): IPermissionResult {
    const state = this.wCtx.globalStore.getState();
    const datasheetId = this.datasheetId;
    const basicPermissionsCheckResult = this.checkBasicPermissions();
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }

    for (const valuesMap of records) {
      // 不传 valuesMap 则不进行值校验
      if (!valuesMap) {
        continue;
      }

      for (const [fieldId, value] of Object.entries(valuesMap)) {
        const fieldPermissionMap = Selectors.getFieldPermissionMap(state, datasheetId);
        const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
        const field = Selectors.getField(state, fieldId, datasheetId);
        if (!field) {
          return errMsg(`当前操作的fieldId: ${fieldId} 不存在`);
        }

        if (fieldRole === ConfigConstant.Role.None || fieldRole === ConfigConstant.Role.Reader) {
          return errMsg(`无 ${field.name}(${fieldId}) 列的写入权限`);
        }

        const fieldEntity = CoreField.bindContext(field, state);

        if (fieldEntity.isComputed) {
          return errMsg(`${field.name}(${fieldId}) 字段的内容为计算自动生成，无法写入`);
        }
        // 兼容一下 undefined
        const checkError = fieldEntity.validateOpenWriteValue(!value ? null : value).error;
        if (checkError) {
          return errMsg(`${field.name}字段 当前写入值 ${value} 不符合 ${checkError.message} 的格式，请检查`);
        }
      }
    }

    return {
      acceptable: true,
    };
  }

  private checkFieldName(name?: string): IPermissionResult {
    if (typeof name !== 'string'){
      return errMsg('Field name must be a string');
    }
    const state = this.wCtx.globalStore.getState();
    const fieldDataMap = Selectors.getFieldMap(state, this.datasheetId)!;
    const hasTheSameName = Object.keys(fieldDataMap).some(fieldId => {
      const item = fieldDataMap[fieldId];
      return item.name === name;
    });
    if (hasTheSameName) {
      return errMsg(`${name} is already exist, Please enter a unique field name`);
    }
    return { acceptable: true };
  }

  private checkPrimaryField(fieldId: string) {
    const state = this.wCtx.globalStore.getState();
    const snapshot = Selectors.getSnapshot(state, this.datasheetId);
    return Boolean(snapshot?.meta.views[0].columns[0].fieldId === fieldId);
  }

  /**
   * 新增记录
   *
   * @param valuesMap key 为 fieldId, value 为单元格内容的 object
   *
   * @param insertPosition 要在视图中插入的位置
   *
   * @returns 返回新增的记录 ID
   *
   * #### 描述
   * 新增一条记录，并可选的指定它在视图中的位置（默认在最后）, 返回新增的记录 ID 数组
   *
   * 当用户无权限进行操作或者单元格值格式校验不通过时，将会抛出错误
   *
   * 有关单元格值写入格式，请参阅 {@link FieldType}
   *
   * #### 示例
   * ```js
   * async function addNewRecord(valuesMap) {
   *   if (datasheet.checkPermissionsForAddRecord(valuesMap).acceptable) {
   *     const newRecordId = await datasheet.addRecord(valuesMap);
   *     alert(`新创建的记录 ID 为： ${newRecordId}`);
   *
   *     // 接下来可以对新创建的 records 进行选择，或者操作了
   *     // ...
   *   }
   * }
   *
   * // 参数的 key 为 fieldId， value 为单元格值
   * addNewRecord({
   *   fld1234567980: 'this is a text value',
   *   fld0987654321: 1024,
   * });
   *
   * // 不同类型的字段单元格值有特定的数据结构，需要进行正确的传入
   * addNewRecord({
   *   fld1234567890: 'this is a text value', // SingleLineText 单行文本
   *   fld0987654321: 1024, // Number 数字
   *   fld1234567891: '选项 1', // SingleSelect 单选
   *   fld1234567892: ['选项 1', '选项 2'], // MultiSelect 多选
   *   fld1234567893:  1635513510962, // DateTime 日期 （时间戳）
   *   fld1234567894: ['rec1234567'], // MagicLink 神奇关联 （recordId)
   * });
   * ```
   */
  async addRecord(valuesMap: { [key: string]: any } = {}, insertPosition?: IInsertPosition) {
    return (await this.addRecords([{ valuesMap }], insertPosition))[0];
  }

  /**
   * 批量新增记录
   * 
   * @param records key 为 fieldId, value 为单元格内容的 object
   * 
   * @param insertPosition 要在视图中插入的位置
   *
   * @returns 返回新增的记录 ID 数组
   *
   * #### 描述
   * 新增多条记录，并可选的指定它在视图中的位置（默认在最后插入）
   *
   * 当用户无权限进行操作或者单元格值格式校验不通过时，将会抛出错误
   *
   * 有关单元格值写入格式，请参阅 {@link FieldType}
   *
   * #### 示例
   * ```js
   * const records = [
   *   // valuesMap 的 key 为 fieldId value 为单元格内容
   *   {
   *     valuesMap: {
   *       fld1234567890: 'this is a text value',
   *       fld0987654321: 1024,
   *     },
   *   },
   *   // valuesMap 指定为空对象时，将会创建一条空记录
   *   {
   *     valuesMap: {},
   *   },
   *   // 不同类型的字段单元格值有特定的数据结构，需要进行正确的传入
   *   {
   *     valuesMap: {
   *       fld1234567890: 'Cat video 2', // SingleLineText 单行文本
   *       fld0987654321: 1024, // Number 数字
   *       fld1234567891: '选项 1', // SingleSelect 单选
   *       fld1234567892: ['选项 1', '选项 2'], // MultiSelect 多选
   *       fld1234567893:  1635513510962, // DateTime 日期 （时间戳）
   *       fld1234567894: ['rec1234567'], // MagicLink 神奇关联 （recordId)
   *     },
   *   },
   * ];
   *
   * async function addNewRecords() {
   *   if (datasheet.checkPermissionToAddRecords(records)) {
   *     const recordIds = await datasheet.addRecords(records);
   *
   *     alert(`新创建的记录 IDs: ${recordIds}`);
   *
   *     // 接下来可以对新创建的 records 进行选择，或者操作了
   *     // ...
   *   }
   * }
   * ```
   */
  addRecords(records: { valuesMap: { [key: string]: any } }[] = [], insertPosition?: IInsertPosition): Promise<string[]> {
    const state = this.wCtx.globalStore.getState();
    const recordsValues: { [key: string]: any }[] = [];
    for (const record of records) {
      recordsValues.push(record.valuesMap);
    }
    const transformedRecords = this.transformRecordValues(recordsValues);
    this.checkRecordsValues(transformedRecords);

    // 默认位置：
    let view = Selectors.getCurrentView(state, this.datasheetId)!;
    let viewId = view.id;
    let index = view.rows.length;

    // 指定位置：
    if (insertPosition) {
      // 遍历 rows 找到实际插入位置，同 common/components/menu 表格右键 UI 操作
      // TODO: 这种方式在以后需要被优化
      index = view.rows.findIndex(row => row.recordId === insertPosition.anchorRecordId) ;
      if (index === -1) {
        throw new Error(`Anchor RecordId: ${insertPosition.anchorRecordId} is not exist in datasheet`);
      }
      viewId = insertPosition.viewId;
      const snapshot = Selectors.getSnapshot(state, this.datasheetId)!;
      view = Selectors.getViewById(snapshot, viewId)!;
    }

    if (index < 0) {
      throw new Error('Insert index should not less than 0');
    }

    if (index > view.rows.length) {
      throw new Error('Insert index should not greater than all row count in view');
    }

    return new Promise(async(resolve) => {
      const result: ICollaCommandExecuteResult<any> = await cmdExecute({
        cmd: CollaCommandName.AddRecords,
        datasheetId: this.datasheetId,
        viewId,
        count: transformedRecords.length,
        index,
        cellValues: transformedRecords,
      }, this.wCtx.resourceService);
      if (result.result === ExecuteResult.Fail) {
        throw new Error(result.reason);
      }
  
      if (result.result === ExecuteResult.None) {
        throw new Error('Add record method has been ignored');
      }
      resolve(result.data as string[]);
    });
  }

  /**
   * 修改记录的值
   *
   * @param recordId 指定要修改的 record
   *
   * @param valuesMap key 为 fieldId, value 为单元格内容的 object，只需要传入要修改 value，无需修改的key value 则不需要传入。要清空一个 field，需要传入 key: null
   * @return 
   *
   * #### 描述
   * 当无权限，或者 recordId 不存在，或者写入的值类型不匹配的时候，会抛出对应的错误
   *
   * 我们将一个 record 中的一个 field 称作单元格。有关单元格值写入格式，请参阅 {@link FieldType}
   *
   *
   * 如果你需要同时修改多个记录，请使用 {@link setRecords}
   *
   * #### 示例
   * ```js
   * function setRecord(recordId, valuesMap) {
   *   if (datasheet.checkPermissionsForSetRecord(recordId, valuesMap).acceptable) {
   *     datasheet.setRecord(recordId, valuesMap);
   *   }
   * }
   * ```
   */
  setRecord(recordId: string, valuesMap: { [key: string]: any } = {}) {
    return this.setRecords([{ id: recordId, valuesMap }]);
  }

  /**
   * 批量修改记录的值
   * @param records 指定要修改的 records
   * @return
   *
   * #### 描述
   * 当无权限，或者 recordId 不存在，或者写入的值类型不匹配的时候，会抛出对应的错误
   *
   * valuesMap key 为 fieldId, value 为单元格内容的 object，只需要传入要修改 value，无需修改的key value 则不需要传入。要清空一个 field，需要传入 key: null
   *
   * 我们将一个 record 中的一个 field 称作单元格。有关单元格值写入格式，请参阅 {@link FieldType}
   *
   *
   * 如果你只需要修改单个记录，请使用 {@link setRecord}
   *
   * #### 示例
   * ```js
   * function setRecord(id, valuesMap) {
   *   if (datasheet.checkPermissionsForSetRecords([{ id, valuesMap }]).acceptable) {
   *     datasheet.setRecords([{ id, valuesMap }]);
   *   }
   * }
   * ```
   */
  async setRecords(records: { id: string, valuesMap: { [key: string]: any } }[]) {
    const recordIds: string[] = [];
    const recordsValues: { [key: string]: any }[] = [];
    for (const record of records) {
      recordIds.push(record.id);
      recordsValues.push(record.valuesMap);
    }
    const state = this.wCtx.globalStore.getState();
    const transformedRecordsValues = this.transformRecordValues(recordsValues);
    this.checkRecordsValues(transformedRecordsValues);

    const data = records.reduce<ISetRecordOptions[]>((pre, record) => {
      const recordId = record.id;
      const recordData = Selectors.getRecord(state, recordId, this.datasheetId);
      if (!recordData) {
        throw new Error(`RecordId: ${recordId} is not exist in datasheet`);
      }

      this.transformRecordValues([record.valuesMap]).forEach(valueMap => {
        Object.entries(valueMap).forEach(([fieldId, cellValue])=> {
          pre.push({
            recordId,
            fieldId,
            value: cellValue,
          });
        });
      });
      return pre;
    }, []);

    const result: ICollaCommandExecuteResult<any> = await cmdExecute({
      cmd: CollaCommandName.SetRecords,
      datasheetId: this.datasheetId,
      data,
    }, this.wCtx.resourceService);
    if (result.result === ExecuteResult.Fail) {
      throw new Error(result.reason);
    }
  }

  /**
   * 删除记录
   *
   * @param recordId 记录 Id
   * @returns
   *
   * #### 描述
   * 通过 recordId 删除一条记录
   *
   * 当用户无权限进行操作时，将会抛出错误
   *
   * #### 示例
   * ```js
   * async function deleteRecord(recordId) {
   *   if (datasheet.checkPermissionsForDeleteRecord(recordId).acceptable) {
   *     await datasheet.deleteRecord(recordId);
   *     alert('记录已被删除');
   *
   *     // 记录此时已经被删除
   *   }
   * }
   * ```
   */
  deleteRecord(recordId: string) {
    return this.deleteRecords([recordId]);
  }

  /**
   * 批量删除记录
   *
   * @param recordIds 记录 Id 数组
   * @returns
   * 
   *
   * #### 描述
   * 通过 recordIds 数组批量删除记录
   *
   * 当用户无权限进行操作时，将会抛出错误
   *
   * #### 示例
   * ```js
   * async function deleteRecords(recordIds) {
   *   if (datasheet.checkPermissionsForDeleteRecords(recordIds).acceptable) {
   *     await datasheet.deleteRecords(recordIds);
   *     alert('记录已被批量删除');
   *
   *     // 记录此时已经被删除
   *   }
   * }
   * ```
   */
  async deleteRecords(recordIds: string[]) {
    const result: ICollaCommandExecuteResult<any> = await cmdExecute({
      cmd: CollaCommandName.DeleteRecords,
      datasheetId: this.datasheetId,
      data: recordIds,
    }, this.wCtx.resourceService);
    if (result.result === ExecuteResult.Fail) {
      throw new Error(result.reason);
    }
  }

  /**
   * 新增字段
   *
   * @param name 字段名称
   * @param type 字段类型
   * @param property 字段属性
   * @returns
   * 
   *
   * #### 描述
   *
   * 有关新增字段属性值写入格式，请参阅 {@link FieldType}
   * 
   * 当用户无权限进行操作时，将会抛出错误
   *
   * #### 示例
   * ```js
   * function addField(name, type, property) {
   *   if (datasheet.checkPermissionsForAddField(name, type, property).acceptable) {
   *     datasheet.addField(recordIds);
   *   }
   * }
   * ```
   */
  async addField(name: string, type: FieldType, property: any): Promise<string> {
    const state = this.wCtx.globalStore.getState();
    const view = Selectors.getCurrentView(state, this.datasheetId)!;
    const index = view.columns.length;
    const fieldType = getFieldTypeByString(type as any)!;
    const fieldInfoForState = {
      id: getNewId(IDPrefix.Field),
      name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const field = CoreField.bindContext(fieldInfoForState, this.wCtx.globalStore.getState());
    const result: ICollaCommandExecuteResult<any> = await cmdExecute({
      cmd: CollaCommandName.AddFields,
      data: [{
        data: {
          name,
          type: fieldType,
          property: field.addOpenFieldPropertyTransformProperty(property),
        },
        index,
      }],
    }, this.wCtx.resourceService);
    if (result.result === ExecuteResult.Fail) {
      throw new Error(result.reason);
    }
    if (result.result === ExecuteResult.None) {
      throw new Error('Add field method has been ignored');
    }
    return result.data;
  }

  /**
   * 删除字段
   *
   * @param fieldId 字段ID
   * @param conversion 删除字段为关联字段的时候，标记关联表的关联字段是删除还是转换成文本，默认为 转成文本字段
   * @returns
   * 
   *
   * #### 描述
   *
   * 当用户无权限进行操作时，将会抛出错误
   *
   * #### 示例
   * ```js
   * function deleteField(fieldId) {
   *   if (datasheet.checkPermissionsForDeleteField(fieldId).acceptable) {
   *     datasheet.deleteField(fieldId);
   *   }
   * }
   * ```
   */
  async deleteField(fieldId: string, conversion?: Conversion): Promise<void> {
    // 检查一下主列，现在是允许删除主列的，删除之后表就崩溃了
    if (this.checkPrimaryField(fieldId!)) {
      throw new Error(`${fieldId} is Primary field, cannot be deleted`);
    }
    const result: ICollaCommandExecuteResult<any> = await cmdExecute({
      cmd: CollaCommandName.DeleteField,
      data: [{
        deleteBrotherField: conversion === Conversion.Delete,
        fieldId,
      }],
    }, this.wCtx.resourceService);
    if (result.result === ExecuteResult.Fail) {
      throw new Error(result.reason);
    }
    if (result.result === ExecuteResult.None) {
      throw new Error('Delete field method has been ignored');
    }
    return result.data;
  }

  /**
   * 校验用户是否有权限新增记录
   * 
   * @param valuesMap key 为 fieldId, value 为单元格内容的 object
   * @returns
   * 
   * 
   * #### 描述
   * 接受一个可选的 valuesMap  输入，valuesMap 是 key 为 fieldId, value 为单元格内容的 object
   *
   * valuesMap 的格式和写入单元格时的格式相同。有关单元格值写入格式，请参阅 {@link FieldType}
   *
   * 如果有权限操作则返回 `{acceptable: true}`
   *
   * 如果无权限操作则返回 `{acceptable: false, message: string}` ，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * // 校验用户是否有权限新增一条记录，当新增的同时也有写入值的话，也可以一并进行校验
   * const setRecordCheckResult = datasheet.checkPermissionsForAddRecord({
   *   'fld1234567890': 'Advertising campaign',
   *   'fld0987654321': 1024,
   * });
   * if (!setRecordCheckResult.acceptable) {
   *   alert(setRecordCheckResult.message);
   * }
   *
   * // 校验用户是否有新增记录的权限，但并不校验具体的值（示例：可以用来在 UI 控制创建按钮可用状态）
   * const addUnknownRecordCheckResult =
   *   datasheet.checkPermissionsForAddRecord();
   * ```
   */
  checkPermissionsForAddRecord(valuesMap?: { [key: string]: any }): IPermissionResult {
    return this.checkPermissionsForRecordsValues(valuesMap ? [valuesMap] : []);
  }

  /**
   * 校验用户是否有权限批量新增记录
   * 
   * @param records 接收一个可选的 records 数组
   * @returns
   * 
   * 
   * #### 描述
   * records 是 key 为 fieldId, value 为单元格内容的 object
   *
   * records 的格式和写入单元格时的格式相同。有关单元格值写入格式，请参阅 {@link FieldType}
   *
   * 如果有权限操作则返回 `{acceptable: true}`
   *
   * 如果无权限操作则返回 `{acceptable: false, message: string}` ，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * // 校验用户是否有权限新增记录，当新增的同时也有写入值的话，也可以一并进行校验
   * const addRecordsCheckResult = datasheet.checkPermissionsForAddRecords([
   *   {
   *     valuesMap: {
   *       fld1234567890: 'this is a text value',
   *       fld0987654321: 1024,
   *     },
   *   },
   *   {
   *     valuesMap: {
   *       fld1234567890: 'this is another text value',
   *       fld0987654321: 256,
   *     },
   *   },
   *   {},
   * ]);
   * if (!addRecordsCheckResult.acceptable) {
   *   alert(addRecordsCheckResult.message);
   * }
   * // 校验用户是否有新增记录的权限，但并不校验具体的值（示例：可以用来在 UI 控制新增按钮可用状态）
   * // 与 checkPermissionsForSetRecord 一致
   * const addUnknownRecordCheckResult =
   *   datasheet.checkPermissionsForAddRecords();
   * ```
   */
  checkPermissionsForAddRecords(records?: { valuesMap: { [key: string]: any } }[]): IPermissionResult {
    const recordsValues: ({ [key: string]: any } | undefined)[] = [];
    for (const record of (records || [])) {
      recordsValues.push(record.valuesMap);
    }
    return this.checkPermissionsForRecordsValues(recordsValues || []);
  }

  /**
   * 校验用户是否有有权限修改记录的值
   * 
   * @param recordId 要修改的 recordId
   *
   * @param valuesMap 是 key 为 fieldId, value 为单元格内容的 object
   *
   * @returns {@link IPermissionResult}
   *
   * #### 描述
   * recordId 是要修改的 recordId, valuesMap 是 key 为 fieldId, value 为单元格内容的 object
   *
   * 该方法会根据传入值的详细程度来进行**权限**以及**值合法性**校验。传入 valuesMap 会进行单元格写入合法性、列权限校验，传入 recordId 会进行记录存在性，和修改权限校验
   *
   * valuesMap 的格式和写入单元格时的格式相同。有关单元格值写入格式，请参阅 {@link FieldType}
   *
   * 如果有权限操作则返回 `{acceptable: true}`
   *
   * 如果无权限操作则返回 `{acceptable: false, message: string}` ，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * // 校验用户是否有权限修改一个具体的 record 中的两个具体的字段
   * const setRecordCheckResult =
   *   datasheet.checkPermissionsForSetRecord('rec1234567', {
   *     'fld1234567890': 'this is a text value',
   *     'fld0987654321': 1024,
   *   });
   * if (!setRecordCheckResult.acceptable) {
   *   alert(setRecordCheckResult.message);
   * }
   *
   * // 校验用户是否有权限修改一个记录，但不校验具体值是否能修改
   * const setUnknownFieldsCheckResult =
   *   datasheet.checkPermissionsForSetRecord('rec1234567');
   *
   * // 校验用户是否有权限修改对应字段，不关心具体的记录
   * const setUnknownRecordCheckResult =
   *   datasheet.checkPermissionsForSetRecord(undefined, {
   *     'fld1234567890': 'this is a text value',
   * 		// 你也可以选择不传入具体值，使用 undefined 代替，这将不进行值类型校验
   *     'fld0987654321': undefined,
   *   });
   * // 不传入任何值，也可以校验用户是否有权限修改记录，但不校验任何具体的记录和字段（也就是说即使返 acceptable 为 true，也可能有部分字段或者记录无权限修改，你可以用这个方式来显示是否小程序处于只读状态）
   * const setUnknownRecordAndFieldsCheckResult =
   *   datasheet.checkPermissionsForSetRecord();
   * ```
   */
  checkPermissionsForSetRecord(recordId?: string, valuesMap?: { [key: string]: any }): IPermissionResult {
    return this.checkPermissionsForSetRecords([{ id: recordId, valuesMap }]);
  }

  /**
   * 校验用户是否有有权限批量修改记录的值
   * 
   * @param records 要修改的 records
   *
   * @returns {@link IPermissionResult}
   *
   * #### 描述
   * 接收一个可选的 records 数组
   *
   * recordId 是要修改的 recordId, valuesMap 是 key 为 fieldId, value 为单元格内容的 object
   *
   * 该方法会根据传入值的详细程度来进行权限、值合法性校验。传入 valuesMap 会进行单元格写入合法性、列权限校验，传入 recordId 会进行记录存在性，和修改权限校验
   *
   * valuesMap 的格式和写入单元格时的格式相同。有关单元格值写入格式，请参阅 {@link FieldType}
   *
   * 如果有权限操作则返回 {acceptable: true}
   *
   * 如果无权限操作则返回 {acceptable: false, message: string}，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * const recordsToSet = [
   *   {
   *     // 指定要修改的记录的 ID
   *     id: record1.id,
   *     valuesMap: {
   *       // 将要写入的数据
   *       fld1234567890: 'this is a text value',
   *       fld0987654321: 1024,
   *     },
   *   },
   *   {
   *     id: record2.id,
   *     valuesMap: {
   *       // 只传了一个 fieldId 则只修改这条记录的这个单元格，其他的单元格不进行修改
   *       fld1234567890: 'another text value',
   *     },
   *   },
   *   {
   *     // 不传 valuesMap 表示只校验一下有没有权限可以修改这条记录，还不知道要进行哪些值的修改
   *     id: record3.id,
   *   },
   *   {
   *     // 校验一下是否有权限修改某些字段的值，但是还不确定要修改哪个记录
   *     valuesMap: {
   *       fld1234567890: 'another text value',
   *       // 如果需要校验某个字段是否有权限修改，但还不知道修改的值是什么，可以传入 undefined
   *       fld0987654321: undefined,
   *     },
   *   },
   * ];
   *
   * const checkResult = datasheet.checkPermissionsForSetRecords(recordsToSet);
   * if (!checkResult.acceptable) {
   *   console.log(checkResult.message);
   * }
   *
   * // 不传入任何值，也可以校验用户是否有权限修改记录，但不校验任何具体的记录和字段（也就是说即使返 acceptable 为 true，也可能有部分字段或者记录无权限修改，你可以用这个方式来显示是否小程序处于只读状态）
   * // 与 datasheet.checkPermissionsForSetRecord() 相等
   * const setUnknownRecordAndFieldsCheckResult =
   *   datasheet.checkPermissionsForSetRecords();
   * ```
   *
   */
  checkPermissionsForSetRecords(records: { id?: string, valuesMap?: { [key: string]: any } }[]): IPermissionResult {
    const recordIds: (string | undefined)[] = [];
    const recordsValues: ({ [key: string]: any } | undefined)[] = [];
    for (const record of records) {
      recordIds.push(record.id);
      recordsValues.push(record.valuesMap);
    }
    // records 校验存在性
    const recordIdsExist = this.checkRecordIdsExist(recordIds);
    if (!recordIdsExist.acceptable) {
      return recordIdsExist;
    }
    return this.checkPermissionsForRecordsValues(recordsValues);
  }

  /**
   * 校验用户是否有权限删除记录
   *
   * @param recordId 要删除的记录 ID
   * @returns
   * 
   *
   * #### 描述
   * 接受一个可选的 recordId 参数
   *
   * 如果有权限操作则返回 `{acceptable: true}`
   *
   * 如果无权限操作则返回 `{acceptable: false, message: string}` ，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * // 校验用户是否有权限删除一个给定的记录
   * const deleteRecordCheckResult =
   *   datasheet.checkPermissionsForDeleteRecord(recordId);
   * if (!deleteRecordCheckResult.acceptable) {
   *   alert(deleteRecordCheckResult.message);
   * }
   *
   * // 校验用户是否删除记录的权限，但并不校验具体的记录（示例：可以用来在 UI 控制删除选择器的可用状态）
   * const deleteUnknownRecordCheckResult =
   *   datasheet.checkPermissionsForDeleteRecord();
   * ```
   */
  checkPermissionsForDeleteRecord(recordId?: string): IPermissionResult {
    const basicPermissionsCheckResult = this.checkBasicPermissions();
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }

    if (!recordId) {
      return basicPermissionsCheckResult;
    }

    return this.checkPermissionsForDeleteRecords([recordId]);
  }

  /**
   * 校验用户是否有权限批量删除记录
   * 
   * @param recordIds 要删除的记录 ID 数组
   * @returns
   * 
   * 
   * #### 描述
   * 接受一个可选的 recordIds 参数
   *
   * 如果有权限操作则返回 `{acceptable: true}`
   *
   * 如果无权限操作则返回 `{acceptable: false, message: string}` ，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * // 校验用户是否有权限删除一个给定的记录
   * const deleteRecordsCheckResult =
   *   datasheet.checkPermissionsForDeleteRecords([recordId1. recordId2]);
   * if (!deleteRecordsCheckResult.acceptable) {
   *   alert(deleteRecordsCheckResult.message);
   * }
   *
   * // 校验用户是否删除记录的权限，但并不校验具体的记录（示例：可以用来在 UI 控制删除选择器的可用状态）
   * // 与 checkPermissionsForDeleteRecord 一致
   * const deleteUnknownRecordsCheckResult =
   *   datasheet.checkPermissionsForDeleteRecords();
   * ```
   */
  checkPermissionsForDeleteRecords(recordIds?: string[]): IPermissionResult {
    const basicPermissionsCheckResult = this.checkBasicPermissions();
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }

    if (!recordIds) {
      return basicPermissionsCheckResult;
    }

    return this.checkRecordIdsExist(recordIds);
  }
  
  /**
   * 校验用户是否有权限新增字段
   *
   * @param name 字段名称
   * @param type 字段类型
   * @param property 字段属性
   * @returns
   * 
   *
   * #### 描述
   *
   * 新增字段插入到最后，有关新增字段属性值写入格式，请参阅 {@link FieldType}
   * 
   * 如果有权限操作则返回 `{acceptable: true}`
   *
   * 如果无权限操作则返回 `{acceptable: false, message: string}` ，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * // 校验用户是否有权限新增一个字段
   * const addFieldCheckResult =
   *   datasheet.checkPermissionsForAddField(recordId);
   * if (!addFieldCheckResult.acceptable) {
   *   alert(addFieldCheckResult.message);
   * }
   *
   * // 校验用户是否有增字段的权限，但并不校验具体的字段参数（示例：可以用来在 UI 控制删除选择器的可用状态）
   * const addUnknownFieldCheckResult =
   *   datasheet.checkPermissionsForAddField();
   * ```
   */
  checkPermissionsForAddField(name?: string | undefined, type?: FieldType, property?: any): IPermissionResult {
    const basicPermissionsCheckResult = this.checkBasicPermissions();
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }

    const checkFieldName = this.checkFieldName(name);
    if (!checkFieldName.acceptable) {
      return checkFieldName;
    }

    let fieldType: CoreFieldType | undefined = undefined;
    if (type) {
      fieldType = getFieldTypeByString(type as any);
      if (!fieldType) {
        return errMsg('未知字段类型');
      }
    }
    
    if (fieldType && property != null) {
      const fieldInfoForState = {
        id: getNewId(IDPrefix.Field),
        // 新增字段，不再默认填充一个字段名称
        name,
        type: fieldType,
        property: getFieldClass(fieldType).defaultProperty(),
      } as IField;
      const field = CoreField.bindContext(fieldInfoForState, this.wCtx.globalStore.getState());
      const { error } = field.validateAddOpenFieldProperty(property || null);
      if (error) {
        return errMsg(`当前 property ${JSON.stringify(property)} 不符合格式，请检查： ${error.message}`);
      }
    }
    return { acceptable: true };
  }

  /**
   * 校验用户是否有权限删除
   * 
   * @param fieldId 字段ID
   * @returns
   * 
   *
   * #### 描述
   *
   * 如果有权限操作则返回 `{acceptable: true}`
   *
   * 如果无权限操作则返回 `{acceptable: false, message: string}` ，message 为显示给用户的失败原因解释
   *
   * #### 示例
   * ```js
   * // 校验用户是否有权限删除一个字段
   * const deleteFieldCheckResult =
   *   datasheet.checkPermissionsForDeleteField(fieldId);
   * if (!deleteFieldCheckResult.acceptable) {
   *   alert(deleteFieldCheckResult.message);
   * }
   *
   * // 校验用户是否有删除字段的权限，但并不校验具体的字段权限（示例：可以用来在 UI 控制删除选择器的可用状态）
   * const deleteUnknownFieldCheckResult =
   *   datasheet.checkPermissionsForDeleteField();
   * ```
   */
  checkPermissionsForDeleteField(fieldId?: string | undefined) {
    const basicPermissionsCheckResult = this.checkBasicPermissions();
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }
    if (!fieldId) {
      return basicPermissionsCheckResult;
    }

    const state = this.wCtx.globalStore.getState();
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state, this.datasheetId);
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
    const field = Selectors.getField(state, fieldId, this.datasheetId);

    if (!field) {
      return errMsg(`当前删除的fieldId: ${fieldId} 不存在`);
    }

    if (this.checkPrimaryField(fieldId!)) {
      return errMsg(`${field.name}(${fieldId}) is Primary field, cannot be deleted`);
    }

    if (fieldRole === ConfigConstant.Role.None || fieldRole === ConfigConstant.Role.Reader) {
      return errMsg(`无 ${field.name}(${fieldId}) 列的写入权限`);
    }

    return { acceptable: true };
  }
}
