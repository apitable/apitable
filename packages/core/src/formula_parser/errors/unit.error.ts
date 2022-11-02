
import { t, Strings } from 'i18n';

export class UnitError extends Error {

  private _unitStr: string;

  constructor(unitStr: string) {
    
    // ideally, don't translation in `super` constructor
    // for compatibility of front-end i18n messages
    super(UnitError.parseI18NMessage(unitStr));

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnitError.prototype);

    this._unitStr = unitStr;
  }

  private static parseI18NMessage(unitStr: string): string {
    return t(Strings.function_err_wrong_unit_str, {
      unitStr,
    });
  }

  public get unitStr() {
    return this._unitStr;
  }
}