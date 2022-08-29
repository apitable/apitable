import React, { CSSProperties } from 'react';
import { UrlStyled } from './styled';

interface ICellUrl {
  value: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellUrl = (props: ICellUrl) => {
  const { value, cellClassName, cellStyle } = props;
  if (!value) {
    return null;
  }
  const handleClick = () => {
    let url = '';
    try {
      // 使用 URL 构造函数校验地址合法性
      const testURL = new URL(value);
      if (testURL.protocol && !/^javascript:/i.test(testURL.protocol)) {
        url = testURL.href;
      } else {
        console.log('error', '非法链接');
        return;
      }
    } catch (error) {
      // 无协议头, 默认添加 http 协议头
      try {
        const testURL = new URL(`http://${value}`);
        url = testURL.href;
      } catch (error) {
        console.log('error', '非法链接');
        return;
      }
    }
    try {
      const newWindow = window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
      newWindow && ((newWindow as any).opener = null);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <UrlStyled className={cellClassName} style={cellStyle} onClick={handleClick}>
      {value}
    </UrlStyled>
  );
};