import { t, Player } from '@apitable/core';
import * as nav from './nav';

const vika = {
  apphook: Player.getAppHook(), // 暴露eve，可于外部进行事件交互
  nav,
  t,
};

export {
  vika,
};

