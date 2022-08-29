export const getGroupColor = (level: number) => (index: number) => {
  return ['#f5f6f8', '#fafbfb', '#ffffff'].slice(-level)[index];
};
