import { IField, IOpenFieldProperty, IEffectOption } from 'core';
import { IWidgetContext, FieldType } from 'interface';
import { Field as ModelField } from '../model';

/**
 * Field operations and information collections for datasheet
 */
export class Field {
  private modelField: ModelField;

  /**
   * @hidden
   */
  constructor(
    private datasheetId: string,
    private wCtx: IWidgetContext,
    private fieldData: IField
  ) {
    this.modelField = new ModelField(this.datasheetId, this.wCtx, this.fieldData);
  }

  /**
   * Field id, unique identification of the field
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myField.id); // => 'fldxxxxxx'
   * ```
   */
  public get id(): string {
    return this.modelField.id;
  }
  /**
   * Field name, different field names are called non-repeating values
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myField.name); // => 'FieldName'
   * ```
   */
  public get name(): string {
    return this.modelField.name;
  }

  /**
   * Field types, which are enumerated values, can be found in {@link FieldType}
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myField.type); // => 'SingleLineText'
   * ```
   */
  public get type(): FieldType {
    return this.modelField.type;
  }

  /**
   * Returns the description of the field
   *
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myField.description);
   * // => 'This is my field'
   * ```
   */
  public get description(): string | null {
    return this.modelField.description;
  }

  /**
   * 
   * Returns the property of the field, which is different for different types of fields
   * Returns null means that the field has no properties configured
   * Refer to {@link FieldType}
   * 
   * @return {@link FieldType}
   *
   * #### Example
   * ```js
   * console.log(myField.property.symbol); // => '￥'
   * ```
   */
  public get property(): IOpenFieldProperty | null {
    return this.modelField.property;
  }

  /**
   * Determine if the current field is a "computed field"
   * "Computed fields" means the types of fields that do not allow the user to actively write values. 
   * (e.g., auto number, formula, link, modification time, creation time, modifier, creator)
   *
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(mySingleLineTextField.isComputed);
   * // => false
   * console.log(myAutoNumberField.isComputed);
   * // => true
   * ```
   */
  public get isComputed(): boolean {
    return this.modelField.isComputed;
  }

  /**
   * Returns whether the current field belongs to the primary field, which in datasheet is always the field where the first field is located.
   * 
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myField.isPrimary); // => true
   * ```
   */
  public get isPrimary(): boolean {
    return this.modelField.isPrimary;
  }

  /**
   * Update the description of the field.
   *
   * Throws an error if the user does not have permission to update the field, or if an invalid description is provided.
   * 
   * @param description new description for the field
   * @returns
   * 
   * #### Example
   * ```js
   *  await field.updateDescriptionAsync('this is a new description')
   * ```
   */
  public async updateDescriptionAsync(description: string | null): Promise<void> {
    return await this.modelField.updateDescription(description);
  }

  /**
   *
   * Updates the property for this field,
   * tips: that the update property configuration must be overwritten in full.
   *
   * Throws an error if the user does not have permission to update the field, 
   * if invalid property are provided, if this field has no writable property, or if updates to this field type is not supported.
   *
   * Refer to {@link FieldType} for supported field types, the write format for property, and other specifics for certain field types.
   *
   * @param property new property for the field.
   * @param options optional options to affect the behavior of the update.
   * @returns
   *
   * #### Example
   * ```js
   * function addOptionToSelectField(selectField, nameForNewOption) {
   *   const updatedOptions = {
   *     options: [
   *       ...selectField.options.choices,
   *       {name: nameForNewOption},
   *     ]
   *   };
   *
   *   await selectField.updatePropertyAsync(updatedOptions);
   * }
   * ```
   */
  public async updatePropertyAsync(property: any, options?: IEffectOption): Promise<void> {
    return await this.modelField.updateProperty(property, options);
  }
}
