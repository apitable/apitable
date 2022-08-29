// rc 系列颜色
const FC_COLORS = [
  '#30C28B',
  '#6E382D',
  '#B35FF5',
  '#FFEB3A',
  '#5586FF',
  '#52C41B',
  '#FF7A00',
  '#FF708B',
  '#E33E38',
  '#55CDFF',
  '#7B67EE',
  '#FFAB00',
];

// 生成颜色规则：传入字符串
export const getAvatarRandomColor = (str: string) => {
  const index = str.charCodeAt(Math.floor(str.length / 2)); // 用于生成颜色，取字符串中间字节的unicode值
  return FC_COLORS[index % FC_COLORS.length];
};

export const getFirstWordFromString = (str: string) => {
  if (!str.length) return '';
  const codePoint = str.codePointAt(0);
  if (!codePoint) return '';
  return String.fromCodePoint(codePoint);
};