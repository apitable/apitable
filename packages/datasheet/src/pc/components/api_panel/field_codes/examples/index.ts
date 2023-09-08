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

import { runInContext } from 'lodash';
import { Strings, t } from '@apitable/core';
import { CodeLanguage } from '../enum';
import { markdown as md } from './markdown_render';

const lodash = runInContext();
const { template, templateSettings } = lodash;

templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export const getDocHtml = (lang: CodeLanguage, method: string, context: any) => {
  let docs: string;
  let partDoc: string;
  switch (lang) {
    case CodeLanguage.Curl:
      docs = t(Strings.api_panel_md_curl_example); // curlDoc
      break;
    case CodeLanguage.Js:
      docs = t(Strings.api_panel_md_js_example); // javascriptDoc
      break;
    case CodeLanguage.Python:
      docs = t(Strings.api_panel_md_python_example); // pythonDoc
      break;
    default:
      docs = t(Strings.api_panel_md_python_example); // pythonDoc
      break;
  }
  const [initSDK, getDoc, addDoc, updateDoc, deleteDoc, uploadDoc] = docs.split('<!--split-->');
  switch (method) {
    case 'GET':
      partDoc = getDoc;
      break;
    case 'POST':
      partDoc = addDoc;
      break;
    case 'PATCH':
      partDoc = updateDoc;
      break;
    case 'DELETE':
      partDoc = deleteDoc;
      break;
    case 'UPLOAD':
      partDoc = uploadDoc;
      break;
    default:
      partDoc = '';
      break;
  }

  const mdText = template(initSDK + '\n' + partDoc)(context);
  return md.render(mdText, method);
};

export const getDoc = (lang: CodeLanguage, context: any) => {
  const { method, ...restContext } = context;
  return getDocHtml(lang, method, restContext);
};
