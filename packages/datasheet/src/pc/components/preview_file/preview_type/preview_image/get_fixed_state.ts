function fixPoint(
  key: 'x' | 'y',
  offset: number,
  width: number,
  containerWidth: number
) {
  const maxOffset = (width - containerWidth) / 2;

  const negative = offset > 0 ? 1 : -1;

  if (width <= containerWidth) {
    return {
      [key]: 0,
    };
  }

  if (Math.abs(offset) > maxOffset) {
    return {
      [key]: Math.floor(negative * maxOffset),
    };
  }

  return { [key]: Math.floor(offset) };
}

export default function getFixedState(
  width: number,
  height: number,
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number
): { [x: string]: number } {
  if (width <= containerWidth && height <= containerHeight) {
    return {
      x: 0,
      y: 0,
    };
  }

  return {
    ...fixPoint('x', x, width, containerWidth),
    ...fixPoint('y', y, height, containerHeight),
  };
}
