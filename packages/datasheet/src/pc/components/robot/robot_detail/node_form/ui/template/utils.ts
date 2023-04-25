const isValidPercentage = (value: string) => {
  if (typeof value !== 'string') {
    return false;
  }

  const percentagePattern = /^([0-9]+(\.[0-9]+)?%)$/;
  return percentagePattern.test(value);
};

export const isSumLessThanOrEqualTo100 = (arr: string[]) => {
  if (!arr.every(isValidPercentage)) {
    throw new Error('The array contains invalid percentages.');
  }

  const sum = arr.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue);
  }, 0);

  return sum === 100;
};
