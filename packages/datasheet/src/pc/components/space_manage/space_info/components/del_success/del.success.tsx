import { FC, useState } from 'react';
import { Modal } from 'antd';
import styles from './style.module.less';
import SuccessIcon from 'static/icon/common/common_icon_tips.svg';
import { Navigation, Strings, t } from '@vikadata/core';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
import { useMount } from 'ahooks';

interface IResModal {
  tip: string;
}

export const DelSuccess: FC<IResModal> = ({ tip }) => {
  const navigationTo = useNavigation();
  const [timer, setTimer] = useState<number>();
  // const dispatch = useDispatch();

  useMount(() => {
    const timeout = setTimeout(() => {
      // dispatch(StoreActions.setActiveSpaceId(''));
      navigationTo({ path: Navigation.HOME, method: Method.Redirect });
    }, 3000);
    setTimer(timeout as any as number);
  });

  const onCancel = () => {
    clearTimeout(timer);
    // dispatch(StoreActions.setActiveSpaceId(''));
    navigationTo({ path: Navigation.HOME, method: Method.Redirect });
  };

  return (
    <Modal
      visible
      footer={null}
      width={390}
      maskClosable={false}
      bodyStyle={{ padding: '24px' }}
      centered
      onCancel={onCancel}
    >
      <div className={styles.delSuccess}>
        <SuccessIcon width={70} height={70} fill="#52C41A" />
        <div className={styles.title}>{t(Strings.delete_succeed)}</div>
        <div className={styles.tip}>{tip}</div>
      </div>
    </Modal>
  );
};
