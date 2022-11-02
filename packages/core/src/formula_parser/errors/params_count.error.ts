
import { t, Strings } from 'i18n';

/**
 * Params Error Type, used to identify the error type and error message
 */
export enum ParamsErrorType {
  NotEquals,
  AtLeastCount,
}

export class ParamsCountError extends Error {

  private _type: ParamsErrorType; 
  private _paramsName: string;
  private _paramsCount: number;

  constructor(type: ParamsErrorType, paramsName: string, paramsCount: number) {
    
    // ideally, don't translation in `super` constructor
    // for compatibility of front-end i18n messages
    super(ParamsCountError.parseI18NMessage(type, paramsName, paramsCount));

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ParamsCountError.prototype);

    this._type = type;
    this._paramsName = paramsName;
    this._paramsCount = paramsCount;
  }

  private static parseI18NMessage(type: ParamsErrorType, paramsName: string, paramsCount: number): string {
    let errorMessage: string;
    switch (type) {
      case ParamsErrorType.NotEquals:
        errorMessage = t(Strings.function_validate_params_count_at_least,{
          name: paramsName, 
          count: paramsCount });
        break;
      case ParamsErrorType.AtLeastCount:
        errorMessage = t(Strings.function_validate_params_count_at_least,{
          name: paramsName, 
          count: paramsCount,
        });
        break;
    }
    return errorMessage;
  }

  public get type() : ParamsErrorType {
    return this._type;
  }

  public get paramsName(): string {
    return this._paramsName;
  }

  public get paramsCount(): number {
    return this._paramsCount;
  }

}