import { FC, memo } from 'react';
import { NodeProps } from '@vikadata/react-flow-renderer';
import styles from './styles.module.less';
import { INodeData } from '../../interfaces';

export const CycleNode: FC<NodeProps<INodeData>> = memo((props) => {

  const {
    data,
  } = props;

  return (
    <div
      className={styles.cycleNode}
    >
      <span>{data.recordName}</span>
    </div>
  );
});
