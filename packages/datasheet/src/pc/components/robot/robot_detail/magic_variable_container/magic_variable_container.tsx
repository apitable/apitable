import { Box, TextInput, Typography, useSelectIndex, useTheme } from '@vikadata/components';
import { IExpression, OperandTypeEnums, OperatorEnums, Strings, t } from '@vikadata/core';
import { SearchOutlined } from '@vikadata/icons';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { INodeOutputSchema, IUISchemaLayoutGroup } from '../../interface';
import { getCurrentVariableList, getGroupedVariableList, ISchemaAndExpressionItem, ISchemaPropertyListItem } from './helper';
import { SchemaPropertyList } from './magic_variable_list';

interface ISchemaMapProps {
  nodeOutputSchemaList: INodeOutputSchema[];
  insertMagicVariable: (data) => void;
  setOpen: (open: boolean) => void;
  isJSONField: boolean;
}

export const MagicVariableContainer = forwardRef((props: ISchemaMapProps, ref) => {
  const { nodeOutputSchemaList, insertMagicVariable, setOpen, isJSONField } = props;
  const [schemaExpressionList, setSchemaExpressionList] = useState<ISchemaAndExpressionItem[]>([]);
  // const [deepIndex, setDeepIndex] = useState<number>(0);
  const theme = useTheme();
  const searchRef = useRef<any>();
  const listContainerRef = useRef<any>();
  const [searchValue, setSearchValue] = useState<string>('');

  // 根据 schema 生产的动态参数列表
  let variableList: ISchemaPropertyListItem[] = getCurrentVariableList({
    schemaExpressionList,
    nodeOutputSchemaList,
    isJSONField
  });

  // 按关键词搜索过滤之后的动态参数列表
  variableList = variableList.filter(item => item.label?.includes(searchValue));

  useEffect(() => {
    setTimeout(() => {
      searchRef.current?.focus();
    }, 0);
  }, []);
  useEffect(() => {
    if (searchValue) {
      setSearchValue('');
      // searchRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaExpressionList]);

  const goPrev = useCallback((_deepIndex?: number) => {
    if (schemaExpressionList.length) {
      if (_deepIndex != null) {
        setSchemaExpressionList([...schemaExpressionList.slice(0, _deepIndex)]);
        // setDeepIndex(_deepIndex);
      } else {
        setSchemaExpressionList([...schemaExpressionList.slice(0, schemaExpressionList.length - 1)]);
        // setDeepIndex(Math.max(0, deepIndex - 1));
      }
    }
  }, [schemaExpressionList]);

  const goNext = useCallback((listItem: ISchemaPropertyListItem) => {
    if (listItem.disabled) {
      return;
    }
    let nextSchemaExpression = {
      schema: listItem.schema,
      uiSchema: listItem.uiSchema,
      expression: listItem.expression,
    };
    // string 直接插入，不会进入到下一步。这里是要选择 string 的 原型方法。
    const isStringType = listItem.schema?.type === 'string';
    if (isJSONField && isStringType) {
      const expression: IExpression = {
        operator: OperatorEnums.JSONStringify,
        operands: [
          {
            type: OperandTypeEnums.Expression,
            value: listItem.expression,
          }
        ]
      };
      nextSchemaExpression = {
        schema: undefined,
        uiSchema: undefined,
        expression,
      };
    }
    const newSchemaExpressionList = [...schemaExpressionList, nextSchemaExpression];
    setSchemaExpressionList(newSchemaExpressionList);
    // setDeepIndex(deepIndex + 1);
  }, [isJSONField, schemaExpressionList]);

  const handleItemClick = (listItem: ISchemaPropertyListItem, goIntoChildren?: boolean) => {
    if (listItem.disabled) {
      return;
    }
    // 指定了是否进入子节点
    if (goIntoChildren && listItem.hasChildren) {
      goNext(listItem);
      return;
    }
    if (listItem.canInsert) {
      insertMagicVariable(listItem.expression);
    } else if (listItem.hasChildren) {
      goNext(listItem);
    }
    // 插入完成之后再次聚焦
    // searchRef.current?.focus();
  };
  const listUISchema = schemaExpressionList.length > 0 ? schemaExpressionList[schemaExpressionList.length - 1].uiSchema : undefined;
  const layout: IUISchemaLayoutGroup[] | undefined = listUISchema?.layout;
  variableList = getGroupedVariableList({ schemaExpressionList, variableList });

  const { index: activeIndex } = useSelectIndex({
    inputRef: searchRef,
    containerRef: ref as any,
    listContainerRef,
    activeItemClass: '.active',
    listLength: variableList.length,
    onEnter: (index: number) => {
      const listItem = variableList[index];
      if (listItem) {
        handleItemClick(listItem);
      }
    },
    onArrowRightPress: (index) => {
      const listItem = variableList[index];
      if (listItem && listItem.hasChildren) {
        goNext(listItem);
      }
    },
    onArrowLeftPress: (index) => {
      goPrev();
    },
    onEscapePress: () => {
      setOpen(false);
    }
  });
  return (
    <Box
      backgroundColor={theme.color.fc8}
      borderRadius="8px"
      border={`1px solid ${theme.color.fc5}`}
      ref={ref as any}
      padding="8px 16px"
    >
      <TextInput
        type="text"
        ref={searchRef}
        // autoFocus
        block
        lineStyle
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        placeholder={t(Strings.search)}
        prefix={<SearchOutlined />}
      />
      <Box margin="8px 0px">
        <Typography variant="body4" style={{ marginLeft: 8 }}>
          {t(Strings.robot_variables_select_step)}{
            schemaExpressionList.map(({ schema }, index) => {
              return (
                <span key={index}>
                  /{schema?.title}
                </span>
              );
            })
          }
        </Typography>
      </Box>
      <Box
        ref={listContainerRef}
        maxHeight="300px"
        overflow="scroll"
      >
        <SchemaPropertyList
          list={variableList}
          layout={layout}
          activeIndex={activeIndex}
          handleItemClick={handleItemClick}
        />
      </Box>
    </Box >
  );
});