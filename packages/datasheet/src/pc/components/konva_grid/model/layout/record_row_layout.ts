import { CommentBjEntireFilled } from '@vikadata/icons';
import { ILinearRowRecord, RowHeight } from '@apitable/core';
import { GridLayout } from './layout';
import { GRID_GROUP_OFFSET, GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../../constant';

const CommentBjFilledPath = CommentBjEntireFilled.toString();

export class RecordRowLayout extends GridLayout {
  private renderFirstCell({
    row,
    style,
    isActiveRow,
    isCheckedRow,
    isHoverRow,
    isDraggingRow,
    isThisCellWillMove,
    commentCount,
    commentVisible,
    colors
  }) {
    if (!this.isFirst) return;

    const { depth } = row;
    const { fill } = style;
    if (depth) this.renderIndentFront(depth - 1);
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    const groupOffset = depth ? (depth - 1) * GRID_GROUP_OFFSET + 0.5 : 0.5;
    this.rect({
      x: groupOffset,
      y,
      width: GRID_ROW_HEAD_WIDTH + columnWidth - groupOffset + 0.5,
      height: rowHeight,
      fill: isDraggingRow ? colors.lowestBg : colors.white,
      stroke: colors.sheetLineColor
    });
    this.rect({
      x: GRID_ROW_HEAD_WIDTH + groupOffset,
      y: y + 0.5,
      width: columnWidth - groupOffset,
      height: rowHeight - 1,
      fill: fill || 'transparent',
    });
    if (isHoverRow || isCheckedRow || isActiveRow || isThisCellWillMove) {
      let fill = colors.rowSelectedBgSolid;
      if (isDraggingRow) {
        fill = colors.lowestBg;
      } else if (isThisCellWillMove) {
        fill = colors.warnLight;
      } else if (isCheckedRow) {
        fill = colors.cellSelectedColorSolid;
      }
      return this.rect({
        x: groupOffset + 0.5,
        y: y + 0.5,
        width: GRID_ROW_HEAD_WIDTH,
        height: rowHeight - 1,
        fill
      });
    }
    this.setStyle({ fontSize: 13 });
    this.text({
      x: groupOffset + GRID_ROW_HEAD_WIDTH / 2,
      y: y + 10,
      text: String((row as ILinearRowRecord).displayIndex),
      textAlign: 'center',
    });
    if (commentVisible) {
      this.path({
        x: groupOffset + 47.5,
        y: y + (RowHeight.Short - GRID_ICON_COMMON_SIZE) / 2,
        data: CommentBjFilledPath,
        size: GRID_ICON_COMMON_SIZE,
        fill: colors.teal[50],
      });
      this.text({
        x: groupOffset + 48.5 + GRID_ICON_COMMON_SIZE / 2,
        y: y + (RowHeight.Short - 14) / 2,
        text: String(commentCount),
        fillStyle: colors.teal[500],
        textAlign: 'center'
      });
    }
  }

  private renderLastCell({
    row,
    style,
    colors,
  }) {
    if (!this.isLast) return;
    this.renderAddFieldBlank(row);
    if (this.isFirst) return;

    const { depth } = row;
    const { fill, stroke } = style;
    const columnWidth = this.columnWidth;
    const width = depth === 3 ? columnWidth - GRID_GROUP_OFFSET : columnWidth;
    this.rect({ 
      x: this.x, 
      y: this.y,
      width,
      height: this.rowHeight,
      fill: fill || colors.defaultBg,
      stroke: stroke || colors.sheetLineColor
    });
    if (depth > 1) {
      this.renderIndentEnd(depth - 1);
    }
  }

  private renderCommonCell({ style, colors }) {
    if (this.isFirst || this.isLast) return;

    const { fill, stroke } = style;
    this.rect({ 
      x: this.x, 
      y: this.y,
      width: this.columnWidth,
      height: this.rowHeight,
      fill: fill || colors.defaultBg,
      stroke: stroke || colors.sheetLineColor
    });
  }

  render(props) {
    const { 
      row, 
      style,
      isHoverRow,
      isCheckedRow,
      isActiveRow,
      isDraggingRow,
      isThisCellWillMove,
      commentCount,
      commentVisible,
      colors,
    } = props;

    this.renderFirstCell({
      row,
      style,
      isHoverRow,
      isActiveRow,
      isCheckedRow,
      isDraggingRow,
      isThisCellWillMove,
      commentCount,
      commentVisible,
      colors,
    });
    this.renderCommonCell({
      style,
      colors,
    });
    this.renderLastCell({
      row,
      style,
      colors,
    });
  }
}

export const recordRowLayout = new RecordRowLayout();