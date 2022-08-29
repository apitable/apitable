import { IElementRenderProps, IElement } from '../../interface/element';

import { MAX_INDENT } from '../../constant';

import styles from './ordered_list.module.less';

const counterReset = Array(MAX_INDENT + 1).fill('ordered').map((item, i) => `${item}-${i} 0`).join(' ');

const OrderedList = (props: IElementRenderProps<IElement>) => {

  const { children } = props;

  return <ol className={styles.orderedList} style={{ counterReset }}>{children}</ol>;
};

export default OrderedList;