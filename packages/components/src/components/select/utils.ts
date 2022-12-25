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

import { IOption } from './interface';
import { isFragment } from 'react-is';
import React from 'react';

export default function toArray(
  children: React.ReactNode,
): React.ReactElement[] {
  let ret: React.ReactElement[] = [];

  React.Children.forEach(children, (child: any) => {
    if (child == null) {
      return;
    }

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children));
    } else {
      ret.push(child);
    }
  });
  return ret;
}

function convertNodeToOption(node: React.ReactElement): IOption {
  const {
    props: { children, value, ...restProps },
  } = node as React.ReactElement;

  return { value: value, label: children, ...restProps };
}

export function convertChildrenToData(
  nodes: React.ReactNode,
  optionOnly = false,
): (IOption | null)[] {
  return toArray(nodes)
    .map((node: React.ReactElement, index: number): IOption | null => {
      if (!React.isValidElement(node)) {
        return null;
      }
      const {
        key,
        props: { children, ...restProps },
      } = node as React.ReactElement;

      if (optionOnly) {
        return convertNodeToOption(node);
      }

      return {
        key: key == null ? index : key,
        label: children,
        ...restProps,
        // options: convertChildrenToData(children),
      } as IOption;
    })
    .filter(data => data);
}
