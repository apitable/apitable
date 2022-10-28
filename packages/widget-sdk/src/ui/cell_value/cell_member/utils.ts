// rc(series colors)
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

// Generate color rules: pass in a string.
export const getAvatarRandomColor = (str: string) => {
  const index = str.charCodeAt(Math.floor(str.length / 2)); // Used to generate colors, taking the unicode value of the middle byte of the string.
  return FC_COLORS[index % FC_COLORS.length];
};

export const getFirstWordFromString = (str: string) => {
  if (!str.length) return '';
  const codePoint = str.codePointAt(0);
  if (!codePoint) return '';
  return String.fromCodePoint(codePoint);
};