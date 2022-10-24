import { Typography, useTheme } from '@vikadata/components';
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
  // 是否存在原型属性/方法，如果有则分组。
  const hasPrototype = list.some(item => item.isPrototype);

  // 没有布局要求，直接按顺序排列
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