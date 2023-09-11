/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { FC, useState } from 'react';
import { Button, TextButton } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { CheckOutlined, WarnOutlined } from '@apitable/icons';
import { IUploadFileResponse } from '../interface';
import { Records } from './records';
import styles from './style.module.less';

interface IErrorContentProps {
  responseInfo: IUploadFileResponse | null;
  close: () => void;
  init: () => void;
}
export const Success: FC<React.PropsWithChildren<IErrorContentProps>> = ({ responseInfo, close, init }) => {
  const [showErrors, setShowErrors] = useState(false);
  if (!responseInfo) {
    return null;
  }
  const { successCount, errorCount, errorList } = responseInfo;
  const readErrorList = () => {
    setShowErrors(true);
  };

  const hasErr = errorCount !== 0;
  return (
    <div className={styles.success}>
      {!hasErr ? (
        <span className={styles.successIcon}>
          <CheckOutlined />
        </span>
      ) : (
        <span className={styles.errorIcon}>
          <WarnOutlined />
        </span>
      )}
      <div className={styles.text}>
        <span>
          {t(Strings.total_import_employee_by_count, {
            rowCount: successCount + errorCount,
          })}
        </span>
        <span>
          {t(Strings.display_success_and_error_count, {
            successCount,
            errorCount,
          })}
        </span>
        {hasErr && (
          <TextButton onClick={readErrorList} size="x-small" className={styles.reload}>
            {t(Strings.check_failed_list)}
          </TextButton>
        )}
      </div>
      <div className={styles.btnWrapper}>
        <TextButton style={{ marginRight: '10px' }} onClick={init} size="small">
          {t(Strings.invite_outsider_keep_on)}
        </TextButton>
        <Button color="primary" onClick={close} size="small">
          {t(Strings.finish)}
        </Button>
      </div>
      <Records
        records={errorList}
        showDetail
        close={() => setShowErrors(false)}
        init={init}
        title={t(Strings.failed_list)}
        subTitle={t(Strings.total_error_records_count, { errorCount: errorList.length })}
        visible={showErrors}
      />
    </div>
  );
};
