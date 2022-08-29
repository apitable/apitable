import { Field, IField, KONVA_DATASHEET_ID, Strings, t, ViewType } from '@vikadata/core';
import { EditGanttDescribeFilled, IIconProps, MoreStandOutlined, WarningTriangleNonzeroFilled } from '@vikadata/icons';
import dynamic from 'next/dynamic';
import { generateTargetName } from 'pc/components/gantt_view';
import { autoSizerCanvas, Icon, Rect, Text } from 'pc/components/konva_components';
import { GRID_CELL_VALUE_PADDING, GRID_ICON_COMMON_SIZE, KonvaGridContext } from 'pc/components/konva_grid';
import { FC, memo, useContext, useMemo, useRef } from 'react';
import { GRID_FIELD_HEAD_HEIGHT } from '../../constant';
import { FieldIcon } from './field_icon';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
interface IFieldHeadProps {
  x?: number;
  y?: number;
  width: number;
  height: number;
  field: IField;
  columnIndex: number;
  iconVisible: boolean; // 是否显示图标，鼠标移入时显示，否则隐藏
  permissionInfo?: (string | FC<IIconProps>)[] | null;
  isSelected: boolean;
  isHighlight: boolean;
  editable: boolean;
  autoHeadHeight: boolean;
  viewType: ViewType;
  stroke?: string;
  isFrozen?: boolean;
}

const SMALL_ICON_SIZE = 12;

// IconPath
const MoreStandOutlinedPath = MoreStandOutlined.toString();
const EditDescribeFilledPath = EditGanttDescribeFilled.toString();
const WarningTriangleNonzeroFilledPath = WarningTriangleNonzeroFilled.toString();

