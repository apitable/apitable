/**
 * @description matrix (two-dimensional array) to transpose
 * @param matrix - 2D array
 */
export const transpose = <T>(matrix: T[][]): T[][] => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, ()=>new Array(rows));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
};