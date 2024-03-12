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

import produce from 'immer';
import { isEqual, PropertyPath, set } from 'lodash';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from '@apitable/components';
import {
  ConfigConstant,
  EmptyNullOperand,
  IExpression,
  ILiteralOperand,
  OperandTypeEnums,
  OperatorEnums,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { AddOutlined, DeleteOutlined, WarnCircleFilled } from '@apitable/icons';
import { useAllColumnsOrEmpty } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { Select } from '../select';
import { FieldInput } from './field_input';
import { FieldSelect } from './field_select';
import {
  addNewFilter as _addNewFilter,
  FilterTypeEnums,
  getBooleanOptionName,
  getFields,
  getOperatorOptions,
  op2fop
} from './helper';
import styles from './styles.module.less';

const transformNullFilter = (filter?: IExpression | null) => {
  return filter == null || isEqual(filter, EmptyNullOperand)
    ? {
      operator: OperatorEnums.And,
      operands: [],
    }
    : filter;
};

interface IRecordMatchesConditionsFilterProps {
    filter?: IExpression;
    datasheetId: string;
    hasParent?: boolean;
    path?: string;
    onChange?: (filter: ILiteralOperand) => void;
    readonly?: boolean;
    depth?: number;
}

const WarningTip = (props: any) => {
  const theme = useTheme();
  return (
    <Box display="flex" alignItems="center" gridColumn="property-start / value-end">
      <WarnCircleFilled color={theme.color.fc10}/>
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
export const RecordMatchesConditionsFilter = (props: IRecordMatchesConditionsFilterProps) => {

  const datasheetId = props.datasheetId;

  const { readonly = false, hasParent = false, onChange, depth = 0 } = props;

  // Null expressions converted to null
  const [filter, setFilter] = useState(transformNullFilter(props.filter));
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
            type: OperandTypeEnums.Literal,
            value: filter.operands?.length === 0 ? null : filter,
          });
        } else {
          onChange(filter);
        }
      }
    },
    [onChange, isRoot],
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
  const handleChange = (path: PropertyPath, value: ILiteralOperand) => {
    // Here immer and lodash set do not match, direct json to
    const _filter = JSON.parse(JSON.stringify(filter));
    set(_filter, path, value);
    updateFilter(_filter);
  };

  const handleFilterChange = (value: ILiteralOperand) => {
    const _filter = JSON.parse(JSON.stringify(filter));
    set(_filter, 'operands[0].value', value);
    set(_filter, 'operands[1].value', null);
    updateFilter(_filter);
  };

  const deleteOperandByIndex = (operandIndex: number) => {
    const _filter = produce(filter, (draft) => {
      draft.operands.splice(operandIndex, 1);
    });
    updateFilter(_filter);
  };

  const columns = useAllColumnsOrEmpty(datasheetId);

  const snapshot = useAppSelector((state) => {
    return Selectors.getSnapshot(state, datasheetId)!;
  });
  const fieldPermissionMap = useAppSelector((state) => {
    return Selectors.getFieldPermissionMap(state, datasheetId);
  });

  // Here are all the fields, with or without permissions
  const fieldMap = snapshot?.meta?.fieldMap;

  const fields = getFields(columns!, fieldMap);
  const primaryFieldId = fields?.[0]?.id;

  const addNewFilter = useCallback(
    (type: FilterTypeEnums) => {
      const newFilter = _addNewFilter(filter, type, primaryFieldId);
      updateFilter(newFilter);
    },
    [filter, updateFilter, primaryFieldId],
  );

  const boolOperatorOptions = [
    { value: 'and', label: getBooleanOptionName('and') },
    { value: 'or', label: getBooleanOptionName('or') },
  ];
  if (isBaseExpression) {
    const fieldId = filter.operands[0].value;
    const field = fieldMap?.[fieldId];
    const isDeletedField = field == null;

    if (isDeletedField) {
      return (
        <>
          <WarningTip>{t(Strings.robot_trigger_record_matches_condition_invalid_field)}</WarningTip>
        </>
      );
    }
    const isCryptoField = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId) === ConfigConstant.Role.None;
    if (isCryptoField) {
      return (
        <>
          <WarningTip>{t(Strings.robot_trigger_record_matches_condition_cannot_access_field)}</WarningTip>
        </>
      );
    }
    const operatorOptions = getOperatorOptions(field);

    const showFieldInput = ![OperatorEnums.IsNotNull, OperatorEnums.IsNull].includes(filter.operator);
    const fop = op2fop(filter.operator as OperatorEnums);
    return (
      <>
        <FieldSelect fields={fields} disabled={readonly} value={filter.operands[0].value}
          onChange={(value) => handleFilterChange(value)}/>
        <Select options={operatorOptions} disabled={readonly} value={filter.operator}
          onChange={(value) => handleChange('operator', value)}/>
        <div>
          {showFieldInput && (
            <FieldInput
              field={field}
              disabled={readonly}
              fop={fop}
              value={filter.operands[1].value}
              onChange={(value) => handleChange('operands[1].value', value)}
            />
          )}
        </div>
      </>
    );
  }

  const Wrapper = hasParent ? 'div' : Fragment;
  const WrapperProps = hasParent ? { className: styles.subGroupWrapper } : {};
  // const addFilterOptions = getAddFilterOptions(depth);
  return (
    <Wrapper {...WrapperProps}>
      <div className={styles.groupWrapperWithAdd}>
        <div className={styles.groupWrapper}>
          {filter?.operands?.map((item, index) => {
            const path = `operands[${index}].value`;
            return (
              <Fragment key={path}>
                {index == 0 ? (
                  <Typography variant="body3" style={{ paddingLeft: 4 }}>
                    {t(Strings.robot_trigger_match_condition_when)}
                  </Typography>
                ) : index === 1 ? (
                  <Select
                    disabled={readonly}
                    options={boolOperatorOptions}
                    value={filter.operator}
                    onChange={(value) => handleChange('operator', value)}
                  />
                ) : (
                  <Typography variant="body3" style={{ paddingLeft: 4 }}>
                    {' '}
                    {getBooleanOptionName(filter.operator)}
                  </Typography>
                )}
                <RecordMatchesConditionsFilter
                  path={path}
                  filter={item.value}
                  readonly={readonly}
                  datasheetId={datasheetId}
                  hasParent
                  depth={depth + 1}
                  onChange={(value) => {
                    handleChange(path, value);
                  }}
                />
                {readonly ? (
                  <Box width={'4px'} height={'100%'}/>
                ) : (
                  <IconButton
                    disabled={readonly}
                    shape="square"
                    icon={DeleteOutlined}
                    onClick={() => {
                      if (readonly) {
                        return;
                      }
                      deleteOperandByIndex(index);
                    }}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
        {!readonly && (
          <div className={styles.addFilterWrapper}>
            {/* Here we need to change a component */}
            {/* <DoubleSelect
           value={''}
           options={addFilterOptions}
           triggerStyle={{ width: 180 }}
           triggerCls={styles.addFilterSelectTrigger}
           onSelected={(option) => {
           addNewFilter(option.value as FilterTypeEnums);
           }}
           /> */}
            <Button
              prefixIcon={<AddOutlined/>}
              variant="fill"
              onClick={() => {
                addNewFilter(FilterTypeEnums.Filter);
              }}
            >
              {t(Strings.robot_trigger_add_match_condition_button)}
            </Button>
            {/* <span onClick={() => addNewFilter(FilterTypeEnums.Filter)}> ++++</span> */}
          </div>
        )}
      </div>
    </Wrapper>
  );
};
