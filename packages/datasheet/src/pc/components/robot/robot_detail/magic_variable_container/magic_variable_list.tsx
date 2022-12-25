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

import { Typography, useTheme } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { IUISchemaLayoutGroup } from '../../interface';
import { ISchemaPropertyListItem, ISchemaPropertyListItemClickFunc } from './helper';
import { SchemaPropertyListItem } from './magic_variable_list_item';

interface ISchemaPropertyListProps {
  list: ISchemaPropertyListItem[];
  layout?: IUISchemaLayoutGroup[];
  activeIndex?: number;
  handleItemClick: ISchemaPropertyListItemClickFunc;
}

export const SchemaPropertyList = (props: ISchemaPropertyListProps) => {
  const { list, activeIndex, handleItemClick, layout } = props;
  const listItemMap = list.reduce((map, item) => {
    map[item.key] = item;
    return map;
  }, {});
  const theme = useTheme();
  // Whether there are prototype properties/methods, and if so, group them.
  const hasPrototype = list.some(item => item.isPrototype);

  // No layout requirements, directly in order
  if (!hasPrototype && (!layout || !listItemMap)) {
    return <>
      {
        list.map((item, index) => {
          const isActive = activeIndex === index;
          const disabled = item.disabled;
          return <SchemaPropertyListItem
            isActive={isActive}
            disabled={disabled}
            key={item.key}
            item={item}
            handleItemClick={handleItemClick}
          />;
        })
      }
    </>;
  }
  let layoutGroupList: IUISchemaLayoutGroup[] = layout || [];

  if (hasPrototype) {
    const prototypeList = list.filter(item => item.isPrototype);
    const restList = list.filter(item => !item.isPrototype);
    layoutGroupList = [];
    if (restList.length) {
      layoutGroupList.push({
        items: restList.map(item => item.key),
        title: t(Strings.robot_variables_join_array_item_property),
      });
    }
    if (prototypeList.length) {
      layoutGroupList.push({
        items: prototypeList.map(item => item.key),
        title: t(Strings.robot_variables_more_operations),
      });
    } 
  }

  return <>
    {
      layoutGroupList.map(eachGroup => {
        const { items, title } = eachGroup;
        return <>
          <Typography variant="h9" color={theme.color.fc3} style={{
            marginTop: 8,
            marginBottom: 4,
            marginLeft: 8
          }}>
            {title}
          </Typography>
          {
            items.map(itemKey => {
              const item = listItemMap[itemKey];
              if (!item) return null;
              const isActive = list[activeIndex!]?.key === itemKey;
              const disabled = item.disabled;
              return <SchemaPropertyListItem
                isActive={isActive}
                disabled={disabled}
                key={item.key}
                item={item}
                handleItemClick={handleItemClick}
              />;
            })
          }
        </>;
      })
    }
  </>;
};