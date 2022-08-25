export const calcSize = (
  trigger: HTMLElement,
  scrollEle: HTMLDivElement,
  searchEle: HTMLDivElement | null,
  footerEle: HTMLDivElement | null
) => {
  const { x, y, width, height } = trigger.getBoundingClientRect();
  const restTopHeight = y;
  const restBottomHeight = window.innerHeight - y - height;

  let totalHeight = scrollEle.scrollHeight + 16;
  if (searchEle) {
    totalHeight += searchEle.scrollHeight;
  }
  if (footerEle) {
    totalHeight += footerEle.scrollHeight;
  }

  // 放在 trigger 下面
  if (restBottomHeight > restTopHeight) {
    return {
      x,
      y: y + height,
      triggerWidth: width,
      width,
      height: totalHeight > restBottomHeight ? restBottomHeight : totalHeight,
    };
  }

  return {
    x,
    y: totalHeight > restTopHeight ? 0 : y - totalHeight,
    triggerWidth: width,
    width,
    height: totalHeight > restTopHeight ? restTopHeight : totalHeight,
  };
};