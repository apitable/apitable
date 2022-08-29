// Only the JSON type is exported, because the text type is deprecated
// otherwise. (If you want to use it somewhere, you're welcome to pull it out
// into a separate module that json0 can depend on).
import json0 from './json0';
import { IJot } from './interface';

export * from './interface';
export * from './compose';

export const jot = json0 as IJot;
