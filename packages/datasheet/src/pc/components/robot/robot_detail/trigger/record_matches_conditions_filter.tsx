import { Box, Button, IconButton, Typography, useTheme } from '@vikadata/components';
import {
  ConfigConstant, EmptyNullOperand, IExpression, ILiteralOperand, OperandTypeEnums, OperatorEnums, Selectors, Strings, t
} from '@apitable/core';
import { AddOutlined, DeleteOutlined, ErrorFilled } from '@vikadata/icons';
import produce from 'immer';
import { isEqual, set } from 'lodash';
import { useAllColumns } from 'pc/hooks';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Select } from '../select';
import { FieldInput } from './field_input';
import { FieldSelect } from './field_select';
import { addNewFilter as _addNewFilter, FilterTypeEnums, getBooleanOptionName, getFields, getOperatorOptions, op2fop } from './helper';
import styles from './styles.module.less';

const transformNullFilter = (filter) => {
  return filter == null || isEqual(filter, EmptyNullOperand) ? {
    operator: OperatorEnums.And,
    operands: [],
  } : filter;
};

interface IRecordMatchesConditionsFilterProps {
  filter?: IExpression;
  datasheetId: string;
  hasParent?: boolean;
  path?: string;
  onChange?: (filter: ILiteralOperand) => void;
  depth?: number;
}

const WarningTip = (props) => {
  const theme = useTheme();
  return <Box
    display="flex"
    alignItems="center"
    gridColumn="property-start / value-end"
  >
    <ErrorFilled color={theme.color.fc10} />
    <Typography color={theme.color.fc10} variant="body3" style={{ marginLeft: '4px' }}>
      {props.children}
    </Typography>
  </Box>;
};
/**
 * 这是一个递归渲染的组件，最多只能套娃3层。将 S表达式渲染成嵌套的分组条件过滤器。支持添加、删除、修改过滤条件。
 * 表达式分类
 * + 基础表达式
 *   + 第一个操作数始终是指定表的字段
 *   + 操作符为指定的操作符。 bool 相关
 *   + 第三个为用户输入值，可静态可以动态
 * + 分组表达式
 *   + or / and 连接起来的表达式。可以是基础表达式，也可以是分组表达式
 */
