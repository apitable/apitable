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

import { Row, Col } from 'antd';
import classNames from 'classnames';
import { useState, FC, useEffect } from 'react';
import { Button, TextButton, Pagination } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common';
import { exportExcelBase } from 'pc/utils';
import { IErrorInfo } from '../interface';
import styles from './style.module.less';

interface IRecordsProps {
  records: IErrorInfo[];
  showDetail?: boolean;
  close: () => void;
  init: () => void;
  title: string;
  subTitle: string;
  visible: boolean;
}

const PAGE_SIZE = 12;
const HeaderConfig = [
  { header: t(Strings.member_name), key: 'name', width: 30 },
  { header: t(Strings.team), key: 'team', width: 40 },
  { header: t(Strings.email), key: 'email', width: 40 },
  { header: t(Strings.error_detail), key: 'message', width: 40 },
];
export const Records: FC<React.PropsWithChildren<IRecordsProps>> = ({ records, title, subTitle, showDetail = false, close, init, visible }) => {
  const [pageNo, setPageNo] = useState(1);
  const [curRecords, setCurRecords] = useState<IErrorInfo[]>([]);
  useEffect(() => {
    const startIndex = (pageNo - 1) * PAGE_SIZE;
    const cur = records.slice(startIndex, startIndex + PAGE_SIZE);
    setCurRecords(cur);
  }, [pageNo, records]);

  const continueInvite = () => {
    init();
    close();
  };
  const ColConfig = {
    span: showDetail ? 6 : 8,
  };
  const downloadFail = async () => {
    const Excel = await import('exceljs');
    const workbook = new Excel.Workbook();
    const tempWorksheet = workbook.addWorksheet(t(Strings.failed_list));
    tempWorksheet.columns = HeaderConfig;
    tempWorksheet.addRows(curRecords);
    const fileName = t(Strings.failed_list);
    exportExcelBase(workbook, fileName);
  };
  return (
    <Modal visible={visible} footer={null} centered title={title} className={styles.records} width={640} destroyOnClose onCancel={close}>
      <div className={styles.subTitle}>{subTitle}</div>
      <Row className={styles.recordsTitle}>
        {HeaderConfig.map((item, index) => {
          if (index === 0)
            <Col {...ColConfig}>
              <div className={styles.firstCol} style={{ paddingLeft: '16px' }}>
                {item.header}
              </div>
            </Col>;
          if (index === HeaderConfig.length - 1) {
            return showDetail ? <Col {...ColConfig}>{item.header}</Col> : null;
          }
          return (
            <Col key={index} {...ColConfig}>
              {item.header}
            </Col>
          );
        })}
      </Row>
      <div className={styles.recordsWrap}>
        {curRecords.map((item, index) => (
          <Row key={index} className={styles.records}>
            <Col {...ColConfig}>
              <div className={classNames(styles.colContent, styles.firstCol)}>{item.name}</div>
            </Col>
            <Col {...ColConfig}>
              <div className={styles.colContent}>{item.team}</div>
            </Col>
            <Col {...ColConfig}>
              <div className={styles.colContent}>{item.email}</div>
            </Col>
            {showDetail && (
              <Col {...ColConfig}>
                <div className={styles.colContent}>{item.message}</div>
              </Col>
            )}
          </Row>
        ))}
      </div>
      <div className={styles.pagination}>
        <Pagination current={pageNo} total={records.length} pageSize={PAGE_SIZE} onChange={(pageNo) => setPageNo(pageNo)} />
      </div>
      {showDetail && (
        <div className={styles.btnWrap}>
          <TextButton style={{ marginRight: '10px' }} size="small" onClick={downloadFail}>
            {t(Strings.failed_list_file_download)}
          </TextButton>
          <Button color="primary" size="small" onClick={continueInvite}>
            {t(Strings.invite_outsider_keep_on)}
          </Button>
        </div>
      )}
    </Modal>
  );
};
