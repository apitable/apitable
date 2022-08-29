import { IElementRenderProps, IElement } from '../../interface/element';

import styles from './unordered_list.module.less';

const UnorderedList = (props: IElementRenderProps<IElement>) => {

  const { children } = props;

  return <ul className={styles.unorderedList}>{children}</ul>;
};

export default UnorderedList;