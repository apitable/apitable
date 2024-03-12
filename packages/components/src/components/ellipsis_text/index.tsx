import React, { cloneElement, useState, useEffect, FC, ReactElement } from 'react';
import { FloatUiTooltip } from '../tooltip';
import { ITypographyProps } from '../typography';

const ellipsisDefaultStyle = {
  overflow: 'hidden',
  overflowWrap: 'break-word',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordBreak: 'break-all',
};

const EllipsisText: FC<{
  children: ReactElement<React.PropsWithChildren<ITypographyProps>>,
    style?: StyleSheet,
}> = ({ style = {}, children }) => {
  const [hasOverflowingChildren, setHasOverflowingChildren] = useState(false);
  const [prevPropsChildren, setPrevPropsChildren] = useState(children);

  useEffect(() => {
    if (children !== prevPropsChildren) {
      setHasOverflowingChildren(false);
      setPrevPropsChildren(children);
    }
  }, [children, prevPropsChildren]);

  const ellipsisStyle = { ...ellipsisDefaultStyle, ...style } as any;

  const content =
      cloneElement(children, {
        style: ellipsisStyle
      });
  return hasOverflowingChildren ? (
    <FloatUiTooltip
      content={
        <>{children}
        </>
      }
    >
      {
        content
      }
    </FloatUiTooltip>
  ) : (
    content
  );
};

export default EllipsisText;

