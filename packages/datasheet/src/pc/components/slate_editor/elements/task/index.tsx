import { IElementRenderProps, IElement } from '../../interface/element';

import styles from './task.module.less';

const TaskWrap = (props: IElementRenderProps<IElement>) => {

  const { children } = props;

  return <dl className={styles.task}>{children}</dl>;
};

export default TaskWrap;