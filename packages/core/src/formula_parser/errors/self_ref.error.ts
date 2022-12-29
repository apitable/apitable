import { t, Strings } from '../../exports/i18n';

/**
 * The error for formula expression parser 
 * references the column itself.
 */
export class SelfRefError extends Error {

  constructor() {
    
    // ideally, don't translation in `super` constructor
    // for compatibility of front-end i18n messages
    super(SelfRefError.parseI18NMessage());

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SelfRefError.prototype);
  }

  private static parseI18NMessage(): string {
    return t(Strings.function_err_no_ref_self_column);
  }
}