export interface IValidationPipeOptions {
  enableErrorDetail?: boolean;
}

export interface IApiErrorTip {
  tipId: string;
  extra?: any;
  /**
   * 替换error中的value
   */
  value?: any;

  property?: any;
}
