import { memo } from 'react';
import { IElementRenderProps, IElement } from '../../interface/element';

import Decorate from '../element_decorate';

import styles from './style.module.less';

const Paragraph = memo(({ children, element }: IElementRenderProps<IElement>) => {

  return <Decorate element={element} className={styles.paragraph}>
    <p>{children}</p>
  </Decorate>;
});

export default Paragraph;