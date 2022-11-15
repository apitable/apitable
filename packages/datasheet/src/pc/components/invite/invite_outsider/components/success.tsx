import { FC, useState } from 'react';
import SuccessIcon from 'static/icon/common/common_tip_success_small.svg';
import styles from './style.module.less';
import { IUploadFileResponse } from '../interface';
import WarnIcon from 'static/icon/common/common_tip_default_small.svg';
import { Button, TextButton } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { Records } from './records';

interface IErrorContentProps {
  responseInfo: IUploadFileResponse | null;
  close: () => void;
  init: () => void;
}
export const Success: FC<IErrorContentProps> = ({ responseInfo, close, init }) => {
  const [showErrors, setShowErrors] = useState(false);
  if(!responseInfo){
    return null;
  }
  const { successCount, errorCount, errorList } = responseInfo;
  const readErrorList = () => {
    setShowErrors(true);
  };

  const hasErr = errorCount !== 0;
  return (
    <div className={styles.success}>
      {
        !hasErr ?
          <span className={styles.successIcon}><SuccessIcon /></span> :
          <span className={styles.errorIcon}><WarnIcon /></span>
      }
      <div className={styles.text}>
        <span>{t(Strings.total_import_employee_by_count, {
          rowCount: successCount + errorCount,
        })}</span>
        <span>{t(Strings.display_success_and_error_count, {
          successCount,
          errorCount,
        })}</span>
        {
          hasErr &&
          <TextButton onClick={readErrorList} size="x-small" className={styles.reload}>
            {t(Strings.check_failed_list)}
          </TextButton>
        }
      </div>
      <div className={styles.btnWrapper}>
        <TextButton
          style={{ marginRight: '10px' }}
          onClick={init}
          size="small"
        >
          {t(Strings.invite_outsider_keep_on)}
        </TextButton>
        <Button
          color="primary"
          onClick={close}
          size="small"
        >
          {t(Strings.finish)}
        </Button>
      </div>
      <Records 
        records={errorList} 
        showDetail 
        close={()=>setShowErrors(false)} 
        init={init}
        title={t(Strings.failed_list)}
        subTitle={t(Strings.total_error_records_count, { errorCount: errorList.length })}
        visible={showErrors}
      />
    </div>
  );
};
