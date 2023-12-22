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

// FIXME:THEME
import GraphemeSplitter from 'grapheme-splitter';
import { colors, ThemeName } from '@apitable/components';
import { IHyperlinkSegment, ISegment, SegmentType } from '@apitable/core';
import { UserGroupOutlined, WebOutlined } from '@apitable/icons';
import { assertSignatureManager } from '@apitable/widget-sdk';
import { AvatarSize, AvatarType, getAvatarRandomColor, getFirstWordFromString } from 'pc/components/common';
import { autoSizerCanvas } from 'pc/components/konva_components';
import { createAvatarRainbowColorsArr } from 'pc/utils/color_utils';
import { getEnvVariables } from 'pc/utils/env';
import { getTextWidth, textDataCache } from './get_text_width';
import { imageCache } from './image_cache';
import {
  ICtxStyleProps,
  IImageProps,
  ILabelProps,
  ILineProps,
  ILinkData,
  IRectProps,
  ITextEllipsisProps,
  ITextProps,
  IWrapTextDataProps,
  IWrapTextProps,
} from './interface';

export const graphemeSplitter = new GraphemeSplitter();
const DepartmentOutlinedPath = UserGroupOutlined.toString();
const WebOutlinedPath = WebOutlined.toString();

const DEFAULT_FONT_FAMILY = `"Segoe UI", Roboto, "Helvetica Neue", Arial, 
"Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;

/**
 * Some business methods based on the native canvas API wrapper
 */
export class KonvaDrawer {
  ctx: CanvasRenderingContext2D = autoSizerCanvas.context!;
  needDraw = false;

  public initCtx(ctx: CanvasRenderingContext2D) {
    this.needDraw = Boolean(ctx);
    this.ctx = ctx || autoSizerCanvas.context!;
    /**
     * textBaseline is specified as middle, compatible with browser differences
     */
    this.ctx.textBaseline = 'middle';
  }

  public setStyle(props: ICtxStyleProps) {
    const { fontSize, fontWeight, fillStyle, strokeStyle } = props;

    if (fontSize || fontWeight) {
      this.ctx.font = `${fontWeight || 'normal'} ${fontSize || 13}px ${DEFAULT_FONT_FAMILY}`;
    }

    if (fillStyle) {
      this.ctx.fillStyle = fillStyle;
    }

    if (strokeStyle) {
      this.ctx.strokeStyle = strokeStyle;
    }
  }

  public textEllipsis(props: ITextEllipsisProps) {
    const { text, maxWidth, fontSize = 13, fontWeight = 'normal' } = props;

    if (text == null)
      return {
        text: '',
        textWidth: 0,
        isEllipsis: false,
      };
    const fontStyle = `${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;

    if (!maxWidth) {
      return {
        text,
        textWidth: getTextWidth(this.ctx, text, fontStyle),
        isEllipsis: false,
      };
    }

    const ellipsis = '…';
    const textSize = text.length;
    // Predetermine the threshold width of the incoming text
    let guessSize = Math.ceil(maxWidth / fontSize);
    let guessText = text.substr(0, guessSize);
    let guessWidth = getTextWidth(this.ctx, guessText, fontStyle);

    while (guessWidth <= maxWidth) {
      if (textSize <= guessSize) {
        return {
          text,
          textWidth: guessWidth,
          isEllipsis: false,
        };
      }
      guessSize++;
      guessText = text.substr(0, guessSize);
      guessWidth = getTextWidth(this.ctx, guessText, fontStyle);
    }

    const ellipsisWidth = getTextWidth(this.ctx, ellipsis, fontStyle);
    while (guessSize >= 0 && guessWidth + ellipsisWidth > maxWidth) {
      guessSize--;
      guessText = text.substr(0, guessSize);
      guessWidth = getTextWidth(this.ctx, guessText, fontStyle);
    }

    return {
      text: `${guessText || text[0]}${ellipsis}`,
      textWidth: maxWidth,
      isEllipsis: true,
    };
  }

  public line(props: ILineProps) {
    const { x, y, points, stroke, closed = false } = props;
    const length = points.length;

    this.ctx.save();
    this.ctx.beginPath();
    if (stroke) this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = 1;
    this.ctx.translate(x, y);
    this.ctx.moveTo(points[0], points[1]);

    for (let n = 2; n < length; n += 2) {
      this.ctx.lineTo(points[n], points[n + 1]);
    }

    if (closed) {
      this.ctx.closePath();
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  public rect(props: IRectProps) {
    const { x, y, width, height, radius, fill, stroke } = props;

    this.ctx.beginPath();
    if (fill) this.setStyle({ fillStyle: fill });
    if (stroke) this.setStyle({ strokeStyle: stroke });

    if (!radius) {
      this.ctx.rect(x, y, width, height);
    } else {
      let topLeft = 0;
      let topRight = 0;
      let bottomLeft = 0;
      let bottomRight = 0;

      if (typeof radius === 'number') {
        topLeft = topRight = bottomLeft = bottomRight = Math.min(radius, width / 2, height / 2);
      } else {
        topLeft = Math.min(radius[0] || 0, width / 2, height / 2);
        topRight = Math.min(radius[1] || 0, width / 2, height / 2);
        bottomRight = Math.min(radius[2] || 0, width / 2, height / 2);
        bottomLeft = Math.min(radius[3] || 0, width / 2, height / 2);
      }

      this.ctx.moveTo(x + topLeft, y);
      this.ctx.lineTo(x + width - topRight, y);
      this.ctx.arc(x + width - topRight, y + topRight, topRight, (Math.PI * 3) / 2, 0, false);
      this.ctx.lineTo(x + width, y + height - bottomRight);
      this.ctx.arc(x + width - bottomRight, y + height - bottomRight, bottomRight, 0, Math.PI / 2, false);
      this.ctx.lineTo(x + bottomLeft, y + height);
      this.ctx.arc(x + bottomLeft, y + height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
      this.ctx.lineTo(x, y + topLeft);
      this.ctx.arc(x + topLeft, y + topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
    }

    this.ctx.closePath();

    if (fill) {
      this.ctx.fill();
    }
    if (stroke) {
      this.ctx.stroke();
    }
  }

  public wrapText(props: IWrapTextProps) {
    const {
      x,
      y,
      text,
      maxWidth,
      lineHeight,
      maxRow = 1,
      fontSize = 13,
      fillStyle = colors.firstLevelText,
      textAlign = 'left',
      verticalAlign = 'top',
      fontWeight = 'normal',
      textDecoration = 'none',
      originValue = [],
      isLinkSplit = false,
      fieldType,
      needDraw = false,
      favicon,
    } = props;
    let offsetX = 0 + (favicon ? 24 : 0);
    let offsetY = 0;
    const baselineOffset = verticalAlign === 'top' ? fontSize / 2 : 0;
    const fontStyle = `${fontWeight}-${fontSize}px`;
    const isUnderline = textDecoration === 'underline';
    const textRenderer = (textDataList: any[]) => {
      textDataList.forEach((data) => {
        const { offsetX, offsetY, text, width, linkUrl } = data;
        this.ctx.fillText(text, x + offsetX, y + offsetY + baselineOffset);
        if (linkUrl || isUnderline) {
          this.line({
            x: x + offsetX,
            y: y + offsetY + 0.5,
            points: [0, fontSize, width, fontSize],
            stroke: fillStyle,
          });
        }
      });
    };

    if (fillStyle) this.setStyle({ fillStyle });
    this.ctx.textAlign = textAlign;

    const cacheKey = `${fontStyle}-${maxRow}-${maxWidth || 0}-${fieldType}-${text}`;
    const cacheTextData = textDataCache.get(cacheKey);
    if (cacheTextData) {
      if (this.needDraw && needDraw) {
        favicon &&
          this.image(
            {
              x,
              y: y - 3,
              url: favicon,
              width: 16,
              height: 16,
            },
            true,
            true,
          );
        textRenderer(cacheTextData.data);
      }
      return cacheTextData;
    }

    const resultData: IWrapTextDataProps = [];
    // Accurate segmentation of strings containing emoji
    const arrText = graphemeSplitter.splitGraphemes(text);
    const textLength = arrText.length;
    const ellipsisWidth = this.ctx.measureText('…').width;
    let showText = ''; // Text displayed for each segment
    let showTextWidth = 0; // Width of each segment
    let showLineWidth = 0; // Current width of displayed text per line
    let curLinkData: ILinkData | null = null; // Current link information
    let rowCount = 0;
    let linkIndex = 0;
    const linkMap = {};

    if (originValue?.length) {
      (originValue as ISegment[]).forEach((item) => {
        const length = (item.text || (item as any).title || '').length;
        const nextIndex = linkIndex + length;
        // The isLinkSplit is used as an identifier for special handling of multiple URL references
        if (item.type === SegmentType.Url || isLinkSplit) {
          linkMap[linkIndex] = {
            endIndex: nextIndex - 1,
            url: (item as IHyperlinkSegment).link || item.text,
          };
        }
        linkIndex = isLinkSplit ? nextIndex + 2 : nextIndex;
      });
    }

    const isEllipsis = this.textEllipsis({ text, maxWidth: maxWidth }).isEllipsis;

    for (let n = 0; n < textLength; n++) {
      const curText = arrText[n];
      const isLineBreak = ['\n', '\r'].includes(curText);
      const singleText = isLineBreak ? '' : curText;
      const composeText = showText + singleText;
      const isLimitRow = maxRow ? rowCount >= maxRow - 1 : false;
      const singleTextWidth = isLineBreak ? 0 : this.ctx.measureText(singleText).width;
      showLineWidth += singleTextWidth;
      const diffWidth = isLimitRow ? showLineWidth + (isEllipsis ? ellipsisWidth : 0) : showLineWidth;
      const isLineEnd = diffWidth > maxWidth;
      const linkData = linkMap[n];

      // Encounter the beginning of a linked fragment
      if (linkData && !isUnderline) {
        if (n === linkData.endIndex) {
          resultData.push({
            offsetX,
            offsetY,
            width: Math.ceil(singleTextWidth),
            text: singleText,
            linkUrl: linkData.url,
          });
          continue;
        }
        if (n !== 0) {
          resultData.push({
            offsetX,
            offsetY,
            width: Math.ceil(showTextWidth),
            text: showText,
            linkUrl: null,
          });
        }
        showText = singleText;
        offsetX += showTextWidth;
        showTextWidth = singleTextWidth;
        curLinkData = linkData;
        continue;
      }

      // Encounter End of linked clip
      if (curLinkData && n === curLinkData.endIndex && !isUnderline) {
        resultData.push({
          offsetX,
          offsetY,
          width: Math.ceil(showTextWidth + singleTextWidth),
          text: composeText,
          linkUrl: curLinkData.url,
        });
        showText = '';
        offsetX += showTextWidth + singleTextWidth;
        showTextWidth = 0;

        if ((isLineEnd || isLineBreak) && rowCount < maxRow) {
          showLineWidth = 0;
          offsetX = 0;
          if (isLimitRow) {
            showText = '';
            break;
          }
          rowCount++;
          offsetY += lineHeight;
        }
        continue;
      }

      // encounter line break or end of line
      if ((isLineEnd || isLineBreak) && rowCount < maxRow) {
        const isLastLetter = n === arrText.length - 1;
        resultData.push({
          offsetX,
          offsetY,
          width: Math.ceil(showTextWidth),
          text: isLimitRow ? (isLastLetter ? composeText : `${showText}…`) : showText,
          linkUrl: curLinkData && curLinkData.endIndex >= n ? curLinkData.url : null,
        });
        showText = singleText;
        offsetX = 0;
        showTextWidth = singleTextWidth;
        showLineWidth = singleTextWidth;

        if (isLimitRow) {
          showText = '';
          break;
        }
        rowCount++;
        offsetY += lineHeight;
        continue;
      }

      showText = composeText;
      showTextWidth += singleTextWidth;
    }

    if (showText) {
      resultData.push({
        offsetX,
        offsetY,
        width: Math.ceil(showTextWidth),
        text: showText,
        linkUrl: null,
      });
    }

    if (this.needDraw && needDraw) {
      textRenderer(resultData);
    }

    const res = {
      height: rowCount < maxRow ? offsetY + lineHeight : offsetY,
      data: resultData,
    };

    textDataCache.set(cacheKey, res);
    return res;
  }

  public text(props: ITextProps) {
    const {
      x,
      y,
      text,
      fontSize = 13,
      fillStyle = colors.firstLevelText,
      textAlign = 'left',
      verticalAlign = 'top',
      fontWeight = 'normal',
      textDecoration = 'none',
    } = props;

    const fontStyle = `${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;

    if (textDecoration === 'underline') {
      const textWidth = getTextWidth(this.ctx, text, fontStyle);
      this.line({
        x: x,
        y: y + 0.5,
        points: [0, fontSize, textWidth, fontSize],
        stroke: fillStyle,
      });
    }

    const baselineOffset = verticalAlign === 'top' ? fontSize / 2 : 0;
    // this.ctx.font = fontStyle;
    if (fillStyle) this.setStyle({ fillStyle });
    this.ctx.textAlign = textAlign;

    this.ctx.fillText(text, x, y + baselineOffset);
  }

  public image(props: IImageProps, crossOrigin?: boolean, allowDefault?: boolean) {
    const { x, y, url, width, height, opacity = 1, clipFunc } = props;
    if (!url) {
      return;
    }
    const image = imageCache.getImage(url);
    // Not loaded successfully
    if (image === false) {
      if (allowDefault) {
        this.path({
          x,
          y: y + 2,
          data: WebOutlinedPath,
          size: 16,
          fill: colors.textCommonPrimary,
        });
      }
      return;
    }
    // Unloaded
    if (image == null) {
      return imageCache.loadImage(url, url, { crossOrigin });
    }
    const isOrigin = opacity === 1;

    if (!clipFunc && isOrigin) {
      return this.ctx.drawImage(image, x, y, width, height);
    }

    if (!clipFunc && !isOrigin) {
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.drawImage(image, x, y, width, height);
      this.ctx.restore();
      return;
    }

    if (clipFunc) {
      this.ctx.save();
      this.ctx.beginPath();
      clipFunc(this.ctx);
      this.ctx.clip();
      this.ctx.globalAlpha = opacity;
      this.ctx.drawImage(image, x, y, width, height);
      this.ctx.restore();
    }
  }

  public label(props: ILabelProps): { width: number; height: number } {
    const {
      x,
      y,
      width,
      height,
      text,
      radius,
      background,
      color = colors.firstLevelText,
      fontSize = 13,
      textAlign = 'left',
      verticalAlign = 'top',
      fontWeight = 'normal',
      padding = 0,
      stroke,
    } = props;

    this.rect({
      x,
      y,
      width,
      height,
      radius,
      fill: background,
      stroke,
    });

    let textOffsetX = padding;

    if (textAlign === 'center') {
      textOffsetX = width / 2;
    } else if (textAlign === 'right') {
      textOffsetX = width - padding;
    }
    this.text({
      x: x + textOffsetX,
      y: y + (height - fontSize) / 2,
      text,
      fillStyle: color,
      fontSize,
      textAlign,
      verticalAlign,
      fontWeight,
    });

    return {
      width,
      height,
    };
  }

  public avatar(props: {
    x: number;
    y: number;
    url: string;
    bgColor: string;
    id: string;
    title: string;
    size: AvatarSize;
    type: AvatarType;
    opacity: number;
    cacheTheme: ThemeName;
    isGzip?: boolean;
  }) {
    const {
      x = 0,
      y = 0,
      id,
      url: _url,
      title,
      bgColor,
      isGzip = true,
      size = AvatarSize.Size32,
      type = AvatarType.Member,
      opacity = 1,
      cacheTheme,
    } = props;

    if (title == null || id == null) return null;
    const ratio = Math.max(window.devicePixelRatio, 2);
    const url = assertSignatureManager.getAssertSignatureUrl(_url);
    const avatarSrc =
      isGzip && url && !getEnvVariables().DISABLED_QINIU_COMPRESSION_PARAMS
        ? `${url}${url.includes('?') ? '&' : '?'}imageView2/1/w/${size * ratio}/q/100!`
        : url || '';
    const avatarName = getFirstWordFromString(title);
    const avatarBg = avatarSrc ? colors.defaultBg : createAvatarRainbowColorsArr(cacheTheme)[bgColor ?? 0];
    switch (type) {
      case AvatarType.Team: {
        if (!url) {
          this.rect({
            x,
            y,
            width: size,
            height: size,
            fill: getAvatarRandomColor(id),
            radius: 4,
          });
          // const scale = size === AvatarSize.Size16 ? 0.5 : 0.6;
          return this.path({
            x: x + 2,
            y: y + 2,
            data: DepartmentOutlinedPath,
            size,
            // scaleX: scale,
            // scaleY: scale,
            fill: colors.defaultBg,
          });
        }
        return this.image({
          x,
          y,
          url,
          width: size,
          height: size,
        });
      }
      case AvatarType.Member: {
        const radius = size / 2;
        if (!avatarSrc) {
          this.ctx.fillStyle = avatarBg;
          this.ctx.beginPath();
          this.ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
          this.ctx.closePath();
          this.ctx.fill();
          return this.text({
            x: x + radius,
            y: y + radius,
            textAlign: 'center',
            verticalAlign: 'middle',
            text: avatarName,
            fillStyle: colors.textStaticPrimary,
          });
        }
        return this.image({
          x,
          y,
          url: avatarSrc,
          width: size,
          height: size,
          clipFunc: (ctx) => {
            ctx.fillStyle = avatarBg;
            ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
            ctx.fill();
          },
          opacity,
        });
      }
    }
  }

  private convertEndpointToCenterParameterization(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    fa: any,
    fs: number,
    rx: number,
    ry: number,
    psiDeg: number,
  ) {
    const psi = psiDeg * (Math.PI / 180.0);
    const xp = (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0;
    const yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 + (Math.cos(psi) * (y1 - y2)) / 2.0;

    const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

    if (lambda > 1) {
      rx *= Math.sqrt(lambda);
      ry *= Math.sqrt(lambda);
    }

    let f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp)));

    if (fa === fs) {
      f *= -1;
    }
    if (isNaN(f)) {
      f = 0;
    }

    const cxp = (f * rx * yp) / ry;
    const cyp = (f * -ry * xp) / rx;

    const cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
    const cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

    const vMag = function (v: number[]) {
      return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    };
    const vRatio = function (u: number[], v: number[]) {
      return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
    };
    const vAngle = function (u: number[], v: number[]) {
      return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
    };
    const theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
    const u = [(xp - cxp) / rx, (yp - cyp) / ry];
    const v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
    let dTheta = vAngle(u, v);

    if (vRatio(u, v) <= -1) {
      dTheta = Math.PI;
    }
    if (vRatio(u, v) >= 1) {
      dTheta = 0;
    }
    if (fs === 0 && dTheta > 0) {
      dTheta = dTheta - 2 * Math.PI;
    }
    if (fs === 1 && dTheta < 0) {
      dTheta = dTheta + 2 * Math.PI;
    }
    return [cx, cy, rx, ry, theta, dTheta, psi, fs];
  }

  private getLineLength(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  private getPointOnCubicBezier(pct: number, P1x: number, P1y: number, P2x: number, P2y: number, P3x: number, P3y: number, P4x: number, P4y: number) {
    function CB1(t: number) {
      return t * t * t;
    }

    function CB2(t: number) {
      return 3 * t * t * (1 - t);
    }

    function CB3(t: number) {
      return 3 * t * (1 - t) * (1 - t);
    }

    function CB4(t: number) {
      return (1 - t) * (1 - t) * (1 - t);
    }

    const x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
    const y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);

    return {
      x: x,
      y: y,
    };
  }

  private getPointOnQuadraticBezier(pct: number, P1x: number, P1y: number, P2x: number, P2y: number, P3x: number, P3y: number) {
    function QB1(t: number) {
      return t * t;
    }

    function QB2(t: number) {
      return 2 * t * (1 - t);
    }

    function QB3(t: number) {
      return (1 - t) * (1 - t);
    }

    const x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
    const y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);

    return {
      x: x,
      y: y,
    };
  }

  private getPointOnEllipticalArc(cx: number, cy: number, rx: number, ry: number, theta: number, psi: number) {
    const cosPsi = Math.cos(psi);
    const sinPsi = Math.sin(psi);
    const pt = {
      x: rx * Math.cos(theta),
      y: ry * Math.sin(theta),
    };
    return {
      x: cx + (pt.x * cosPsi - pt.y * sinPsi),
      y: cy + (pt.x * sinPsi + pt.y * cosPsi),
    };
  }

  private calcLength(x: number, y: number, cmd: string, points: number[]) {
    let len, p1, p2, t;

    switch (cmd) {
      case 'L':
        return this.getLineLength(x, y, points[0], points[1]);
      case 'C':
        len = 0.0;
        p1 = this.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
        for (t = 0.01; t <= 1; t += 0.01) {
          p2 = this.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
          len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
          p1 = p2;
        }
        return len;
      case 'Q':
        len = 0.0;
        p1 = this.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
        for (t = 0.01; t <= 1; t += 0.01) {
          p2 = this.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
          len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
          p1 = p2;
        }
        return len;
      case 'A':
        len = 0.0;
        const start = points[4];
        const dTheta = points[5];
        const end = points[4] + dTheta;
        let inc = Math.PI / 180.0;
        if (Math.abs(start - end) < inc) {
          inc = Math.abs(start - end);
        }
        p1 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
        if (dTheta < 0) {
          for (t = start - inc; t > end; t -= inc) {
            p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
            len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }
        } else {
          for (t = start + inc; t < end; t += inc) {
            p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
            len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }
        }
        p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
        len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
        return len;
    }
    return 0;
  }

  private parsePathData(data: string) {
    if (!data) {
      return [];
    }

    let cs = data;
    const cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];

    cs = cs.replace(new RegExp(' ', 'g'), ',');
    for (let n = 0; n < cc.length; n++) {
      cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
    }
    const arr = cs.split('|');
    const ca: any = [];
    const coords: any = [];
    let cpx = 0;
    let cpy = 0;

    const re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
    let match: RegExpExecArray | null;
    for (let n = 1; n < arr.length; n++) {
      let str = arr[n];
      let c = str.charAt(0);
      str = str.slice(1);

      coords.length = 0;
      while ((match = re.exec(str))) {
        coords.push(match[0]);
      }

      const p: any = [];

      for (let j = 0, jlen = coords.length; j < jlen; j++) {
        if (coords[j] === '00') {
          p.push(0, 0);
          continue;
        }
        const parsed = parseFloat(coords[j]);
        if (!isNaN(parsed)) {
          p.push(parsed);
        } else {
          p.push(0);
        }
      }

      while (p.length > 0) {
        if (isNaN(p[0])) {
          break;
        }

        let cmd: string | null = null;
        let points: any = [];
        const startX = cpx;
        const startY = cpy;
        let prevCmd, ctlPtx, ctlPty;
        let rx, ry, psi, fa, fs, x1, y1;

        switch (c) {
          case 'l':
            cpx += p.shift();
            cpy += p.shift();
            cmd = 'L';
            points.push(cpx, cpy);
            break;
          case 'L':
            cpx = p.shift();
            cpy = p.shift();
            points.push(cpx, cpy);
            break;
          case 'm':
            const dx = p.shift();
            const dy = p.shift();
            cpx += dx;
            cpy += dy;
            cmd = 'M';
            if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
              for (let idx = ca.length - 2; idx >= 0; idx--) {
                if (ca[idx].command === 'M') {
                  cpx = ca[idx].points[0] + dx;
                  cpy = ca[idx].points[1] + dy;
                  break;
                }
              }
            }
            points.push(cpx, cpy);
            c = 'l';
            break;
          case 'M':
            cpx = p.shift();
            cpy = p.shift();
            cmd = 'M';
            points.push(cpx, cpy);
            c = 'L';
            break;

          case 'h':
            cpx += p.shift();
            cmd = 'L';
            points.push(cpx, cpy);
            break;
          case 'H':
            cpx = p.shift();
            cmd = 'L';
            points.push(cpx, cpy);
            break;
          case 'v':
            cpy += p.shift();
            cmd = 'L';
            points.push(cpx, cpy);
            break;
          case 'V':
            cpy = p.shift();
            cmd = 'L';
            points.push(cpx, cpy);
            break;
          case 'C':
            points.push(p.shift(), p.shift(), p.shift(), p.shift());
            cpx = p.shift();
            cpy = p.shift();
            points.push(cpx, cpy);
            break;
          case 'c':
            points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
            cpx += p.shift();
            cpy += p.shift();
            cmd = 'C';
            points.push(cpx, cpy);
            break;
          case 'S':
            ctlPtx = cpx;
            ctlPty = cpy;
            prevCmd = ca[ca.length - 1];
            if (prevCmd.command === 'C') {
              ctlPtx = cpx + (cpx - prevCmd.points[2]);
              ctlPty = cpy + (cpy - prevCmd.points[3]);
            }
            points.push(ctlPtx, ctlPty, p.shift(), p.shift());
            cpx = p.shift();
            cpy = p.shift();
            cmd = 'C';
            points.push(cpx, cpy);
            break;
          case 's':
            ctlPtx = cpx;
            ctlPty = cpy;
            prevCmd = ca[ca.length - 1];
            if (prevCmd.command === 'C') {
              ctlPtx = cpx + (cpx - prevCmd.points[2]);
              ctlPty = cpy + (cpy - prevCmd.points[3]);
            }
            points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
            cpx += p.shift();
            cpy += p.shift();
            cmd = 'C';
            points.push(cpx, cpy);
            break;
          case 'Q':
            points.push(p.shift(), p.shift());
            cpx = p.shift();
            cpy = p.shift();
            points.push(cpx, cpy);
            break;
          case 'q':
            points.push(cpx + p.shift(), cpy + p.shift());
            cpx += p.shift();
            cpy += p.shift();
            cmd = 'Q';
            points.push(cpx, cpy);
            break;
          case 'T':
            ctlPtx = cpx;
            ctlPty = cpy;
            prevCmd = ca[ca.length - 1];
            if (prevCmd.command === 'Q') {
              ctlPtx = cpx + (cpx - prevCmd.points[0]);
              ctlPty = cpy + (cpy - prevCmd.points[1]);
            }
            cpx = p.shift();
            cpy = p.shift();
            cmd = 'Q';
            points.push(ctlPtx, ctlPty, cpx, cpy);
            break;
          case 't':
            ctlPtx = cpx;
            ctlPty = cpy;
            prevCmd = ca[ca.length - 1];
            if (prevCmd.command === 'Q') {
              ctlPtx = cpx + (cpx - prevCmd.points[0]);
              ctlPty = cpy + (cpy - prevCmd.points[1]);
            }
            cpx += p.shift();
            cpy += p.shift();
            cmd = 'Q';
            points.push(ctlPtx, ctlPty, cpx, cpy);
            break;
          case 'A':
            rx = p.shift();
            ry = p.shift();
            psi = p.shift();
            fa = p.shift();
            fs = p.shift();
            x1 = cpx;
            y1 = cpy;
            cpx = p.shift();
            cpy = p.shift();
            cmd = 'A';
            points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
            break;
          case 'a':
            rx = p.shift();
            ry = p.shift();
            psi = p.shift();
            fa = p.shift();
            fs = p.shift();
            x1 = cpx;
            y1 = cpy;
            cpx += p.shift();
            cpy += p.shift();
            cmd = 'A';
            points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
            break;
        }

        ca.push({
          command: cmd || c,
          points: points,
          start: {
            x: startX,
            y: startY,
          },
          pathLength: this.calcLength(startX, startY, cmd || c, points),
        });
      }

      if (c === 'z' || c === 'Z') {
        ca.push({
          command: 'z',
          points: [],
          start: undefined,
          pathLength: 0,
        });
      }
    }

    return ca;
  }

  public path(props: { x: number; y: number; data: string; size?: AvatarSize; scaleX?: number; scaleY?: number; fill: string }) {
    const { x, y, scaleX = 1, scaleY = 1, data, fill } = props;
    const dataArray = this.parsePathData(data);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = fill;
    this.ctx.translate(x, y);
    this.ctx.scale(scaleX, scaleY);
    let isClosed = false;
    for (let n = 0; n < dataArray.length; n++) {
      const c = dataArray[n].command;
      const p = dataArray[n].points;
      switch (c) {
        case 'L':
          this.ctx.lineTo(p[0], p[1]);
          break;
        case 'M':
          this.ctx.moveTo(p[0], p[1]);
          break;
        case 'C':
          this.ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
          break;
        case 'Q':
          this.ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
          break;
        case 'A':
          const cx = p[0];
          const cy = p[1];
          const rx = p[2];
          const ry = p[3];
          const theta = p[4];
          const dTheta = p[5];
          const psi = p[6];
          const fs = p[7];
          const r = rx > ry ? rx : ry;
          const scaleX = rx > ry ? 1 : rx / ry;
          const scaleY = rx > ry ? ry / rx : 1;

          this.ctx.translate(cx, cy);
          this.ctx.rotate(psi);
          this.ctx.scale(scaleX, scaleY);
          this.ctx.arc(0, 0, r, theta, theta + dTheta, (1 - fs) as any);
          this.ctx.scale(1 / scaleX, 1 / scaleY);
          this.ctx.rotate(-psi);
          this.ctx.translate(-cx, -cy);

          break;
        case 'z':
          isClosed = true;
          this.ctx.closePath();
          break;
      }
    }

    if (!isClosed) {
      this.ctx.stroke();
    } else {
      this.ctx.fill();
    }
    this.ctx.restore();
  }
}

export const konvaDrawer = new KonvaDrawer();
