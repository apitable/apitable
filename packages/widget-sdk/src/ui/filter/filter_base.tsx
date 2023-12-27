import { Box, Button, IconButton, Typography, useTheme, DropdownSelect as Select } from '@apitable/components';
import {
  ConfigConstant,
  EmptyNullOperand,
  Field,
  FieldType,
  IExpression,
  IExpressionOperand,
  OperandTypeEnums,
  OperatorEnums,
  Strings,
  t,
} from '@apitable/core';
import { AddOutlined, DeleteOutlined, WarnCircleFilled } from '@apitable/icons';
import { produce } from 'immer';
import { isEqual, PropertyPath, set } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FilterValue } from './filter_value';
import { FieldSelect } from './field_select';
import { addNewFilter as _addNewFilter, FilterTypeEnums, getBooleanOptionName, getFields, getOperatorOptions } from './helper';
import { FilterButtonWrap, FilterGroupWrap, GroupWrapperWithButton, SubGroupWrap, OperatorWrap } from './styled';
import { FilterButton } from './filter_button';
import { getFieldPermissionMap, getFieldRoleByFieldId, getSnapshot } from 'store';
import { IWidgetState } from 'interface';

const transformNullFilter = (filter?: IExpression) => {
  return filter == null || isEqual(filter, EmptyNullOperand)
    ? {
        operator: OperatorEnums.And,
        operands: [],
      }
    : filter;
};
interface IFilterProps {
  filter?: IExpression;
  datasheetId: string;
  hasParent?: boolean;
  path?: string;
  onChange?: (filter: IExpressionOperand) => void;
  depth?: number;
}

const WarningTip = (props: any) => {
  const theme = useTheme();
  return (
    <Box display="flex" alignItems="center" gridColumn="property-start / value-end">
      <WarnCircleFilled color={theme.color.fc10} />
      <Typography color={theme.color.fc10} variant="body3" style={{ marginLeft: '4px' }}>
        {props.children}
      </Typography>
    </Box>
  );
};
/**
 * This is a recursively rendered component with up to 3 levels of nesting. Renders S-expressions as nested grouped conditional filters.
 * Supports adding, removing and modifying filter conditions.
 * Expression Classification
 * + Basic expressions
 *   + The first operand is always a field of the specified table
 *   + The operator is the specified operator. bool Related
 *   + The third is the user input value, which can be static or dynamic
 * + Grouping expressions
 *   + or / and concatenated expressions. It can be a base expression or a grouping expression
 */
