import Color from 'color';
import { COLOR_MAP } from './_colors';

const COLOR_INDEX_NAME = [
  'deepPurple',
  'indigo',
  'blue',
  'teal',
  'green',
  'yellow',
  'orange',
  'tangerine',
  'pink',
  'red',
];

// 五个等级 alpha 透明度
const COLOR_LEVEL_ALPHA = [0.2, 0.4, 0.6, 0.8, 1];

const rgba2hex = (foregroundColor: string, backgroundColor = '#FFFFFF') => {
  const getAdjustedChannel = (fValue: number, bValue: number, opacity: number) => opacity * fValue + (1 - opacity) * bValue;
  const fc = Color(foregroundColor);
  const bc = Color(backgroundColor);
  const opacity = fc.alpha();
  const adjustedColor = Color([
    getAdjustedChannel(fc.red(), bc.red(), opacity),
    getAdjustedChannel(fc.green(), bc.green(), opacity),
    getAdjustedChannel(fc.blue(), bc.blue(), opacity),
  ]);
  return adjustedColor.hex();
};

const getColorValue = (color: string, alpha: number) => {
  return rgba2hex(Color(color).alpha(alpha).string());
};

/**
 * 将单多选的颜色数字转化为颜色对象
 * 0 => deepPurple_1
 * 10 => deepPurple_2
 * 11 => indigo_2
 * @param index option.color
 */
export function getFieldOptionColor(index: number) {
  const hue = COLOR_INDEX_NAME[index % COLOR_INDEX_NAME.length];
  const level = Math.floor(index / COLOR_INDEX_NAME.length);
  const baseColorValue = COLOR_MAP[hue];
  const value = getColorValue(baseColorValue, COLOR_LEVEL_ALPHA[level]);
  return {
    name: `${hue}_${level}`,
    value,
  };
}

/**
 * 获取所有color name的数组，下标对应 color 的number值
 */
export const getColorNames = () => {
  const colorNames: string[] = [];
  const colorNumMax = COLOR_INDEX_NAME.length * COLOR_LEVEL_ALPHA.length;
  for(let i=0; i<colorNumMax; i++) {
    const hue = COLOR_INDEX_NAME[i % COLOR_INDEX_NAME.length];
    const level = Math.floor(i / COLOR_INDEX_NAME.length);
    colorNames.push(`${hue}_${level}`);
  }
  return colorNames;
};
