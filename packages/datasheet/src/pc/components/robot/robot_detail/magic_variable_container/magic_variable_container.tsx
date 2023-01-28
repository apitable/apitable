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

import { Box, TextInput, Typography, useSelectIndex, useTheme } from '@apitable/components';
import { IExpression, OperandTypeEnums, OperatorEnums, Strings, t } from '@apitable/core';
import { SearchOutlined } from '@apitable/icons';
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

  // Dynamic list of parameters produced according to schema
  let variableList: ISchemaPropertyListItem[] = getCurrentVariableList({
    schemaExpressionList,
    nodeOutputSchemaList,
    isJSONField
  });

  // List of dynamic parameters after filtering by keyword search
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
    // eslint-disable-next-line
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
    // The string is inserted directly and does not go to the next step. 
    // Here you have to choose the prototype method of string.
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
    // Specifies whether or not to enter the child node
    if (goIntoChildren && listItem.hasChildren) {
      goNext(listItem);
      return;
    }
    if (listItem.canInsert) {
      insertMagicVariable(listItem.expression);
    } else if (listItem.hasChildren) {
      goNext(listItem);
    }
    // Focus again after insertion is complete
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