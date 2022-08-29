import { View } from '../view';
import { Skeleton } from '@vikadata/components';
import { IReduxState, Selectors } from '@vikadata/core';
import { connect } from 'react-redux';
import styles from './style.module.less';
export interface ITableViewProps {
  loading: boolean;
}

export const ViewContainerBase = (props: ITableViewProps) => {

  return <>
    {
      props.loading
        ? <div className={styles.skeletonWrapper}>
          <Skeleton height="24px" />
          <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
        </div>
        : <View />
    }
  </>;
};

export const ViewContainer = connect((state: IReduxState) => {
  const datasheet = Selectors.getDatasheet(state);
  return {
    loading: !datasheet || datasheet.isPartOfData,
  };
})(ViewContainerBase as any) as any;
