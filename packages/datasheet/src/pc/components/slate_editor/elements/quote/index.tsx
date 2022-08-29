import { IElementRenderProps, IElement } from '../../interface/element';

import styles from './quote.module.less';

const QuoteWrap = (props: IElementRenderProps<IElement>) => {

  const { children } = props;

  return <blockquote className={styles.quote}>{children}</blockquote>;
};

export default QuoteWrap;