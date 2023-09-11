/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { JSONSchema7 } from 'json-schema';
import { cloneDeep } from 'lodash';
import { /* useEffect,  */ useState } from 'react';
import { isOperandNullValue, removeArrayOperandItemByIndex, isOperand } from '@apitable/core';
import { IFieldProps, IRegistry } from '../../../interface';
import {
  allowAdditionalItems,
  getDefaultFormState,
  getDefaultRegistry,
  getUiOptions,
  getWidget,
  isFilesArray,
  isFixedItems,
  isMultiSelect,
  optionsList,
  retrieveSchema,
  toIdSchema,
} from '../../../utils';
import { DefaultFixedArrayFieldTemplate } from './DefaultFixedArrayFieldTemplate';
import { DefaultNormalArrayFieldTemplate } from './DefaultNormalArrayFieldTemplate';
import { EmptyArrayOperand, generateKeyedFormData, generateRowId, keyedToPlainFormData } from './helper';
// import { DefaultArrayItem } from './DefaultArrayItem';

const ArrayField = (props: IFieldProps) => {
  // console.log('ArrayField.props.formData', props.formData);
  const [state, setState] = useState({
    // Here it turns out that the operation of generating a unique key for each item of the array is done.
    // It was supposed to optimize the rendering. For now, it is removed.
    keyedFormData: generateKeyedFormData(
      isOperandNullValue(props.formData, props.schema) ? JSON.parse(JSON.stringify(EmptyArrayOperand)) : props.formData,
    ), //generateKeyedFormData(props.formData),
    updatedKeyedFormData: false,
  });
  // React.useEffect(() => {
  //   const _state = {
  //     keyedFormData: generateKeyedFormData(isOperandNullValue(props.formData, props.schema)
  //       ? JSON.parse(JSON.stringify(EmptyArrayOperand))
  //       : props.formData),
  //     updatedKeyedFormData: false,
  //   };
  //   setState(_state);
  // }, [props.formData, props.schema]);

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // Don't call getDerivedStateFromProps if keyed formdata was just updated.
  //   if (prevState.updatedKeyedFormData) {
  //     return {
  //       updatedKeyedFormData: false,
  //     };
  //   }
  //   const nextFormData = nextProps.formData || [];
  //   const previousKeyedFormData = prevState.keyedFormData || [];
  //   const newKeyedFormData =
  //     nextFormData.length === previousKeyedFormData.length
  //       ? previousKeyedFormData.map((previousKeyedFormDatum, index) => {
  //         return {
  //           key: previousKeyedFormDatum.key,
  //           item: nextFormData[index],
  //         };
  //       })
  //       : generateKeyedFormData(nextFormData);
  //   return {
  //     keyedFormData: newKeyedFormData,
  //   };
  // }

  // const getItemTitle = () => {
  //   const schema = props.schema as JSONSchema7;
  //   const items = schema?.items as JSONSchema7;
  //   return items.title || items.description || "Item";
  // }

  const isItemRequired = (itemSchema: { type: string | string[] }) => {
    if (Array.isArray(itemSchema.type)) {
      // While we don't yet support composite/nullable jsonschema types, it's
      // future-proof to check for requirement against these.
      return !itemSchema.type.includes('null');
    }
    // All non-null array item types are inherently required by design
    return itemSchema.type !== 'null';
  };

  const canAddItem = (formItems: string | any[]) => {
    const { schema, uiSchema } = props;
    let { addable } = getUiOptions(uiSchema)!;
    if (addable !== false) {
      // if ui:options.addable was not explicitly set to false, we can add
      // another item if we have not exceeded maxItems yet
      if (schema.maxItems !== undefined) {
        addable = formItems.length < schema.maxItems;
      } else {
        addable = true;
      }
    }
    return addable;
  };

  const _getNewFormDataRow = () => {
    const { schema, registry = getDefaultRegistry() } = props;
    const { rootSchema } = registry;
    let itemSchema = schema.items;
    if (isFixedItems(schema) && allowAdditionalItems(schema)) {
      itemSchema = schema.additionalItems;
    }
    return getDefaultFormState(itemSchema, undefined, rootSchema);
  };

  const onAddClick = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
    }

    const { onChange } = props;
    // const newKeyedFormDataRow = {
    //   key: generateRowId(),
    //   item: _getNewFormDataRow(),
    // };
    const newKeyedFormData = {
      type: 'Expression',
      value: {
        operator: 'newArray',
        operands: [
          ...state.keyedFormData.value.operands,
          {
            key: generateRowId(),
          },
        ],
      },
    };
    setState({
      keyedFormData: newKeyedFormData,
      updatedKeyedFormData: true,
    });
    // const newOperands = newKeyedFormData.value.operands.map((v, i, arr) => (i === arr.length - 1 ? {} : v));
    // FIXME
    // onChange({
    //   ...newKeyedFormData,
    //   value: {
    //     ...newKeyedFormData.value,
    //     operands: newOperands
    //   }
    // }); // keyedToPlainFormData(newKeyedFormData)
    onChange(keyedToPlainFormData(newKeyedFormData));
  };

  const onAddIndexClick = (index: number) => {
    return (event: { preventDefault: () => void }) => {
      if (event) {
        event.preventDefault();
      }
      const { onChange } = props;
      const newKeyedFormDataRow = {
        key: generateRowId(),
        item: _getNewFormDataRow(),
      };
      const newKeyedFormData = [...state.keyedFormData];
      newKeyedFormData.splice(index, 0, newKeyedFormDataRow);

      setState({
        keyedFormData: newKeyedFormData,
        updatedKeyedFormData: true,
      });
      onChange(keyedToPlainFormData(newKeyedFormData));
    };
  };

  const onDropIndexClick = (index: number) => {
    return (event: { preventDefault: () => void }) => {
      if (event) {
        event.preventDefault();
      }
      const { onChange } = props;
      const { keyedFormData } = state;
      // refs #195: revalidate to ensure properly reindexing errors
      let newErrorSchema;
      if (props.errorSchema) {
        newErrorSchema = {};
        const errorSchema = props.errorSchema;
        for (const i in errorSchema) {
          const iNumber = parseInt(i);
          if (iNumber < index) {
            newErrorSchema[iNumber] = errorSchema[iNumber];
          } else if (iNumber > index) {
            newErrorSchema[iNumber - 1] = errorSchema[iNumber];
          }
        }
      }
      const newKeyedFormData = removeArrayOperandItemByIndex(keyedFormData, index);
      // console.log('onDropIndexClick', keyedFormData, newKeyedFormData);
      // const newKeyedFormData = keyedFormData.filter((_, i) => i !== index);
      setState({
        keyedFormData: newKeyedFormData,
        updatedKeyedFormData: true,
      });
      onChange(keyedToPlainFormData(newKeyedFormData), newErrorSchema);
      // onChange(newKeyedFormData, newErrorSchema);
    };
  };

  const onReorderClick = (index: string, newIndex: string) => {
    return (event: { preventDefault: () => void; target: { blur: () => void } }) => {
      if (event) {
        event.preventDefault();
        event.target.blur();
      }
      const { onChange } = props;
      let newErrorSchema;
      if (props.errorSchema) {
        newErrorSchema = {};
        const errorSchema = props.errorSchema;
        for (const i in errorSchema) {
          if (i == index) {
            newErrorSchema[newIndex] = errorSchema[index];
          } else if (i == newIndex) {
            newErrorSchema[index] = errorSchema[newIndex];
          } else {
            newErrorSchema[i] = errorSchema[i];
          }
        }
      }

      const { keyedFormData } = state;

      function reOrderArray() {
        // Copy item
        const _newKeyedFormData = keyedFormData.slice();

        // Moves item from index to newIndex
        _newKeyedFormData.splice(index, 1);
        _newKeyedFormData.splice(newIndex, 0, keyedFormData[index]);

        return _newKeyedFormData;
      }

      const newKeyedFormData = reOrderArray();
      setState({
        keyedFormData: newKeyedFormData,
        updatedKeyedFormData: state.updatedKeyedFormData,
      });
      onChange(keyedToPlainFormData(newKeyedFormData), newErrorSchema);
    };
  };

  const onChangeForIndex = (index: string | number) => {
    return (value: any, errorSchema: any) => {
      const { formData, onChange } = props;
      // console.log(formData);
      const emptyArray = {
        type: 'Expression',
        value: {
          operator: 'newArray',
          operands: [],
        },
      };
      const transArray = isOperand(formData) ? formData : emptyArray;
      const jsonValue = typeof value === 'undefined' ? null : value;
      transArray.value.operands[index] = jsonValue;
      // const newFormData = formData.map((item, i) => {
      //   // We need to treat undefined items as nulls to have validation.
      //   // See https://github.com/tdegrunt/jsonschema/issues/206
      //   const ;
      //   return index === i ? jsonValue : item;
      // });
      // console.log('ArrayField.onChangeForIndex', formData, transArray, jsonValue);
      setState((data) => {
        const oldData = data.keyedFormData.value.operands[index];
        // freeze object is read only, need clone a new variable to edit.
        const _data = cloneDeep(data);
        _data.keyedFormData.value.operands[index] = { ...oldData, ...jsonValue };
        return _data;
      });

      onChange(
        transArray,
        errorSchema &&
          props.errorSchema && {
          ...props.errorSchema,
          [index]: errorSchema,
        },
      );
    };
  };

  const onSelectChange = (value: any) => {
    props.onChange(value);
  };

  const renderNormalArray = () => {
    const {
      schema,
      uiSchema,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      autofocus,
      registry = getDefaultRegistry(),
      onBlur,
      onFocus,
      idPrefix,
      rawErrors,
    } = props;
    const title = schema.title === undefined ? name : schema.title;
    const { ArrayFieldTemplate, rootSchema, fields, formContext } = registry as IRegistry;
    const { TitleField, DescriptionField } = fields;
    const itemsSchema = retrieveSchema(schema.items as any, rootSchema);
    // const formData = keyedToPlainFormData(state.keyedFormData);
    const formData = state.keyedFormData;
    const arrayProps = {
      canAdd: true, //canAddItem(formData),
      items: state.keyedFormData.value.operands.map((keyedItem: any, index: number) => {
        // const { key, item } = keyedItem;
        const itemSchema = retrieveSchema(schema.items as any, rootSchema, keyedItem);
        const item = keyedItem;
        const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;
        const itemIdPrefix = idSchema.$id + '_' + index;
        const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, rootSchema, item, idPrefix);
        return renderArrayFieldItem({
          rawErrors, // FIXME: ???
          key: item.key,
          index,
          canMoveUp: index > 0,
          canMoveDown: index < state.keyedFormData.value.operands.length - 1,
          itemSchema: itemSchema,
          itemIdSchema,
          itemErrorSchema,
          itemData: item,
          itemUiSchema: uiSchema.items,
          autofocus: autofocus && index === 0,
          onBlur,
          onFocus,
        });
      }),
      className: `field field-array field-array-of-${itemsSchema.type}`,
      DescriptionField,
      disabled,
      idSchema,
      uiSchema,
      onAddClick: onAddClick,
      readonly,
      required,
      schema,
      title,
      TitleField,
      formContext,
      formData,
      rawErrors,
      registry,
    };

    // Check if a custom render function was passed in
    const Component = uiSchema['ui:ArrayFieldTemplate'] || ArrayFieldTemplate || DefaultNormalArrayFieldTemplate;
    return <Component {...arrayProps} />;
  };

  const renderMultiSelect = () => {
    const {
      schema,
      idSchema,
      uiSchema,
      formData,
      disabled,
      readonly,
      required,
      placeholder,
      autofocus,
      onBlur,
      onFocus,
      registry = getDefaultRegistry(),
      rawErrors,
      name,
    } = props;
    const items = props.formData;
    const { widgets, rootSchema, formContext } = registry;
    const itemsSchema = retrieveSchema(schema.items as any, rootSchema, formData);
    const title = schema.title || name;
    const enumOptions = optionsList(itemsSchema);
    const { widget = 'select', ...options } = {
      ...getUiOptions(uiSchema),
      enumOptions,
    };
    const Widget = getWidget(schema, widget, widgets as any);
    return (
      <Widget
        uiSchema={uiSchema}
        id={idSchema && (idSchema.$id as string)}
        multiple
        onChange={onSelectChange}
        onBlur={onBlur}
        onFocus={onFocus}
        options={options as any}
        schema={schema}
        registry={registry as any}
        value={items}
        disabled={disabled}
        readonly={readonly}
        required={required}
        label={title}
        placeholder={placeholder || ''}
        formContext={formContext}
        autofocus={autofocus}
        rawErrors={rawErrors}
      />
    );
  };

  const renderFiles = () => {
    const { schema, uiSchema, idSchema, name, disabled, readonly, autofocus, onBlur, onFocus, registry = getDefaultRegistry(), rawErrors } = props;
    const title = schema.title || name;
    const items = props.formData;
    const { widgets, formContext } = registry;
    const { widget = 'files', ...options } = getUiOptions(uiSchema)!;
    const Widget = getWidget(schema, widget as any, widgets as any) as any;
    return (
      <Widget
        options={options}
        id={idSchema && idSchema.$id}
        multiple
        onChange={onSelectChange}
        onBlur={onBlur}
        onFocus={onFocus}
        schema={schema}
        title={title}
        value={items}
        disabled={disabled}
        readonly={readonly}
        formContext={formContext}
        autofocus={autofocus}
        rawErrors={rawErrors}
      />
    );
  };

  const renderFixedArray = () => {
    const {
      schema,
      uiSchema,
      formData,
      errorSchema,
      idPrefix,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      autofocus,
      registry = getDefaultRegistry(),
      onBlur,
      onFocus,
      rawErrors,
    } = props;
    const title = schema.title || name;
    let items = props.formData;
    const { ArrayFieldTemplate, rootSchema, fields, formContext } = registry as IRegistry;
    const { TitleField } = fields;
    const itemSchemas = (schema.items as any).map((item: JSONSchema7, index: number) => retrieveSchema(item, rootSchema, formData[index]));
    const additionalSchema = allowAdditionalItems(schema) ? retrieveSchema(schema.additionalItems as any, rootSchema, formData) : null;

    if (!items || items.length < itemSchemas.length) {
      // to make sure at least all fixed items are generated
      items = items || [];
      items = items.concat(new Array(itemSchemas.length - items.length));
    }

    // These are the props passed into the render function
    const arrayProps = {
      canAdd: canAddItem(items) && additionalSchema,
      className: 'field field-array field-array-fixed-items',
      disabled,
      idSchema,
      formData,
      items: state.keyedFormData.map((keyedItem: { key: any; item: any }, index: number) => {
        const { key, item } = keyedItem;
        const additional = index >= itemSchemas.length;
        const itemSchema = additional ? retrieveSchema(schema.additionalItems as any, rootSchema, item) : itemSchemas[index];
        const itemIdPrefix = idSchema.$id + '_' + index;
        const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, rootSchema, item, idPrefix);
        const itemUiSchema = additional
          ? uiSchema.additionalItems || {}
          : Array.isArray(uiSchema.items)
            ? uiSchema.items[index]
            : uiSchema.items || {};
        const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;

        return renderArrayFieldItem({
          rawErrors,
          key,
          index,
          canRemove: additional,
          canMoveUp: index >= itemSchemas.length + 1,
          canMoveDown: additional && index < items.length - 1,
          itemSchema,
          itemData: item,
          itemUiSchema,
          itemIdSchema,
          itemErrorSchema,
          autofocus: autofocus && index === 0,
          onBlur,
          onFocus,
        });
      }),
      onAddClick: onAddClick,
      readonly,
      required,
      schema,
      uiSchema,
      title,
      TitleField,
      formContext,
      rawErrors,
    };

    // Check if a custom template template was passed in
    const Template = uiSchema['ui:ArrayFieldTemplate'] || ArrayFieldTemplate || DefaultFixedArrayFieldTemplate;
    return <Template {...arrayProps} />;
  };

  const renderArrayFieldItem = ({
    key,
    index,
    canRemove = true,
    canMoveUp = true,
    canMoveDown = true,
    itemSchema,
    itemData,
    itemUiSchema,
    itemIdSchema,
    itemErrorSchema,
    autofocus,
    onBlur,
    onFocus,
    rawErrors,
  }: any) => {
    // console.log('ArrayField.renderArrayFieldItem.formData', itemData);
    const { disabled, readonly, uiSchema, registry = getDefaultRegistry() } = props;
    const SchemaField = registry.fields.SchemaField as any;
    const { orderable, removable } = {
      orderable: true,
      removable: true,
      ...uiSchema['ui:options'],
    };
    const has: any = {
      moveUp: orderable && canMoveUp,
      moveDown: orderable && canMoveDown,
      remove: removable && canRemove,
    };
    has.toolbar = Object.keys(has).some((key) => has[key]);

    return {
      children: (
        <SchemaField
          index={index}
          schema={itemSchema}
          uiSchema={itemUiSchema}
          formData={itemData}
          errorSchema={itemErrorSchema}
          idSchema={itemIdSchema}
          required={isItemRequired(itemSchema)}
          onChange={onChangeForIndex(index)}
          onBlur={onBlur}
          onFocus={onFocus}
          registry={props.registry}
          disabled={props.disabled}
          readonly={props.readonly}
          autofocus={autofocus}
          rawErrors={rawErrors}
        />
      ),
      className: 'array-item',
      disabled,
      hasToolbar: has.toolbar,
      hasMoveUp: has.moveUp,
      hasMoveDown: has.moveDown,
      hasRemove: has.remove,
      index,
      key,
      onAddIndexClick: onAddIndexClick,
      onDropIndexClick: onDropIndexClick,
      onReorderClick: onReorderClick,
      readonly,
    };
  };
  const { schema, uiSchema, idSchema, registry = getDefaultRegistry() } = props;
  const { rootSchema } = registry;
  if (!schema.hasOwnProperty('items')) {
    const { fields } = registry;
    const UnsupportedField = fields.UnsupportedField as any;
    return <UnsupportedField schema={schema} idSchema={idSchema} reason="Missing items definition" />;
  }
  if (isFixedItems(schema)) {
    return renderFixedArray();
  }
  if (isFilesArray(schema, uiSchema, rootSchema)) {
    return renderFiles();
  }
  if (isMultiSelect(schema, rootSchema)) {
    return renderMultiSelect();
  }
  return renderNormalArray();
};

export default ArrayField;
