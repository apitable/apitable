import { Strings, t } from '@vikadata/core';
import { runInContext } from 'lodash';
import { CodeLanguage } from '../field_codes';
import { markdown as md } from './markdown_render';

const lodash = runInContext();
const { template, templateSettings } = lodash;

templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export enum MethodType {
  Get,
  Delete,
  Add,
  Update,
  Upload,
}

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
  return md.render(mdText);
};

export const getDoc = (lang, context) => {
  const { method, ...restContext } = context;
  return getDocHtml(lang, method, restContext);
};
