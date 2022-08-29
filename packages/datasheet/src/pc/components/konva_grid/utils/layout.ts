import { ILinearRowRecord, RowHeightLevel, Strings, t, RowHeight, CellType } from '@vikadata/core';
import { AddOutlined, CommentBjEntireFilled, LockNonzeroOutlined } from '@vikadata/icons';
import { colors } from '@vikadata/components';
import { GRID_GROUP_OFFSET, GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../constant';
import { IRenderStyleProps } from '../interface';
import { cellHelper } from './cell_helper';
import { KonvaDrawer } from './drawer';
import { IRenderEndBlankProps } from './interface';

const AddOutlinedPath = AddOutlined.toString();
const CommentBjFilledPath = CommentBjEntireFilled.toString();
const LockNonzeroOutlinedPath = LockNonzeroOutlined.toString();

class GridLayout extends KonvaDrawer {
  public renderGroupTab(props) {
    const {
      x,
      y,
      columnWidth,
      rowHeight,
      row,
      groupField,
      groupLength,
      isFrozenField,
      isLastField,
      isCryptoField,
      cellValue, 
      viewType,
      unitTitleMap,
      cacheTheme
    } = props;
    const { recordId, depth } = row;
    const lastTabOffsetList = [40, 0, - GRID_GROUP_OFFSET];
    const groupOffset = depth * GRID_GROUP_OFFSET + 0.5;
    const background = this.getGroupBgByDepth(depth, groupLength);

    if (isLastField) {
      this.renderEndBlank({
        x: x + columnWidth,
        y,
        height: rowHeight,
        groupLength,
        depth,
        type: CellType.GroupTab
      });
    }

    if (isFrozenField) {
      if (depth) this.renderIndentFront({ x, y, rowHeight, columnWidth, depth, groupLength });
      this.rect({
        x: groupOffset,
        y,
        width: columnWidth - groupOffset + GRID_ROW_HEAD_WIDTH + 0.5,
        height: rowHeight,
        fill: background,
        stroke: colors.sheetLineColor
      });
      this.ctx.save();

      // 兼容分组条件列数据错误的情况
      if (groupField == null && !isCryptoField) {
        this.setStyle({ fontSize: 14 });
        this.text({
          x: groupOffset + 35,
          y: y + (rowHeight - 14) / 2,
          text: t(Strings.group_field_error_tips),
          fillStyle: colors.thirdLevelText,
          fontSize: 14
        });
        return this.ctx.restore(); 
      }

      if (isCryptoField) {
        this.setStyle({ fontSize: 14 });
        this.text({
          x: groupOffset + 35,
          y: y + (rowHeight - 14) / 2,
          text: t(Strings.crypto_field),
          fillStyle: colors.thirdLevelText,
          fontSize: 14
        });
        this.path({
          x: groupOffset + 120.5,
          y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
          data: LockNonzeroOutlinedPath,
          size: GRID_ICON_COMMON_SIZE,
          fill: colors.fourthLevelText,
        });
        return this.ctx.restore();
      }

      this.setStyle({ fontSize: 12 });
      this.text({
        x: groupOffset + 35,
        y: y + 6,
        text: groupField.name,
        fillStyle: colors.thirdLevelText,
        fontSize: 12,
      });
      if (cellValue != null) {
        this.setStyle({ fontSize: 13 });
        this.ctx.rect(groupOffset + 25.5, y + 17.5, columnWidth, rowHeight - 18);
        this.ctx.clip();
        const renderProps = {
          x: groupOffset + 25.5,
          y: y + 17.5,
          columnWidth,
          rowHeight: rowHeight - 18,
          recordId,
          field: groupField,
          cellValue,
          isActive: false,
          style: { textAlign: 'left' } as IRenderStyleProps,
          rowHeightLevel: RowHeightLevel.Short,
          viewType,
          unitTitleMap,
          cacheTheme
        };
        cellHelper.renderCellValue(renderProps, this.ctx);
        return this.ctx.restore();
      }
      this.setStyle({ fontSize: 14 });
      this.text({
        x: groupOffset + 36,
        y: y + 24,
        text: `(${cellValue === null ? t(Strings.content_is_empty) : t(Strings.data_error)})`,
        fillStyle: colors.thirdLevelText,
        fontSize: 14,
      });
      return this.ctx.restore();
    }
    if (isLastField) {
      if (depth) this.renderIndentEnd({ x, y, rowHeight, columnWidth, depth, groupLength });
      const width = columnWidth + lastTabOffsetList[depth];
      this.rect({
        x,
        y: y + 0.5,
        width,
        height: rowHeight,
        fill: background,
      });
      return this.line({
        x,
        y,
        points: [0, 0, width, 0, width, rowHeight, 0, rowHeight],
        stroke: colors.sheetLineColor,
      });
    }
    this.rect({
      x,
      y,
      width: columnWidth,
      height: rowHeight,
      fill: background
    });
    this.line({
      x,
      y,
      points: [0, 0, columnWidth, 0],
      stroke: colors.sheetLineColor,
    });
    this.line({
      x,
      y,
      points: [0, rowHeight, columnWidth, rowHeight],
      stroke: colors.sheetLineColor,
    });
  }

  public getGroupBgByDepth(depth: number, groupLength: number) {
    if (!groupLength) return colors.defaultBg;

    const bgList: string[] = [colors.defaultBg];
    if (groupLength > 1) bgList.unshift(colors.fc8);
    if (groupLength > 2) bgList.unshift(colors.highBg);
    return bgList[depth];
  }

  public renderAdd(props) {
    const {
      x,
      y,
      columnWidth,
      rowHeight,
      row,
      isFrozenField,
      isLastField,
      rowCreatable,
      groupLength,
      isHoveredRow,
      isHoverField
    } = props;
    const { depth } = row;
    const fill = (isHoveredRow && rowCreatable) ? colors.rowSelectedBgSolid : colors.defaultBg;
    this.ctx.save();
    this.setStyle({ fontWeight: 'normal' });
    if (isFrozenField) {
      if (depth) this.renderIndentFront({ x, y, rowHeight, columnWidth, depth: depth - 1, groupLength });
      const frozenOffset = !depth ? 0.5 : (depth - 1) * GRID_GROUP_OFFSET + 0.5;
      this.rect({
        x: frozenOffset,
        y: y + 0.5,
        width: columnWidth + GRID_ROW_HEAD_WIDTH - frozenOffset + 1,
        height: rowHeight,
        fill
      });
      this.line({
        x: frozenOffset,
        y,
        points: [0, 0, 0, rowHeight, columnWidth + GRID_ROW_HEAD_WIDTH - frozenOffset + 1, rowHeight],
        stroke: colors.sheetLineColor,
      });
      if (rowCreatable) {
        const curX = depth ? (depth - 1) * GRID_GROUP_OFFSET + 30 : 30;
        this.path({
          x: curX,
          y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
          data: AddOutlinedPath,
          size: 16,
          fill: colors.thirdLevelText,
        });
        if (isHoverField && isHoveredRow) {
          this.text({
            x: curX + 18,
            y: y + rowHeight / 2,
            verticalAlign: 'middle',
            text: t(Strings.add_row_button_tip),
            fillStyle: colors.black[500],
          });
        }
      }
    }

    const width = (!isFrozenField && isLastField && depth === 3) ? columnWidth - GRID_GROUP_OFFSET : columnWidth;

    if (!isFrozenField) {
      this.rect({
        x,
        y: y + 0.5,
        width,
        height: rowHeight,
        fill
      });
      this.line({
        x,
        y: y + rowHeight,
        points: [0, 0, width, 0],
        stroke: colors.sheetLineColor,
      });
      if (rowCreatable && isHoverField && isHoveredRow) {
        this.path({
          x: x + 8.5,
          y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
          data: AddOutlinedPath,
          size: 16,
          fill: colors.thirdLevelText,
        });
        this.text({
          x: x + 26.5,
          y: y + rowHeight / 2,
          verticalAlign: 'middle',
          text: t(Strings.add_row_button_tip),
          fillStyle: colors.black[500],
        });
      }
    }
    this.ctx.restore();

    if (isLastField && !isFrozenField && depth >= 1) {
      this.renderIndentEnd({ x, y, rowHeight, columnWidth, depth: depth - 1, groupLength });
    }

    if (isLastField && depth >= 1) {
      this.line({
        x: x + width,
        y,
        points: [0, 0, 0, rowHeight],
        stroke: colors.sheetLineColor,
      });
    }

    if (isLastField) {
      this.renderEndBlank({
        x: x + columnWidth,
        y,
        height: rowHeight,
        groupLength,
        depth,
        type: CellType.Add
      });
    }
  }

  public renderBlank(props) {
    const {
      x,
      y,
      columnWidth,
      rowHeight,
      row,
      groupLength,
      isFrozenField,
      isLastField,
    } = props;
    const { depth } = row;
    if (depth === 0) {
      return isFrozenField && this.rect({
        x: 0.5,
        y: y + 0.5,
        width: columnWidth + GRID_ROW_HEAD_WIDTH + 0.5,
        height: rowHeight,
        fill: colors.lowestBg
      });
    }
    if (isFrozenField) this.renderIndentFront({ x, y, rowHeight, columnWidth, depth, groupLength });
    if (!isFrozenField && isLastField) this.renderIndentEnd({ x, y, rowHeight, columnWidth, depth, groupLength });
    const addOffset = (depth - 1) * GRID_GROUP_OFFSET + 0.5;
    const realX = isFrozenField ? addOffset : x;
    let width = isFrozenField ? columnWidth + GRID_ROW_HEAD_WIDTH - addOffset : columnWidth;
    if (isLastField && depth === 1) width += 39;
    this.rect({
      x: realX + 0.5,
      y: y + 0.5,
      width: width + 0.5,
      height: rowHeight,
      fill: this.getGroupBgByDepth(depth - 1, groupLength)
    });
    this.line({
      x: realX + 0.5,
      y,
      points: [0, rowHeight, width, rowHeight],
      stroke: colors.sheetLineColor,
    });
    if (isFrozenField && isLastField) {
      this.renderEndBlank({
        x: x + columnWidth,
        y,
        height: rowHeight,
        groupLength,
        depth,
        type: CellType.Blank
      });
    }
    if (!isFrozenField && isLastField && depth === 2) {
      this.line({
        x: x + columnWidth,
        y,
        points: [0, 0, 0, rowHeight],
        stroke: colors.sheetLineColor,
      });
    }
  }

  public renderCell(props) {
    const {
      x,
      y,
      columnWidth,
      rowHeight,
      row,
      groupLength,
      isFrozenField,
      isLastField,
      isHoveredRow,
      isCheckedRow,
      isActiveRow,
      isThisCellWillMove,
      isActive,
      isDraggingRow,
      commentCount,
      commentVisible,
      style,
    } = props;
    const { depth } = row;
    const { fill, stroke } = style;
    // 是否需要缩进
    const indent = isFrozenField && depth;
    const lastIndent = isLastField && depth === 3;
    const groupRecordOffset = indent ? (depth - 1) * GRID_GROUP_OFFSET + 0.5 : 0.5;
    if (isFrozenField) {
      if (depth) this.renderIndentFront({ x, y, rowHeight, columnWidth, depth: depth - 1, groupLength });
      this.rect({
        x: groupRecordOffset,
        y,
        width: GRID_ROW_HEAD_WIDTH + columnWidth - groupRecordOffset + 0.5,
        height: rowHeight,
        fill: isDraggingRow ? colors.lowestBg : colors.defaultBg,
        stroke: colors.sheetLineColor
      });

      this.rect({
        x: GRID_ROW_HEAD_WIDTH + groupRecordOffset,
        y: y + 0.5,
        width: columnWidth - groupRecordOffset,
        height: rowHeight - 1,
        fill: fill || 'transparent',
      });
      if (isHoveredRow || isCheckedRow || isActiveRow || isThisCellWillMove) {
        let fill: string = colors.highBg;
        if (isDraggingRow) {
          fill = colors.lowestBg;
        } else if (isThisCellWillMove) {
          fill = colors.warnLight;
        } else if (isCheckedRow) {
          fill = colors.cellSelectedColorSolid;
        }
        this.rect({
          x: groupRecordOffset + 0.5,
          y: y + 0.5,
          width: GRID_ROW_HEAD_WIDTH,
          height: rowHeight - 1,
          fill
        });
      } else {
        this.ctx.save();
        this.setStyle({ fontSize: 13 });
        this.text({
          x: groupRecordOffset + GRID_ROW_HEAD_WIDTH / 2,
          y: y + 10,
          text: String((row as ILinearRowRecord).displayIndex),
          textAlign: 'center',
        });
        if (commentVisible) {
          this.path({
            x: groupRecordOffset + 47.5,
            y: y + (RowHeight.Short - GRID_ICON_COMMON_SIZE) / 2,
            data: CommentBjFilledPath,
            size: GRID_ICON_COMMON_SIZE,
            fill: colors.teal[50],
          });
          this.text({
            x: groupRecordOffset + 48.5 + GRID_ICON_COMMON_SIZE / 2,
            y: y + (RowHeight.Short - 14) / 2,
            text: String(commentCount),
            fillStyle: colors.teal[500],
            textAlign: 'center'
          });
        }
        this.ctx.restore();
      }
    } else {
      this.rect({
        x,
        y,
        width: lastIndent ? columnWidth - GRID_GROUP_OFFSET : columnWidth,
        height: rowHeight,
        fill: fill || colors.defaultBg,
        stroke: isActive ? 'transparent' : (stroke || colors.sheetLineColor)
      });
    }

    if (isLastField && !isFrozenField && depth > 1) {
      this.renderIndentEnd({ x, y, rowHeight, columnWidth, depth: depth - 1, groupLength });
    }

    if (isLastField) {
      this.renderEndBlank({
        x: x + columnWidth,
        y,
        height: rowHeight,
        groupLength,
        depth,
        type: CellType.Record
      });
    }
  }

  // 渲染 “添加列“ 的空白 UI
  private renderEndBlank(props: IRenderEndBlankProps) {
    const { x, y, height, groupLength, depth, type } = props;
    const blankWidth = groupLength ? 40 : 100;
    const background = this.getGroupBgByDepth(0, groupLength);
    this.rect({
      x: x + 0.5,
      y: y - 0.5,
      width: blankWidth,
      height: height + 1,
      fill: background,
    });
    this.line({
      x,
      y,
      points: [blankWidth, 0, blankWidth, height],
      stroke: colors.sheetLineColor
    });
    if (depth === 0 && type === CellType.GroupTab) {
      this.line({
        x,
        y,
        points: [0, 0, blankWidth, 0],
        stroke: colors.sheetLineColor
      });
    }
    if (depth <= 1 && [CellType.Add, CellType.Blank].includes(type)) {
      this.line({
        x,
        y,
        points: [0, height, blankWidth, height],
        stroke: colors.sheetLineColor
      });
    }
  }

  public getCellHorizontalPos(props) {
    const {
      depth,
      columnWidth,
      columnIndex,
      columnLength
    } = props;
    if (!depth) return { width: columnWidth, offset: 0 };
    const indent = columnIndex === 0 && depth;
    const lastIndent = columnIndex === columnLength - 1 && depth === 3;
    const offset = indent ? (depth - 1) * GRID_GROUP_OFFSET + 0.5 : 0;

    return {
      width: lastIndent ? columnWidth - GRID_GROUP_OFFSET : columnWidth - offset,
      offset
    };
  }

  public getCellOffsetLeft(depth) {
    if (!depth) return 0;
    if (depth > 1) return (depth - 1) * GRID_GROUP_OFFSET;
    return 0;
  }

  // 渲染头部的缩进区域
  private renderIndentFront(props) {
    const { y, rowHeight, depth, groupLength } = props;
    for (let i = 0; i < depth; i++) {
      this.rect({
        x: i * GRID_GROUP_OFFSET,
        y: y - 0.5,
        width: GRID_GROUP_OFFSET,
        height: rowHeight,
        fill: this.getGroupBgByDepth(i, groupLength),
      });
      this.line({
        x: i * GRID_GROUP_OFFSET + 0.5,
        y,
        points: [0, 0, 0, rowHeight],
        stroke: colors.sheetLineColor,
      });
    }
  }

  // 渲染末尾的缩进区域
  private renderIndentEnd(props) {
    const { x, y, rowHeight, columnWidth, depth, groupLength } = props;
    const tabSizeList = [40, GRID_GROUP_OFFSET, 0];
    for (let i = 0; i < depth; i++) {
      const rectOffsetX = i === 0 ? 0 : - GRID_GROUP_OFFSET;
      const lineOffsetX = i === 0 ? 40 : 0;
      this.rect({
        x: x + columnWidth + rectOffsetX + 0.5,
        y: y - 0.5,
        width: tabSizeList[i],
        height: rowHeight,
        fill: this.getGroupBgByDepth(i, groupLength),
      });
      this.line({
        x: x + columnWidth + lineOffsetX,
        y,
        points: [0, 0, 0, rowHeight],
        stroke: colors.sheetLineColor,
      });
    }
  }
}

export const gridLayout = new GridLayout();