export const RecordMatchesConditionsFilter = (props: IRecordMatchesConditionsFilterProps) => {
  const { datasheetId, hasParent = false, onChange, depth = 0 } = props;
  // 空值转化为空的表达式
  const [filter, setFilter] = useState(transformNullFilter(props.filter));
  const isRoot = !hasParent;
  const updateFilter = useCallback((filter) => {
    setFilter(filter);
    // 子组件更新后的值传递给父组件。父组件知道子组件的具体 path。只需要传值就行。
    if (onChange) {
      // root 更新，需要将值序列化一下。
      if (isRoot) {
        onChange({
          type: OperandTypeEnums.Literal,
          value: filter.operands?.length === 0 ? null : filter, // 空值处理
        });
      } else {
        onChange(filter);
      }
    }
  }, [onChange, isRoot]);

  useEffect(() => {
    setFilter(transformNullFilter(props.filter));
  }, [props.filter]);

  // 打印根组件的值
  if (!hasParent) {
    // console.log('filterfilterfilter', filter);
  }
  const isGroup = isEqual(filter, EmptyNullOperand) || filter.operator === 'and' || filter.operator === 'or';
  const isBaseExpression = !isGroup;

  /**
   * 在组件内部修改自己的值，同时要同步给父组件。
   * @param path: 子组件的 path
   * @param value: 子组件的值
   */
  const handleChange = (path, value) => {
    // 这里 immer 和 lodash set 不搭，直接 json 转
    const _filter = JSON.parse(JSON.stringify(filter));
    set(_filter, path, value);
    updateFilter(_filter);
  };

  // 按 path 删除
  const deleteOperandByIndex = (operandIndex: number) => {
    const _filter = produce(filter, (draft) => {
      draft.operands.splice(operandIndex, 1);
    });
    updateFilter(_filter);
  };

  const columns = useAllColumns(datasheetId);
  const snapshot = useSelector(state => {
    return Selectors.getSnapshot(state, datasheetId)!;
  });
  const fieldPermissionMap = useSelector(state => {
    return Selectors.getFieldPermissionMap(state, datasheetId);
  });

  // 这里是所有的字段，不管有没有权限
  const fieldMap = snapshot.meta.fieldMap;

  const fields = getFields(columns!, fieldMap);
  const primaryFieldId = fields[0].id;
  const addNewFilter = useCallback((type: FilterTypeEnums) => {
    const newFilter = _addNewFilter(filter, type, primaryFieldId);
    // console.log('newFilter', newFilter);
    updateFilter(newFilter);
  }, [filter, updateFilter, primaryFieldId]);

  const boolOperatorOptions = [
    { value: 'and', label: getBooleanOptionName('and') },
    { value: 'or', label: getBooleanOptionName('or') },
  ];
  if (isBaseExpression) {
    const fieldId = filter.operands[0].value;
    const field = fieldMap[fieldId];
    const isDeletedField = field == null;

    if (isDeletedField) {
      return <>
        <WarningTip>
          {t(Strings.robot_trigger_record_matches_condition_invalid_field)}
        </WarningTip>
      </>;
    }
    const isCryptoField = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId) === ConfigConstant.Role.None;
    if (isCryptoField) {
      return <>
        <WarningTip>
          {t(Strings.robot_trigger_record_matches_condition_cannot_access_field)}
        </WarningTip>
      </>;
    }
    const operatorOptions = getOperatorOptions(field);

    const showFieldInput = ![OperatorEnums.IsNotNull, OperatorEnums.IsNull].includes(filter.operator);
    const fop = op2fop(filter.operator as OperatorEnums);
    return (
      <>
        <FieldSelect
          fields={fields}
          value={filter.operands[0].value}
          onChange={(value) => handleChange('operands[0].value', value)}
        />
        <Select
          options={operatorOptions}
          value={filter.operator}
          onChange={(value) => handleChange('operator', value)}
        />
        {/* 展位 div 让 grid 布局正常渲染 */}
        <div>
          {
            showFieldInput && <FieldInput
              field={field}
              fop={fop}
              value={filter.operands[1].value}
              onChange={(value) => handleChange('operands[1].value', value)}
            />
          }
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
          {
            filter?.operands?.map((item, index) => {
              const path = `operands[${index}].value`;
              return (
                <Fragment key={path}>
                  {
                    index == 0 ? <Typography variant="body3" style={{ paddingLeft: 4 }}>
                      {t(Strings.robot_trigger_match_condition_when)}
                    </Typography> : (
                      index === 1 ? <Select
                        options={boolOperatorOptions}
                        value={filter.operator}
                        onChange={(value) => handleChange('operator', value)}
                      /> :
                        <Typography variant="body3" style={{ paddingLeft: 4 }}> {getBooleanOptionName(filter.operator)}</Typography>)
                  }
                  <RecordMatchesConditionsFilter
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
                    shape="square"
                    icon={DeleteOutlined} onClick={() => {
                      deleteOperandByIndex(index);
                    }} />
                </Fragment>
              );
            })
          }
        </div>
        <div className={styles.addFilterWrapper}>
          {/* 这里要换个组件 */}
          {/* <DoubleSelect
           value={''}
           options={addFilterOptions}
           triggerStyle={{ width: 180 }}
           triggerCls={styles.addFilterSelectTrigger}
           onSelected={(option) => {
           console.log('addNewFilter', option.value);
           addNewFilter(option.value as FilterTypeEnums);
           }}
           /> */}
          <Button
            prefixIcon={<AddOutlined />}
            variant="fill"
            onClick={(e) => {
              // console.log('addNewFilter', FilterTypeEnums.Filter);
              addNewFilter(FilterTypeEnums.Filter);
            }}
          >
            {t(Strings.robot_trigger_add_match_condition_button)}
          </Button>
          {/* <span onClick={() => addNewFilter(FilterTypeEnums.Filter)}> ++++</span> */}
        </div>
      </div>
    </Wrapper>
  );
};
