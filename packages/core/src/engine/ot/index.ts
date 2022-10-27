// Only the JSON type is exported, because the text type is deprecated
// otherwise. (If you want to use it somewhere, you're welcome to pull it out
// into a separate module that json0 can depend on).
import { Strings, t } from 'i18n';
import json0 from 'ot-json0/lib/json0';
import { IJot } from './interface';

export * from './interface';
export * from './compose';

export const jot: IJot = {
  ...json0,
  apply(json, actions) {
    try {
      return json0.apply(json, actions)
    } catch (e) {
      if ((e as Error).message === 'invalid / missing instruction in op') {
        throw new Error(t(Strings.missing_instruction_op_error), { cause: e });
      } else {
        throw e;
      }
    }
  }
}
