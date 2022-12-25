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

import { ArrayFieldTemplateProps } from '@rjsf/core';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from '@apitable/icons';
import { Button } from 'components/button';
import { IconButton } from 'components/icon_button';
import React from 'react';
import styled from 'styled-components';

const InlineArrayItem = styled.div`
  display: flex;
  align-items: center;
`;

type IArrayFieldItems = Pick<ArrayFieldTemplateProps, 'items'>;
type IArrayFieldItem = IArrayFieldItems['items'][number];

const ArrayFieldItem = (props: IArrayFieldItem) => {
  const isUpDisable = props.disabled || props.readonly || !props.hasMoveUp;
  const isDownDisable = props.disabled || props.readonly || !props.hasMoveDown;
  return (
    <InlineArrayItem>
      {props.children}
      {props.hasToolbar && (
        <>
          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              disabled={isUpDisable}
              size="small"
              onClick={props.onReorderClick(props.index, props.index - 1)}
              icon={ArrowUpOutlined}
            />
          )}

          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              disabled={isDownDisable}
              onClick={props.onReorderClick(props.index, props.index + 1)}
              icon={ArrowDownOutlined}
            />
          )}
          {props.hasRemove && (
            <IconButton
              disabled={props.disabled || props.readonly}
              onClick={props.onDropIndexClick(props.index)}
              icon={DeleteOutlined}
            />
          )}
        </>
      )}
    </InlineArrayItem>
  );
};

export const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  // const orderable = (getUiOptions(props.uiSchema) || {}).orderable as boolean;
  // // const removable = (getUiOptions(props.uiSchema) || {}).removable as boolean;

  // const SortableItem = SortableElement(({ element }: { element: any }) => (
  //   <div style={{ display: 'flex' }}>
  //     <DragOutlined /><ArrayFieldItem {...element} />
  //   </div>
  // ));

  // const SortableItems = SortableContainer(({ items }: { items: IArrayFieldItem[] }) => {
  //   return (
  //     <>
  //       {props.items.map((element, index) => (
  //         <SortableItem key={element.key} index={index} element={element} />
  //       ))}
  //     </>
  //   );
  // });

  // const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
  //   console.log({ oldIndex, newIndex });
  //   props.items[oldIndex].onReorderClick(oldIndex, newIndex);
  // };
  // if (orderable) {
  //   return (
  //     <div>
  //       <SortableItems items={props.items} onSortEnd={onSortEnd} />
  //       {props.canAdd && (
  //         <div>
  //           <Button onClick={props.onAddClick} size="small" >+ New</Button>
  //         </div>
  //       )}
  //     </div>
  //   )
  // }

  const { schema, uiSchema, items, onAddClick } = props;
  const { maxItems, minItems } = schema;
  const addable = uiSchema.addable ?? (maxItems ? items.length < maxItems : true);
  const hasRemove = minItems ? items.length > minItems : true;

  return (
    <div>
      {items.map(element => <ArrayFieldItem {...element} hasRemove={hasRemove} />)}
      {addable && (
        <div>
          <Button onClick={onAddClick} size="small" >+ New</Button>
        </div>
      )}
    </div >
  );
};
