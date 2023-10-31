import dynamic from 'next/dynamic';
import { useContext, useState } from 'react';
import { KONVA_DATASHEET_ID, Strings, t } from '@apitable/core';
import { AddOutlined, FileOutlined } from '@apitable/icons';
import { generateTargetName } from '../../../gantt_view';
import { Icon, Rect, Text } from '../../../konva_components';
import { GRID_CELL_ADD_ITEM_BUTTON_SIZE, GRID_CELL_VALUE_PADDING, GRID_OPTION_ITEM_PADDING } from '../../constant';
import { KonvaGridContext } from '../../context';
import { CellScrollContainer } from '../cell_scroll_container';
import { ICellProps } from './cell_value';
import { IRenderContentBase, IRenderData } from './interface';

const AddOutlinedPath = AddOutlined.toString();
const FileOutlinedPath = FileOutlined.toString();
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

export const CellWorkdoc = (props: ICellProps) => {
  const { x, y, recordId, field, rowHeight, columnWidth, renderData, isActive, editable, toggleEdit } = props;
  const operatingEnable = isActive;
  const { renderContent, height } = renderData;
  const fieldId = field?.id;

  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  const [isHover, setHover] = useState(false);

  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });

  const renderDoc = () => {
    if (renderContent == null) return null;
    const { x, y, width, height, text } = renderContent[0] as IRenderContentBase;
    return (
      <Group
        x={10}
        y={4}
        listening={isActive}
        onMouseEnter={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onClick={toggleEdit}
        onTap={toggleEdit}
      >
        <Rect
          name={name}
          width={width - 6}
          height={height + 4}
          fill={isHover ? colors.bgBrandLightHover : colors.bgBrandLightDefault}
          cornerRadius={4}
        />
        <Icon
          x={4}
          y={2}
          data={FileOutlinedPath}
          backgroundWidth={22}
          backgroundHeight={22}
          fill={colors.textBrandDefault}
        />
        <Text x={x - 10} y={y - 2} height={height} text={text} fill={colors.textBrandDefault} fontSize={13} />
      </Group>
    );
  };

  return (
    <CellScrollContainer
      x={x}
      y={y}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      fieldId={fieldId}
      recordId={recordId}
      renderData={{} as IRenderData}
    >
      {(operatingEnable && renderContent == null) ? editable ? (
        <>
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
          <Text
            x={GRID_OPTION_ITEM_PADDING + GRID_CELL_ADD_ITEM_BUTTON_SIZE}
            y={16}
            height={height}
            text={t(Strings.workdoc_create)}
            fontSize={13}
            fill={colors.textCommonTertiary}
          />
        </>
      ) : null : renderDoc()}
    </CellScrollContainer>
  );
};
