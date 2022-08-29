import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import Clipboard from 'clipboard';
import { Strings, t } from '@vikadata/core';
import { copyOutlinedStr, debugOutlinedStr } from '../icons';
import { DEBUG_BUTTON_CLASS_NAME } from '../doc_inner_html';
import { getEnvVariables } from 'pc/utils/env';

const isSassProduction = () => {
  return getEnvVariables().ENV === 'vika-production';
};

new Clipboard('.markdown-it-code-button-copy');

const md = new MarkdownIt({
  highlight: (str, lang, ...d) => {
    if (lang) {
      const langObject = Prism.languages[lang];
      // 在线调试
      const onlineDebugButton = `<button ${lang === 'shell' && isSassProduction() ? '' : 'style="display: none"'} class="${DEBUG_BUTTON_CLASS_NAME}"
      >${debugOutlinedStr}${t(Strings.request_in_api_panel_curl)}</button>`;
      try {
        return (
          `<pre 
            class="language-${lang}"
            style="position: relative"
          ><code style="white-space: pre-wrap;">${Prism.highlight(str, langObject, lang)}</code>
            <div class="markdown-it-code-button-wrap"><button 
              data-clipboard-text="${md.utils.escapeHtml(str)}"
              class="markdown-it-code-button-copy">${copyOutlinedStr}${t(Strings.copy_link)}</button>
              ${onlineDebugButton}
          </pre>`
        );
      } catch (err) { console.warn('! ' + err); }
    }
    return `<pre class="language-${lang}"><code>` + md.utils.escapeHtml(str) + '</code></pre>';
  },
});

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender = md.renderer.rules.link_open || function render(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target');
  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';// replace value of existing attr
  }
  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

export const markdown = md;