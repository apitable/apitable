import { IElementRenderProps, IElement } from '../../interface/element';

import styles from './quote_item.module.less';

import Decorate from '../element_decorate';

const QuoteItem = (props: IElementRenderProps<IElement>) => {
  const { children, attributes, element } = props;

  return <Decorate element={element} operationClassName={styles.quoteItemOpt}>
    <div {...attributes} className={styles.quoteItem}>{children}</div>
  </Decorate>;
};

export default QuoteItem;