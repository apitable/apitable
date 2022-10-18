import { getNextShadeColor } from '@vikadata/components';
import { KONVA_DATASHEET_ID, MemberType } from '@vikadata/core';
import { AddOutlined, CloseSmallOutlined } from '@vikadata/icons';
import dynamic from 'next/dynamic';
import { AvatarSize, AvatarType } from 'pc/components/common';
import { generateTargetName } from 'pc/components/gantt_view';
import { Icon, Rect, Text } from 'pc/components/konva_components';
import {
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE,
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
  GRID_CELL_MEMBER_ITEM_PADDING_LEFT,
  GRID_CELL_VALUE_PADDING,
  GRID_MEMBER_ITEM_AVATAR_MARGIN_RIGHT,
  GRID_OPTION_ITEM_PADDING,
  KonvaGridContext,
} from 'pc/components/konva_grid';
import { KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { FC, useContext, useState } from 'react';
import { CellScrollContainer } from '../../cell_scroll_container';
import { ICellProps } from '../cell_value';
import { IRenderContentBase } from '../interface';
import { Avatar } from './avatar';

const AddOutlinedPath = AddOutlined.toString();
const CloseSmallOutlinedPath = CloseSmallOutlined.toString();
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
export const CellMember: FC<ICellProps> = props => {
  const { x, y, recordId, cellValue, field, rowHeight, columnWidth, renderData, isActive, editable, onChange, toggleEdit } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { setCellDown } = useContext(KonvaGridContext);
  const { unitTitleMap } = useContext(KonvaGridViewContext);
  const [closeIconHoverId, setCloseIconHoverId] = useState<null | string>(null);
  const [closeIconDownId, setCloseIconDownId] = useState<null | string>(null);
  const [isHover, setHover] = useState(false);

  const { id: fieldId, property } = field;
  const isMulti = property?.isMulti;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });
  const { renderContent } = renderData;
  const operatingEnable = isActive && editable;
  const avatarSize = AvatarSize.Size20;

  function deleteItem(index?: number) {
    let value: string[] | null = (cellValue as string[]).filter((item, idx) => {
      return idx !== index;
    });
    if (value.length === 0) {
      value = null;
    }
    onChange?.(value);
  }

  return (
    <CellScrollContainer x={x} y={y} columnWidth={columnWidth} rowHeight={rowHeight} fieldId={fieldId} recordId={recordId} renderData={renderData}>
      {operatingEnable && (isMulti || !(renderContent as IRenderContentBase[])?.length) && (
        <Icon
          name={name}
          x={GRID_CELL_VALUE_PADDING}
          y={5}
          data={AddOutlinedPath}
          shape={'circle'}
          backgroundWidth={22}
          backgroundHeight={22}
          background={isHover ? colors.rowSelectedBgSolid : 'transparent'}
          onMouseEnter={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          onClick={toggleEdit}
          onTap={toggleEdit}
        />
      )}
      {isActive &&
        renderContent != null &&
        (renderContent as IRenderContentBase[]).map((item, index) => {
          const { x, y, width, height, text, id, unitInfo } = item;
          const { avatar, type, unitId } = unitInfo;

          const radius = type === MemberType.Team ? 4 : 16;
          const itemBg = colors.fc11;
          const iconX = width - GRID_OPTION_ITEM_PADDING - GRID_CELL_DELETE_ITEM_BUTTON_SIZE - GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET;
          let iconBg = 'transparent';

          if (closeIconHoverId === id) {
            iconBg = getNextShadeColor(colors.defaultTag, 1);
          }
          if (closeIconDownId === id) {
            iconBg = getNextShadeColor(colors.defaultTag, 2);
          }
          return (
            <Group x={x} y={y} listening={isActive} key={index}>
              <Rect width={width} height={height} fill={itemBg} cornerRadius={radius} listening={false} />
              <Avatar
                x={GRID_CELL_MEMBER_ITEM_PADDING_LEFT}
                y={(height - avatarSize) / 2}
                id={id}
                title={text}
                size={avatarSize}
                src={avatar}
                type={type === MemberType.Member ? AvatarType.Member : AvatarType.Team}
              />
              <Text
                x={avatarSize + GRID_MEMBER_ITEM_AVATAR_MARGIN_RIGHT}
                height={height}
                fill={colors.fc1}
                text={unitTitleMap?.[unitId] || text}
                fontSize={13}
              />
              {operatingEnable && (
                <>
                  <Rect x={iconX} width={24} height={height} fill={itemBg} cornerRadius={[0, radius, radius, 0]} listening={false} />
                  <Icon
                    name={name}
                    x={iconX}
                    y={4}
                    data={CloseSmallOutlinedPath}
                    fill={colors.fc2}
                    size={16}
                    background={iconBg}
                    backgroundHeight={16}
                    backgroundWidth={16}
                    cornerRadius={2}
                    onTap={e => deleteItem(index)}
                    onMouseDown={e => {
                      setCloseIconDownId(id);
                    }}
                    onMouseUp={e => {
                      if (closeIconDownId) {
                        deleteItem(index);
                      }
                      setCellDown(false);
                      setCloseIconDownId(null);
                    }}
                    onMouseEnter={() => setCloseIconHoverId(id)}
                    onMouseOut={() => {
                      setCloseIconDownId(null);
                      setCloseIconHoverId(null);
                    }}
                  />
                </>
              )}
            </Group>
          );
        })}
    </CellScrollContainer>
  );
};
