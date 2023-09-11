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

import { useSelectIndex } from 'pc/hooks';
import { IUseSelectProps } from '../../hooks/use_select_index';
interface IUseListInteractive {
  activeItemClass: string;
}

type IUnionProps = IUseSelectProps & IUseListInteractive;

export const useListInteractive = (options: IUnionProps) => {
  const { activeItemClass } = options;
  const { index: activeIndex, setIndex: setActiveIndex } = useSelectIndex({ ...options, activeItemClass: `.${activeItemClass}` });

  // TODO: Consider how to combine Hover and keyboard events, and combine the two classes into one
  // const onHoverListItem = (e: React.MouseEvent) => {
  //   const element = e.currentTarget;
  //   const classList = element.classList;
  //   if (!classList.contains(activeItemClass)) {
  //     classList.add(activeItemClass);
  //     const index = (e.currentTarget as HTMLElement).dataset.tabIndex;
  //     index && setActiveIndex(parseInt(index, 10));
  //   }
  // };

  // const onOutListItem = (e: React.MouseEvent) => {
  //   const element = e.currentTarget;
  //   const classList = element.classList;
  //   if (classList.contains(activeItemClass)) {
  //     classList.remove(activeItemClass);
  //     const index = (e.currentTarget as HTMLElement).dataset.tabIndex;
  //     index && setActiveIndex(parseInt(index, 10));
  //   }
  // };

  return {
    activeIndex: activeIndex,
    setActiveIndex: setActiveIndex,
    // onHoverListItem: onHoverListItem,
    // onOutListItem: onOutListItem,
  };
};
