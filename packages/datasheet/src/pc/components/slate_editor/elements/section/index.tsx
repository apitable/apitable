import { memo } from 'react';
import { IElementRenderProps, IElement } from '../../interface/element';
import styles from './style.module.less';

const Section = memo(({ attributes, children, element }: IElementRenderProps<IElement>) => {
  return <div
    {...attributes}
    data-element-type={element.type}
    data-node-type={element.object}
    className={styles.section}
  >
    {children}
  </div>;
});

export default Section;