export const calcPercent = (used, total) => {
  if (!used || !total || total === -1) {
    return 0;
  }
  return Math.min(Math.ceil(used / total * 100), 100);
};