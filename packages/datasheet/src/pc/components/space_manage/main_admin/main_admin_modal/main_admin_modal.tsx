import { Button, Typography } from '@vikadata/components';
import { IReduxState, Navigation, Strings, t } from '@vikadata/core';
import { Steps } from 'antd';
import classNames from 'classnames';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SuccessIcon from 'static/icon/common/common_icon_success.svg';
import { SelectAdmin } from '../select_admin';
import { VerifyAdmin } from '../verify_admin';
import styles from './style.module.less';

const { Step } = Steps;

interface IModalProps {
  cancelModal: () => void;
}

export const MainAdminModal: FC<IModalProps> = ({ cancelModal }) => {
  const [current, setCurrent] = useState(0);
  const navigationTo = useNavigation();
  const userInfo = useSelector((state: IReduxState) => state.user.info);
  const progressDot = (dot, { status, index }) => {
    return (
      <span
        className={
          classNames({
            [styles.finish]: status === 'finish',
            [styles.process]: status === 'process',
            [styles.wait]: status === 'wait'
          })
        }
      >
        {index + 1}
      </span>
    );
  };
  useEffect(() => {
    if (!userInfo) {
      return;
    }
    if (!userInfo.isAdmin) {
      navigationTo({ path: Navigation.HOME });
    }
  }, [userInfo, navigationTo]);
  const cancelModalAndInit = () => {
    if (current === 2) {
      navigationTo({ path: Navigation.HOME, method: Method.Redirect });
    } else {
      cancelModal();
    }
  };
  const successStep = () => {
    return (
      <div className={styles.successStep}>
        <SuccessIcon className={styles.successIcon} />
        <div className={styles.successText}>{t(Strings.change_primary_admin_succeed)}</div>
        <Button
          style={{ marginTop: '30px' }}
          htmlType='submit'
          onClick={cancelModalAndInit}
          size='large'
          block
          color='primary'
        >
          {t(Strings.back_to_workbench)}
        </Button>
        <span className={styles.informationText}>{t(Strings.space_manage_infomation_text)}</span>
      </div>
    );
  };
  const steps = [
    {
      title: t(Strings.space_manage_verify_primary_admin),
      content: <VerifyAdmin setCurrent={setCurrent} />
    },
    {
      title: t(Strings.space_manage_choose_new_primary_admin),
      content: <SelectAdmin setCurrent={setCurrent} />
    },
    {
      title: t(Strings.finish),
      content: successStep()
    }
  ];

  return (
    <Modal
      footer={null}
      visible
      className={styles.superAdminModal}
      centered
      width={'80%'}
      style={{ maxWidth: '1170px', minWidth: '530px' }}
      maskClosable
      onCancel={cancelModalAndInit}
    >
      <Typography variant='h6'>{t(Strings.change_primary_admin)}</Typography>
      <div className={styles.stepWrapper}>
        <Steps current={current} labelPlacement='vertical' progressDot={progressDot}>
          {
            steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))
          }
        </Steps>
        {
          steps.map((item, index) => (
            <div style={{ display: current === index ? 'block' : 'none' }} key={item.title}>{item.content}</div>
          ))
        }
      </div>

    </Modal>
  );
};
