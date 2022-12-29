export interface IValidationPipeOptions {
  enableErrorDetail?: boolean;
}

export interface IApiErrorTip {
  tipId: string;
  extra?: any;
  /**
   * used to replace the error message
   */
  value?: any;

  property?: any;
}
