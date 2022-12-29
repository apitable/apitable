import { useMemo } from 'react';
import * as React from 'react';
import cx from 'classnames';
import styles from './block.module.less';

interface IBlockProps {
  style?: React.CSSProperties;
  className?: string;
  flex?: number;
  vertical?: boolean;
  isWrap?: boolean;
  visible?: boolean;
}

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

  return <div className={cx(className, styles.block, { [styles.vertical]: vertical })} style={blockStyle}>
    {isWrap
      ? children
      : <div className={styles.blockContent}>
        { children && React.cloneElement(children, { className: cx(children.props.className, styles.contentShadow) }) }
      </div>
    }
  </div>;
};