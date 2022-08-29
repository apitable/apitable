import { Selectors, Strings, t } from '@vikadata/core';
import { store } from 'pc/store';
import { message } from 'antd';

let hide;
let lastStatus;
let timer; 
const key = 'COMPUTED_STATUS_MESSAGE';
store.subscribe(function computedStatusChange() {
  const state = store.getState();
  const computedStatus = Selectors.getComputedStatus(state);
  if (!computedStatus) {
    return;
  }
  const preStatus = lastStatus;
  const hasCalc = Object.values(computedStatus).some(v => v);
  lastStatus = hasCalc;
  if (timer && !hasCalc) {
    window.clearTimeout(timer);
  }
  if (hasCalc && !preStatus) {
    timer = setTimeout(() => {
      hide = message.loading({ content: t(Strings.data_calculating), duration: 0, key });
      timer = null;
    }, 2000);
  } else if (hide && !hasCalc) {
    hide();
    hide = undefined;
  }
});
