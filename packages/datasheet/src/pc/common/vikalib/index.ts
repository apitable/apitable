import { t, Player } from '@apitable/core';
import * as nav from './nav';

const vika = {
  apphook: Player.getAppHook(), // Expose eve for external event interaction
  nav,
  t,
};

export {
  vika,
};

