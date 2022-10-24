import { IAttachmentValue, KONVA_DATASHEET_ID } from '@apitable/core';
import { AddOutlined } from '@vikadata/icons';
import { generateTargetName } from 'pc/components/gantt_view';
import { Icon, Rect } from 'pc/components/konva_components';
import { GRID_CELL_ADD_ITEM_BUTTON_SIZE, GRID_CELL_VALUE_PADDING, KonvaGridContext } from 'pc/components/konva_grid';
import { KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { expandPreviewModal } from 'pc/components/preview_file';
import { MouseDownType } from 'pc/components/selection_wrapper';
import { FC, useContext, useState } from 'react';
import { CellScrollContainer } from '../../cell_scroll_container';
import { ICellProps } from '../cell_value';
import { IRenderContentBase } from '../interface';

const AddOutlinedPath = AddOutlined.toString();

export const CellAttachment: FC<ICellProps> = (props) => {
  const {
    x,
    y,
    cellValue,
    isActive,
    editable,
    rowHeight,
    columnWidth,
    field,
    recordId,
    onChange,
    renderData,
    toggleEdit,
    disabledDownload
  } = props;
  const { datasheetId } = useContext(KonvaGridViewContext);
  const [isHover, setHover] = useState(false);
  const { theme, setTooltipInfo, clearTooltipInfo } = useContext(KonvaGridContext);
  const colors = theme.color;
  const fileList: IAttachmentValue[] = cellValue as IAttachmentValue[];
  const operatingEnable = isActive && editable;
  const fieldId = field.id;
  const pointerName = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer'
  });
  const { renderContent } = renderData;

  const onClick = (e, index: number) => {
    if (e.evt.button !== MouseDownType.Left && e.type !== 'tap') return;
    if (isActive) {
      expandPreviewModal({
        datasheetId,
        recordId,
        fieldId,
        activeIndex: index,
        cellValue: fileList,
        editable: Boolean(editable),
        onChange: onChange!,
        disabledDownload: Boolean(disabledDownload)
      });
    }
  };

  const onMouseEnter = (info: IRenderContentBase) => {
    const { text, x: innerX, y: innerY, width } = info;
    setTooltipInfo({
      title: text,
      visible: true,
      x: x + innerX,
      y: y + innerY,
      width: Math.min(
        width,
        operatingEnable ? columnWidth - GRID_CELL_VALUE_PADDING - GRID_CELL_ADD_ITEM_BUTTON_SIZE - 4 : columnWidth - GRID_CELL_VALUE_PADDING
      ),
      height: 1,
    });
  };

  return (
    <CellScrollContainer
      x={x}
      y={y}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      fieldId={fieldId}
      recordId={recordId}
      renderData={renderData}
    >
      {
        operatingEnable &&
        <Icon
          name={pointerName}
          x={GRID_CELL_VALUE_PADDING}
          y={(rowHeight - 22) / 2}
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
      }
      {
        isActive &&
        renderContent != null &&
        (renderContent as IRenderContentBase[]).map((item, index) => {
          const { x, y, width, height } = item;

          return (
            <Rect
              key={index}
              name={pointerName}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={'transparent'}
              onClick={e => onClick(e, index)}
              onTap={e => onClick(e, index)}
              onMouseEnter={e => onMouseEnter(item)}
              onMouseOut={e => clearTooltipInfo()}
            />
          );
        })
      }
    </CellScrollContainer>
  );
};