export const FieldHead: FC<IFieldHeadProps> = memo((props) => {
  const {
    x = 0, y = 0, width, field, iconVisible, isSelected, height: headHeight,
    isHighlight, editable, stroke, permissionInfo, isFrozen, autoHeadHeight: _autoHeadHeight, viewType
  } = props;
  const { theme, setTooltipInfo, clearTooltipInfo } = useContext(KonvaGridContext);
  const textSizer = useRef(autoSizerCanvas);
  const colors = theme.color;
  const { id: fieldId, name: _fieldName } = field;
  const textOffset = GRID_CELL_VALUE_PADDING + GRID_ICON_COMMON_SIZE + 4;
  const textWidth = width - textOffset - GRID_CELL_VALUE_PADDING;
  const autoHeadHeight = _autoHeadHeight && headHeight !== GRID_FIELD_HEAD_HEIGHT;
  // 「默认列头高度」模式下，换行符转成空格完整显示
  const fieldName = _autoHeadHeight ? _fieldName : _fieldName.replace(/\r|\n/g, ' ');

  let iconTotalWidth = 8;
  let moreIconOffset = 0;
  let descIconOffset = 0;
  let errorIconOffset = 0;
  let permissionIconOffset = 0;
  let iconBgOffsetX = 0;

  const moreVisible = editable && iconVisible;
  if (moreVisible) {
    moreIconOffset = width - iconTotalWidth - GRID_ICON_COMMON_SIZE;
    iconTotalWidth = iconTotalWidth + GRID_ICON_COMMON_SIZE;
    iconBgOffsetX = 4;
  }

  const permissionVisible = permissionInfo && iconVisible;
  if (permissionVisible) {
    permissionIconOffset = width - iconTotalWidth - 20;
    iconTotalWidth = iconTotalWidth + 20;
    iconBgOffsetX = 8;
  }

  const descVisible = iconVisible && Boolean(field.desc);
  if (descVisible) {
    descIconOffset = width - iconTotalWidth - SMALL_ICON_SIZE;
    iconTotalWidth = iconTotalWidth + SMALL_ICON_SIZE;
    iconBgOffsetX = 8;
  }

  const hasError = Field.bindModel(field).isComputed && Field.bindModel(field).hasError;
  if (hasError) {
    errorIconOffset = width - iconTotalWidth - GRID_ICON_COMMON_SIZE;
    iconTotalWidth = iconTotalWidth + GRID_ICON_COMMON_SIZE;
    iconBgOffsetX = 8;
  }

  const isOverflow = useMemo(() => {
    if (autoHeadHeight) return false;
    textSizer.current.setFont({ fontWeight: 'bold', fontSize: 13 });
    const { isOverflow } = textSizer.current.measureText(fieldName, textWidth, 1);
    return isOverflow;
  }, [fieldName, textWidth, autoHeadHeight]);

  const onTooltipShown = (title: string, iconSize: number, offsetX: number) => {
    return setTooltipInfo({
      title,
      visible: true,
      width: iconSize,
      height: iconSize,
      x: x + offsetX,
      y: (headHeight - iconSize) / 2,
      coordXEnable: !isFrozen,
      coordYEnable: false,
    });
  };

  const isGanttNoWrap = viewType === ViewType.Gantt && !autoHeadHeight;

  return (
    <Group
      x={x}
      y={y}
    >
      <Rect
        x={0.5}
        y={0.5}
        name={generateTargetName({
          targetName: KONVA_DATASHEET_ID.GRID_FIELD_HEAD,
          fieldId,
        })}
        width={width}
        height={headHeight}
        fill={isSelected ? colors.cellSelectedColorSolid : colors.defaultBg}
        stroke={stroke || colors.sheetLineColor}
        strokeWidth={1}
        onMouseEnter={() => {
          if (!isOverflow) return;
          onTooltipShown(fieldName, SMALL_ICON_SIZE, (width - SMALL_ICON_SIZE) / 2);
        }}
        onMouseOut={clearTooltipInfo}
      />
      <FieldIcon
        fieldType={field.type}
        x={GRID_CELL_VALUE_PADDING}
        y={autoHeadHeight ? 8 : (headHeight - GRID_ICON_COMMON_SIZE) / 2}
        width={GRID_ICON_COMMON_SIZE}
        height={GRID_ICON_COMMON_SIZE}
        fill={isHighlight ? colors.primaryColor : colors.secondLevelText}
      />
      <Text
        x={textOffset}
        y={autoHeadHeight ? 5 : (isGanttNoWrap ? (headHeight - GRID_FIELD_HEAD_HEIGHT) / 2 : undefined)}
        width={width - GRID_CELL_VALUE_PADDING * 2 - GRID_ICON_COMMON_SIZE}
        height={isGanttNoWrap ? GRID_FIELD_HEAD_HEIGHT : headHeight + 2}
        text={fieldName}
        wrap={'char'}
        fontStyle={'bold'}
        lineHeight={1.84}
        verticalAlign={autoHeadHeight ? 'top' : 'middle'}
        fill={isHighlight ? colors.primaryColor : colors.firstLevelText}
      />
      {
        iconTotalWidth > 8 &&
        <Rect
          x={width - iconTotalWidth - iconBgOffsetX}
          y={1}
          width={iconTotalWidth + iconBgOffsetX}
          height={headHeight - 1}
          fill={isSelected ? colors.cellSelectedColorSolid : colors.defaultBg}
          listening={false}
        />
      }
      {
        hasError &&
        <Icon
          name={generateTargetName({
            targetName: KONVA_DATASHEET_ID.GRID_FIELD_HEAD,
            fieldId,
            mouseStyle: 'pointer'
          })}
          x={errorIconOffset}
          y={autoHeadHeight ? 8 : (headHeight - GRID_ICON_COMMON_SIZE) / 2}
          size={GRID_ICON_COMMON_SIZE}
          data={WarningTriangleNonzeroFilledPath}
          fill={colors.warningColor}
          background={isSelected ? colors.cellSelectedColorSolid : colors.defaultBg}
          backgroundWidth={24}
          backgroundHeight={GRID_ICON_COMMON_SIZE}
          onMouseEnter={() => onTooltipShown(t(Strings.field_configuration_err), GRID_ICON_COMMON_SIZE, errorIconOffset)}
          onMouseOut={clearTooltipInfo}
        />
      }
      {
        descVisible &&
        <Icon
          name={generateTargetName({
            targetName: KONVA_DATASHEET_ID.GRID_FIELD_HEAD_DESC,
            fieldId,
          })}
          x={descIconOffset}
          y={autoHeadHeight ? 10 : (headHeight - SMALL_ICON_SIZE) / 2}
          size={GRID_ICON_COMMON_SIZE}
          shape={'circle'}
          data={EditDescribeFilledPath}
          fill={colors.primaryColor}
          background={colors.rc01}
          backgroundWidth={SMALL_ICON_SIZE}
          backgroundHeight={SMALL_ICON_SIZE}
          opacity={0.2}
          onMouseEnter={() => onTooltipShown(field.desc || '', SMALL_ICON_SIZE, descIconOffset)}
          onMouseOut={clearTooltipInfo}
        />
      }
      {
        permissionVisible &&
        <Icon
          name={generateTargetName({
            targetName: KONVA_DATASHEET_ID.GRID_FIELD_HEAD,
            fieldId,
            mouseStyle: 'pointer'
          })}
          x={permissionIconOffset}
          y={autoHeadHeight ? 8 : (headHeight - GRID_ICON_COMMON_SIZE) / 2}
          size={GRID_ICON_COMMON_SIZE}
          data={permissionInfo[0].toString()}
          fill={isSelected ? colors.primaryColor : colors.thirdLevelText}
          background={isSelected ? colors.cellSelectedColorSolid : colors.defaultBg}
          backgroundWidth={24}
          backgroundHeight={GRID_ICON_COMMON_SIZE}
          onMouseEnter={() => onTooltipShown((permissionInfo?.[1] as string) || '', GRID_ICON_COMMON_SIZE, permissionIconOffset)}
          onMouseOut={clearTooltipInfo}
        />
      }
      {
        moreVisible &&
        <Icon
          name={generateTargetName({
            targetName: KONVA_DATASHEET_ID.GRID_FIELD_HEAD_MORE,
            fieldId,
          })}
          x={moreIconOffset}
          y={autoHeadHeight ? 8 : (headHeight - GRID_ICON_COMMON_SIZE) / 2}
          data={MoreStandOutlinedPath}
          fill={(isSelected || isHighlight) ? colors.primaryColor : colors.fourthLevelText}
          background={isSelected ? colors.cellSelectedColorSolid : colors.defaultBg}
          backgroundWidth={GRID_ICON_COMMON_SIZE}
          backgroundHeight={GRID_ICON_COMMON_SIZE}
        />
      }
      {
        isHighlight &&
        <Rect
          x={1}
          width={width - 1}
          height={2}
          fill={colors.primaryColor}
          listening={false}
        />
      }
    </Group>
  );
});
