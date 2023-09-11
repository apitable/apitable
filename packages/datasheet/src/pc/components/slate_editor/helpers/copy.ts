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

export const copy = (text: string, editorData?: string) => {
  const handleCopy = (e: ClipboardEvent) => {
    e.clipboardData?.setData('text/plain', text);
    if (editorData) {
      e.clipboardData?.setData('application/vika-editor-data', window.btoa(encodeURIComponent(editorData)));
    }
    e.preventDefault();
  };
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.setAttribute('style', 'position: "absolute"; left: "-9999px";');
  window.document.body.appendChild(el);
  let selection = document.getSelection();
  let selected: any = null;
  if (selection) {
    selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  }
  el.select();
  let success = false;
  document.addEventListener('copy', handleCopy);
  try {
    const successful = document.execCommand('copy');
    success = !!successful;
  } catch (err) {
    success = false;
  }
  window.document.body.removeChild(el);
  if (selected && document.getSelection) {
    selection = document.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(selected);
    }
  }
  document.removeEventListener('copy', handleCopy);
  return success ? Promise.resolve() : Promise.reject();
};
