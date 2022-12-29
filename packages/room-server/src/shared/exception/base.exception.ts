/**
 * base exception Interface
 */
export interface IBaseException {

  /**
   * exception code
   */
  getCode(): number;

  /**
   * exception message
   */
  getMessage(): string;
}
