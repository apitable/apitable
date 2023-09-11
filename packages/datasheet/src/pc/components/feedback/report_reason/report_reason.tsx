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

import { useClickAway } from 'ahooks';
import { Radio } from 'antd';
import Image from 'next/image';
import { FC, useRef, useState } from 'react';
import { Button } from '@apitable/components';
import { Api, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { useRequest } from 'pc/hooks';
import ReportImg from 'static/icon/workbench/workbench_img_report.png';
import styles from './style.module.less';

const reasonList = [
  t(Strings.report_reason_1),
  t(Strings.report_reason_2),
  t(Strings.report_reason_3),
  t(Strings.report_reason_4),
  t(Strings.report_reason_5),
];
interface IReportReasonProps {
  nodeId: string;
  onClose: () => void;
}

export const ReportReason: FC<React.PropsWithChildren<IReportReasonProps>> = ({ nodeId, onClose }) => {
  const [reason, setReason] = useState<string>('');
  const { run: createReport, loading } = useRequest(
    (nodeId, reason) =>
      Api.createReport(nodeId, reason).then((res) => {
        const { success } = res.data;
        if (success) {
          Message.success({ content: t(Strings.report_success_tip) });
        } else {
          Message.error({ content: t(Strings.something_wrong) });
        }
      }),
    { manual: true },
  );
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(() => {
    onClose();
  }, ref);

  const onChange = (e: any) => {
    setReason(e.target.value);
  };

  const onSubmit = (reason: string) => {
    if (!reason) {
      return;
    }
    createReport(nodeId, reason);
    onClose();
  };

  return (
    <div className={styles.reportReasonWrap} ref={ref}>
      <div className={styles.img}>
        <Image src={ReportImg} alt={t(Strings.inform)} />
      </div>
      <div className={styles.reportReason}>
        <div className={styles.title}>{t(Strings.placeholder_select_report_reason)}</div>
        <Radio.Group onChange={onChange} value={reason}>
          {reasonList.map((item) => (
            <Radio value={item} key={item}>
              {item}
            </Radio>
          ))}
        </Radio.Group>
        <div className={styles.buttonWrap}>
          <Button color="primary" size="small" onClick={() => onSubmit(reason)} loading={loading} disabled={!reason}>
            {t(Strings.button_submit)}
          </Button>
        </div>
      </div>
    </div>
  );
};
