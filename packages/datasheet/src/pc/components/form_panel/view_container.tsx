import { Skeleton } from '@apitable/components';
import styles from './style.module.less';
import { FormContainer } from '../form_container';

export const ViewContainer = (props) => {
  if (props.loading) {
    return (
      <div className={styles.skeletonWrapper}>
        <Skeleton height="24px" />
        <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
      </div>
    );
  }

  return (
    <FormContainer />
  );
};
