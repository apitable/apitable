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

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import store from 'store2';
import { Button, colorVars, Message, Modal, Typography } from '@apitable/components';
import { Events, Player, ConfigConstant } from '@apitable/core';
import { resourceService } from 'pc/resource_service';

export const ApplyBackupData = () => {
  const db = resourceService.instance!.roomService.backupDB;
  const [backupTimeList, setBackupTimeList] = useState<number[]>([]);
  const [updater, setUpdater] = useState(false);

  useEffect(() => {
    const backupStorage = store.namespace(`${ConfigConstant.LS_DATASHEET_NAMESPACE}.backup`);
    const backupMap = backupStorage.getAll();

    for (const timestamp in backupMap) {
      db.setItem(timestamp, backupMap[timestamp]).then(() => {
        backupStorage.remove(timestamp);
      });
    }

    db.keys().then((keys) => {
      const timestamps = [...keys.map((item) => item), ...Object.keys(backupMap)];
      setBackupTimeList(timestamps.map((item) => Number(item)).sort((a, b) => a - b));
    });
  }, [updater, db]);

  const apply = async (timestamp: number) => {
    const backupData = await db.getItem(String(timestamp));
    try {
      const { changesetMap, opBufferMap } = backupData as any;
      await db.removeItem(String(timestamp));
      await resourceService.instance?.roomService.applyLocalData(changesetMap, opBufferMap);
    } catch (e: any) {
      await db.setItem(String(timestamp), backupData);
      Player.doTrigger(Events.app_error_logger, {
        error: new Error(`恢复数据失败：${e.message}`),
      });

      Message.warning({ content: `恢复数据失败: ${e.message}` });
    }
    setUpdater(!updater);
  };

  if (!backupTimeList.length) {
    return <div>暂无需要恢复的数据</div>;
  }

  const deleteBackup = (timestamp: number) => {
    Modal.danger({
      title: '删除备份数据',
      content: '删除的数据将无法找回',
      closable: true,
      onOk: () => {
        db?.removeItem(String(timestamp));
        setUpdater(!updater);
      },
      onCancel() {},
      okText: '删除',
    });
  };

  const exportBackupData = async (timestamp: number) => {
    const Excel = await import('exceljs');
    const workbook = new Excel.Workbook();
    const tempWorksheet = workbook.addWorksheet('backup');
    tempWorksheet.columns = [{ header: dayjs.tz(timestamp).format('YYYY-MM-DD hh:mm:ss') }];
    tempWorksheet.addRows([[await db.getItem(String(timestamp))]]);
    await workbook.csv.writeBuffer({ encoding: 'UTF-8' }).then((buffer) => {
      const blob = new Blob([buffer], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'backup.csv';
      link.click();
      Message.success({
        content: 'export success',
      });
    });
  };

  return (
    <div>
      <Typography variant={'h4'} color={colorVars.warningColor}>
        操作提示
      </Typography>
      <Typography variant={'body1'} color={colorVars.warningColor}>
        1. 为了确保数据最终的正确性，数据的恢复需要从旧到新逐步恢复
      </Typography>
      <Typography variant={'body1'} color={colorVars.warningColor}>
        2. 部分备份的数据会因为数据量过大或者其他错误原因导致无法正常恢复，可以通过删除此备份数据进行跳过，但在删除前，请确保无法正常恢复
      </Typography>
      <Typography variant={'body1'} color={colorVars.warningColor} style={{ marginBottom: 24 }}>
        3. 如有疑问请通过页面左下角的「帮助-联系客服」反馈
      </Typography>

      {backupTimeList.map((timestamp, index) => {
        return (
          <div key={index} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant={'body2'}>{dayjs.tz(timestamp).format('YYYY-MM-DD hh:mm:ss')}</Typography>
            <div>
              <Button
                size={'small'}
                color={'primary'}
                onClick={() => {
                  exportBackupData(timestamp);
                }}
                style={{ marginRight: 8 }}
              >
                导出
              </Button>
              <Button
                size={'small'}
                color={'warning'}
                onClick={() => {
                  apply(timestamp);
                }}
                disabled={Boolean(index)}
                style={{ marginRight: 8 }}
              >
                恢复
              </Button>
              <Button
                size={'small'}
                color={'danger'}
                onClick={() => {
                  deleteBackup(timestamp);
                }}
                disabled={Boolean(index)}
              >
                删除
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
