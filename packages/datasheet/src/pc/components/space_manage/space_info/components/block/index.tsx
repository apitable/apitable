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

import cx from 'classnames';
import { useMemo } from 'react';
import * as React from 'react';
import styles from './block.module.less';

interface IBlockProps {
  style?: React.CSSProperties;
  className?: string;
  flex?: number;
  vertical?: boolean;
  isWrap?: boolean;
  visible?: boolean;
}

/*
  <Block isWrap>
    <Block>
      <div>test</div>
    </Block>
  </Block>

  如果是像上面的写法，一个 block 包裹一个 block，则外层的 block 需要设置 isWrap，内层的 block 不需要设置 isWrap
*/

export const Block = (props: IBlockProps & React.PropsWithChildren<any>) => {
  const { children, style, className, flex = 1, vertical, isWrap, visible = true } = props;

  const blockStyle = useMemo(() => {
    const innerStyle = style || {};
    if (flex) {
      innerStyle.flex = flex;
    }
    if (isWrap) {
      const attr = vertical ? 'height' : 'width';
      innerStyle[attr] = '100%';
      innerStyle.display = 'flex';
    }
    if (!visible) {
      innerStyle.visibility = 'hidden';
    }
    return innerStyle;
  }, [style, flex, isWrap, vertical, visible]);

  return (
    <div className={cx(className, styles.block, { [styles.vertical]: vertical })} style={blockStyle}>
      {isWrap ? (
        children
      ) : (
        <div className={styles.blockContent}>
          {children && React.cloneElement(children, { className: cx(children.props.className, styles.contentShadow) })}
        </div>
      )}
    </div>
  );
};
