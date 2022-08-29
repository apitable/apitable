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
