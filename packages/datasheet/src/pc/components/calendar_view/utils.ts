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

import { IPosition } from './calendar_context';

const MODAL_WIDTH = 420;

export const getPosition = (e: React.MouseEvent) => {
  const rect = (e.target as any).getBoundingClientRect();
  const position: IPosition = {
    left: Math.min(rect.left + rect.width + 8, window.innerWidth - MODAL_WIDTH) + 'px',
  };
  if (rect.top < window.innerHeight / 2) {
    position.top = rect.top + rect.height + 8 + 'px';
  } else {
    position.bottom = window.innerHeight - rect.top + 'px';
  }
  return position;
};

export const formatString2Date = (value: string) => {
  const str = value.replace(/年| /, '-').replace(/月/, '');
  const parts = str.split('-');
  const year = parts[0];
  const month = parts[1].padStart(2, '0');
  return `${year}-${month}`;
};

export const isClickDragDropModal = (e: MouseEvent) => {
  const modalElement = document.querySelector('.dragDropModal');
  const moveElement = document.querySelector('.isMove');
  if ((modalElement && modalElement.contains(e.target as HTMLElement)) || (moveElement && moveElement.contains(e.target as HTMLElement))) return true;
  return false;
};
