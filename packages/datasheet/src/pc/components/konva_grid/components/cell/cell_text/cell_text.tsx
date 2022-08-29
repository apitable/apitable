import { FieldType, getTextFieldType, KONVA_DATASHEET_ID, SegmentType, Field, ISegment } from '@vikadata/core';
import { ColumnEmailNonzeroFilled, ColumnPhoneFilled, ColumnUrlOutlined } from '@vikadata/icons';
import { Icon, Text } from 'pc/components/konva_components';
import { ICellProps, KonvaGridContext } from 'pc/components/konva_grid';
import { useEnhanceTextClick } from 'pc/components/multi_grid/cell/hooks/use_enhance_text_click';
import { FC, useContext } from 'react';
import { GRID_CELL_VALUE_PADDING, GRID_ICON_COMMON_SIZE } from '../../../constant';
import { CellScrollContainer } from '../../cell_scroll_container';
import { generateTargetName } from 'pc/components/gantt_view';
import { IRenderContentBase } from '../interface';

// IconPath
const ColumnEmailNonzeroFilledPath = ColumnEmailNonzeroFilled.toString();
const ColumnUrlOutlinedPath = ColumnUrlOutlined.toString();
const ColumnPhoneFilledPath = ColumnPhoneFilled.toString();

const enhanceTextIconMap = {
  [FieldType.URL]: ColumnUrlOutlinedPath,
  [FieldType.Email]: ColumnEmailNonzeroFilledPath,
  [FieldType.Phone]: ColumnPhoneFilledPath,
};

export const CellText: FC<ICellProps> = (props) => {
  const {
    x,
    y,
    recordId,
    field,
    rowHeight,
    columnWidth,
    renderData,
    isActive,
    cellValue,
  } = props;
  const { theme, setTooltipInfo, clearTooltipInfo } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { type: fieldType, id: fieldId } = field;
  const { isEnhanceText } = getTextFieldType(fieldType);
  const _handleEnhanceTextClick = useEnhanceTextClick();
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer'
  });
  const { renderContent } = renderData;

  // 点击链接时校验 URL 合法性
  const handleURLClick = (type: SegmentType | FieldType, text: string, active?: boolean) => {
    if (!active) return;

    const isRecogURLFlag = field.type === FieldType.URL && field.property?.isRecogURLFlag;

    _handleEnhanceTextClick(type, isRecogURLFlag ? Field.bindModel(field).cellValueToString(cellValue as ISegment[]) || '' : text);
  };

  const onMouseEnter = (item: {
    offsetX: number;
    offsetY: number;
    text: string;
    width: number;
    linkUrl: string | null;
  }) => {
    if (field.type === FieldType.URL && field.property?.isRecogURLFlag && !!cellValue) {
      const { offsetX: innerX, offsetY: innerY, width } = item;
      const text = Field.bindModel(field).cellValueToString(cellValue as ISegment[]) || '';
      setTooltipInfo({
        title: text,
        visible: true,
        x: x + innerX,
        y: y + innerY,
        width,
        height: 1,
      });
    }
  };

  const renderText = () => {
    if (renderContent == null) return null;
    const { width, height, text: entityText, textData, style } = renderContent as IRenderContentBase;
    const linkEnable = style?.textDecoration === 'underline';
    const commonProps = {
      name,
      lineHeight: 1.84,
      ellipsis: false,
      verticalAlign: 'top',
      align: style?.textAlign || 'left',
      fontStyle: style?.fontWeight || 'normal',
    };

    return (
      <>
        {
          textData == null ?
            <Text
              x={GRID_CELL_VALUE_PADDING}
              y={4.5}
              width={width}
              heigh={height}
              text={entityText}
              wrap={'word'}
              fill={colors.firstLevelText}
              {...commonProps}
              onMoun
            /> :
            textData.map((item, index) => {
              const { offsetX, offsetY, text, linkUrl } = item;
              const listening = linkEnable || Boolean(linkUrl);
              return (
                <Text
                  key={index}
                  x={offsetX + GRID_CELL_VALUE_PADDING}
                  y={offsetY + 4.5}
                  heigh={24}
                  text={text}
                  listening={listening}
                  textDecoration={listening ? 'underline' : ''}
                  fill={listening ? colors.primaryColor : colors.firstLevelText}
                  {...commonProps}
                  onClick={() => handleURLClick(fieldType, linkEnable ? entityText : linkUrl!, isActive)}
                  onTap={() => handleURLClick(fieldType, linkEnable ? entityText : linkUrl!, isActive)}
                  onMouseEnter={() => onMouseEnter(item)}
                  onMouseOut={() => clearTooltipInfo()}
                />
              );
            })
        }
        {
          isEnhanceText && 
          <Icon 
            name={name}
            x={columnWidth - GRID_ICON_COMMON_SIZE - GRID_CELL_VALUE_PADDING - 4}
            y={height - GRID_ICON_COMMON_SIZE}
            size={GRID_ICON_COMMON_SIZE}
            backgroundWidth={24}
            backgroundHeight={20}
            background={colors.defaultBg}
            data={enhanceTextIconMap[fieldType]}
            onClick={() => handleURLClick(fieldType, entityText, isActive)}
            onTap={() => handleURLClick(fieldType, entityText, isActive)}
            scaleX={0.8}
            scaleY={0.8}
            transformsEnabled={'all'}
            listening={linkEnable}
          />
        }
      </>
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
      renderData={renderData}
    >
      {
        isActive &&
        renderText()
      }
    </CellScrollContainer>
  );
};