export const FilterBase = (props: IFilterProps) => {
  const supportsGrouping = false;
  const { datasheetId, hasParent = false, onChange, depth = 0 } = props;
  // Null expressions converted to null
  const [filter, setFilter] = useState(transformNullFilter(props.filter));
  const theme = useTheme();
  const isRoot = !hasParent;
  const updateFilter = useCallback(
    (filter: any) => {
      setFilter(filter);
      // The updated value of the child component is passed to the parent component.
      // The parent component knows the specific path of the child component and only needs to pass the value.
      if (onChange) {
        // root update, you need to serialize the values a bit.
        if (isRoot) {
          onChange({
            type: OperandTypeEnums.Expression,
            value: filter.operands?.length === 0 ? null : filter, // Null handling
          });
        } else {
          onChange(filter);
        }
      }
    },
    [onChange, isRoot]
  );

  useEffect(() => {
    setFilter(transformNullFilter(props.filter));
  }, [props.filter]);

  const isGroup = isEqual(filter, EmptyNullOperand) || filter.operator === 'and' || filter.operator === 'or';
  const isBaseExpression = !isGroup;

  /**
   * Modify its own value inside the component, and at the same time to synchronize it to the parent component.
   * @param path: The path of the subcomponent
   * @param value: The value of the subcomponent
   */
  const handleChange = (path: PropertyPath, value: IExpressionOperand | string) => {
    // Here immer and lodash set do not match, direct json to
    const _filter = JSON.parse(JSON.stringify(filter));
    // Reset the operator and reset the value when the selected field changes.
    if (path === 'operands[0].value') {
      const field = fields.find((field) => field.id === value);
      const op = field ? Field.bindModel(field).acceptFilterOperators?.[0] : '';
      op && set(_filter, 'operator', op);
      // If it is a checkbox, fill in false by default.
      field && set(_filter, 'operands[1].value', field.type === FieldType.Checkbox ? false : null);
    }
    set(_filter, path, value);
    updateFilter(_filter);
  };

  // Press path to delete.
  const deleteOperandByIndex = (operandIndex: number) => {
    const _filter = produce(filter, (draft: { operands: any[] }) => {
      draft.operands.splice(operandIndex, 1);
    });
    updateFilter(_filter);
  };

  const snapshot = useSelector((state: unknown) => {
    return getSnapshot(state as IWidgetState, datasheetId)!;
  });

  const fieldPermissionMap = useSelector((state: unknown) => {
    return getFieldPermissionMap(state as IWidgetState, datasheetId);
  });

  // Here are all the fields, with or without permissions.
  const fieldMap = snapshot.meta.fieldMap;

  const filters = getFields(snapshot.meta.views[0]?.columns!, fieldMap);
  const fields = filters.filter((r) => Field.bindModel(r).canFilter);
  const primaryField = fields[0];
  const addNewFilter = useCallback(
    (type: FilterTypeEnums) => {
      const newFilter = _addNewFilter(filter, type, primaryField);
      updateFilter(newFilter);
    },
    [filter, updateFilter, primaryField]
  );

  const boolOperatorOptions = [
    { value: 'and', label: getBooleanOptionName('and') },
    { value: 'or', label: getBooleanOptionName('or') },
  ];
  if (isBaseExpression) {
    const fieldId = filter.operands[0]?.value;
    const field = fieldMap[fieldId];
    const isDeletedField = field == null;

    if (isDeletedField) {
      return (
        <>
          <WarningTip>{t(Strings.robot_trigger_record_matches_condition_invalid_field)}</WarningTip>
        </>
      );
    }
    const isCryptoField = getFieldRoleByFieldId(fieldPermissionMap, fieldId) === ConfigConstant.Role.None;
    if (isCryptoField) {
      return (
        <>
          <WarningTip>{t(Strings.robot_trigger_record_matches_condition_cannot_access_field)}</WarningTip>
        </>
      );
    }

    const operatorOptions = getOperatorOptions(field);

    return (
      <>
        <FieldSelect fields={fields} value={filter.operands[0]?.value} onChange={(value) => handleChange('operands[0].value', value)} />
        <Select
          dropDownOptions={{
            placement: 'bottom-start',
          }}
          panelOptions={{
            maxWidth: '300px',
          }}
          dropdownMatchSelectWidth={false}
          options={operatorOptions}
          value={filter.operator}
          onSelected={({ value }) => handleChange('operator', value as any)}
        />
        {/* Booth div to make grid layout render properly */}
        <FilterValue
          field={field}
          operator={filter.operator as any}
          value={filter.operands[1]?.value}
          onChange={(value) => handleChange('operands[1].value', value)}
        />
      </>
    );
  }

  const Wrapper = hasParent ? SubGroupWrap : React.Fragment;

  return (
    <Wrapper>
      <GroupWrapperWithButton>
        <FilterGroupWrap>
          {filter?.operands?.map((item, index) => {
            const path = `operands[${index}].value`;
            return (
              <React.Fragment key={path}>
                {index == 0 ? (
                  <OperatorWrap>{t(Strings.where)}</OperatorWrap>
                ) : index === 1 ? (
                  <Select
                    dropDownOptions={{
                      placement: 'bottom-start',
                    }}
                    panelOptions={{
                      maxWidth: '300px',
                    }}
                    dropdownMatchSelectWidth={false}
                    options={boolOperatorOptions}
                    value={filter.operator}
                    onSelected={({ value }) => handleChange('operator', value as any)}
                  />
                ) : (
                  <OperatorWrap> {getBooleanOptionName(filter.operator)}</OperatorWrap>
                )}
                <FilterBase
                  path={path}
                  filter={item.value}
                  datasheetId={datasheetId}
                  hasParent
                  depth={depth + 1}
                  onChange={(value) => {
                    handleChange(path, value);
                  }}
                />
                <IconButton
                  icon={() => <DeleteOutlined size={16} color={theme.color.textCommonTertiary} />}
                  onClick={() => deleteOperandByIndex(index)}
                />
              </React.Fragment>
            );
          })}
        </FilterGroupWrap>
        <FilterButtonWrap>
          <FilterButton onClick={() => addNewFilter(FilterTypeEnums.Filter)}>{t(Strings.add_filter)}</FilterButton>
          {supportsGrouping && depth < 2 && (
            <Button
              prefixIcon={<AddOutlined />}
              variant="fill"
              onClick={() => {
                addNewFilter(FilterTypeEnums.FilterGroup);
              }}
            >
              Add filter criteria group
            </Button>
          )}
        </FilterButtonWrap>
      </GroupWrapperWithButton>
    </Wrapper>
  );
};
