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

import React, { FC, useRef, useEffect, useState } from 'react';
import { FloatUiTooltip } from '../tooltip';
import { IEllipsis, ITypographyProps } from './interface';
import { TypographyBase } from './styled';
import classNames from 'classnames';

const defaultVariantMapping: { [key: string]: string } = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  h7: 'h6',
  h8: 'h6',
  h9: 'h6',
  body1: 'p',
  body2: 'p',
  body3: 'p',
  body4: 'p',
};
export const Typography: FC<React.PropsWithChildren<ITypographyProps>> = (props) => {
  const {
    className,
    component,
    align = 'inherit',
    variant = 'body1',
    color = '',
    children,
    ellipsis = false,
    ...rest
  } = props;
  const typographyRef = useRef<HTMLDivElement>();
  const [isWithTooltip, setIsWithTooltip] = useState(false);
  const more = { align, variant, color, ...rest };
  const tag = component || defaultVariantMapping[variant] || 'span';

  useEffect(() => {
    if (typeof ellipsis === 'boolean' && typographyRef.current) {
      setIsWithTooltip(typographyRef.current.scrollWidth > typographyRef.current.clientWidth);
    }
  }, [typographyRef, ellipsis]);

  const getEllipsis = (ellipsis: IEllipsis | boolean): IEllipsis => {
    if (!ellipsis) {
      return {};
    }

    return {
      rows: 1,
      ...(typeof ellipsis === 'object' ? ellipsis : null)
    };
  };

  const { rows, tooltip } = getEllipsis(ellipsis);
  const cssTextOverflow = rows === 1;
  const cssLineClamp = rows && rows > 1;

  function isReactText(children: React.ReactNode) {
    return ['string', 'number'].includes(typeof children);
  }

  const textNode = <TypographyBase className={classNames('typography', className)} ref={typographyRef} as={tag as any} rows={rows} children={children}
    cssTextOverflow={cssTextOverflow} cssLineClamp={cssLineClamp} {...more} />;

  if ((typeof ellipsis !== 'boolean' && ellipsis.tooltip) || isWithTooltip) {
    const content = tooltip || (isReactText(children) ? children as string : '');
    return (
      <>
        {
          Boolean(content) ?
            <FloatUiTooltip
              content={content}
              options={
                {
                  initialVisible: false
                }
              }
            >
              {textNode}
            </FloatUiTooltip>:
            textNode
        }
      </>
    );
  }
  return textNode;
};

