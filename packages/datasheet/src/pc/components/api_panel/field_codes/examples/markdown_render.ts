/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @ts-ignore
import Clipboard from 'clipboard';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import { Strings, t } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import { DEBUG_BUTTON_CLASS_NAME } from '../doc_inner_html';
import { copyOutlinedStr, debugOutlinedStr } from '../icons';

if (!process.env.SSR) {
  new Clipboard('.markdown-it-code-button-copy');
}
const { APIFOX_DEBUG_PATCH_URL, APIFOX_DEBUG_POST_URL, APIFOX_DEBUG_DELETE_URL, APIFOX_DEBUG_GET_URL, APIFOX_DEBUG_UPLOAD_URL } = getEnvVariables();

const displayDebuggerButton = (str: string, lang: string) => {
  if (lang !== 'shell') {
    return false;
  }
  if (str.includes('POST') && !APIFOX_DEBUG_POST_URL) {
    return false;
  }
  if (str.includes('PATCH') && !APIFOX_DEBUG_PATCH_URL) {
    return false;
  }
  if (str.includes('DELETE') && !APIFOX_DEBUG_DELETE_URL) {
    return false;
  }
  if (str.includes('/attachments') && !APIFOX_DEBUG_UPLOAD_URL) {
    return false;
  }
  if (!str.includes('curl -X') && !APIFOX_DEBUG_GET_URL) {
    return false;
  }
  return true;
};

const md = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang) {
      const langObject = Prism.languages[lang];
      // Online commissioning
      const onlineDebugButton = `<button ${displayDebuggerButton(str, lang) ? '' : 'style="display: none"'} class="${DEBUG_BUTTON_CLASS_NAME}"
      >${debugOutlinedStr}${t(Strings.request_in_api_panel_curl)}</button>`;
      try {
        return `<pre
            class="language-${lang}"
            style="position: relative; white-space: normal;"
          ><code style="white-space: pre-wrap;">${Prism.highlight(str, langObject, lang)}</code>
            <div class="markdown-it-code-button-wrap"><button
              data-clipboard-text="${md.utils.escapeHtml(str)}"
              class="markdown-it-code-button-copy">${copyOutlinedStr}${t(Strings.copy_link)}</button>
              ${onlineDebugButton}
          </pre>`;
      } catch (err) {
        console.warn('! ' + err);
      }
    }
    return `<pre class="language-${lang}"><code>` + md.utils.escapeHtml(str) + '</code></pre>';
  },
}) as any;

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender =
  md.renderer.rules.link_open ||
  function render(tokens: any, idx: any, options: any, _env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = (tokens: any[], idx: number, options: any, env: any, self: any) => {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target');
  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
  }
  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

export const markdown = md;
