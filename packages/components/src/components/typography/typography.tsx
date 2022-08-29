import React, { FC, useRef, useEffect, useState } from 'react';
import { Tooltip } from '../tooltip';
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
export const Typography: FC<ITypographyProps> = (props) => {
  const {
    className,
    component,
    align = 'inherit',
    variant = 'body1',
    color = '',
    children,
    ellipsis = false,
    tooltipsZIndex,
    ...rest
  } = props;
  const typographyRef = useRef<HTMLDivElement>();
  // 是否显示tooltip（用于一行）
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

  const textNode = <TypographyBase className={classNames('typography', className)} ref={typographyRef} as={tag} rows={rows} children={children}
    cssTextOverflow={cssTextOverflow} cssLineClamp={cssLineClamp} {...more} />;
  if ((typeof ellipsis !== 'boolean' && ellipsis.tooltip) || isWithTooltip) {
    return <Tooltip
      visible={typeof ellipsis !== 'boolean' ? ellipsis.visible : undefined}
      zIndex={tooltipsZIndex}
      content={tooltip || (isReactText(children) ? children as string : '')}
    >
      {textNode}
    </Tooltip>;
  }
  return textNode;
};

