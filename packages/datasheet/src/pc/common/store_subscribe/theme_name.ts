import { ThemeName } from '@apitable/components';
import { store } from 'pc/store';

let preTheme: ThemeName;

store.subscribe(() => {
  const state = store.getState();
  const theme = state.theme;
  if (theme !== preTheme){
    preTheme = theme;
    const iframeList = Array.from(document.getElementsByTagName('iframe'));
    iframeList.forEach(v => {
      v.contentWindow?.postMessage({ type: 'vika_theme', vika_theme: theme }, '*');
    });
  }
});
