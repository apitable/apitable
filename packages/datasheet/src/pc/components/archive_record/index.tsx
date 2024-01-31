import { Drawer, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { produce } from 'immer';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Box, IconButton } from '@apitable/components';
import { DATASHEET_ID, Strings, t, DatasheetApi, Selectors, CollaCommandName, fastCloneDeep, Field, FieldType } from '@apitable/core';
import { RestoreOutlined, DeleteOutlined, ArchiveOutlined, QuestionCircleOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Avatar, Message, Tooltip } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { ToolItem } from 'pc/components/tool_bar/tool_item';
import { useRequest } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { IArchivedRecordsProps } from './interface';
import styles from './style.module.less';

interface ITableParams {
  pageNum: number;
  pageSize: number;
}

const handleRecordsData = (recordsData) => {
  return recordsData
    .map((item) => {
      const { record, archivedUser, archivedAt } = item;
      if (record?.data) {
        const recordData = record.data;
        return {
          ...recordData,
          key: record.id,
          archivedUser: archivedUser,
          archivedTime: archivedAt,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};

const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      Message.success({ content: t(Strings.copy_success) });
    })
    .catch((err) => {
      Message.error({ content: t(Strings.copy_failed) });
    });
};

export const ArchivedRecords: React.FC<React.PropsWithChildren<IArchivedRecordsProps>> = (props) => {
  const { className, showLabel = true, isHide } = props;
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState<ITableParams>({
    pageNum: 1,
    pageSize: 20,
  });

  const [recordData, setRecordData] = useState<any[]>([]);
  const [recordsDataMap, setRecordsDataMap] = useState(new Map());

  const datasheetId = useAppSelector((state) => state.pageParams.datasheetId)!;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId))!;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const visibleColumns = useAppSelector((state) => Selectors.getVisibleColumns(state, datasheetId))!;
  const permissions = useAppSelector((state) => Selectors.getPermissions(state, datasheetId));
  const { run: getArchivedRecords, loading: archivedRecordsLoading } = useRequest(() => DatasheetApi.getArchivedRecords(datasheetId, tableParams), {
    manual: true,
    onSuccess(res) {
      const { success, data } = res.data;
      if (success) {
        const { total, records } = data;
        setTotal(total);
        setRecordData(records);

        const cloneRecords = fastCloneDeep(records);

        const recordsMap = new Map();
        cloneRecords.forEach((item) => {
          recordsMap.set(item.record.id, item.record);
        });
        setRecordsDataMap(recordsMap);
      }
    },
  });

  useEffect(() => {
    if (!open) return;
    getArchivedRecords();
  }, [tableParams, open]);

  const updateRecordData = (records: any[]) => {
    const newRecords = produce(recordData, (draft) => {
      records.forEach((record) => {
        const index = draft.findIndex((item) => item.record.id === record.id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      });
    });
    setRecordData(newRecords);
    setTotal(total - records.length);
  };

  const cancelArchived = (record) => {
    const data: any[] = [];

    data.push(recordsDataMap.get(record.key));

    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.UnarchiveRecords,
      data,
    });

    if (result === 'Success') {
      Message.success({ content: t(Strings.restore_success) });
      updateRecordData(data);
    }
  };

  const batchCancelArchived = () => {
    const data: any[] = [];

    selectedRowKeys.forEach((key) => {
      data.push(recordsDataMap.get(key));
    });

    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.UnarchiveRecords,
      data,
    });

    if (result === 'Success') {
      Message.success({ content: t(Strings.restore_success) });
      setSelectedRowKeys([]);
      updateRecordData(data);
    }
  };

  const deleteRecord = (record) => {
    const data: any[] = [];

    data.push(recordsDataMap.get(record.key));

    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteArchivedRecords,
      data,
    });

    if (result === 'Success') {
      Message.success({ content: t(Strings.delete_archive_record_success) });
      updateRecordData(data);
    }
  };

  const batchDeleteRecord = () => {
    const data: any[] = [];

    selectedRowKeys.forEach((key) => {
      data.push(recordsDataMap.get(key));
    });

    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteArchivedRecords,
      data,
    });

    if (result === 'Success') {
      Message.success({ content: t(Strings.delete_archive_record_success) });
      setSelectedRowKeys([]);
      updateRecordData(data);
    }
  };

  const showArchivedCellValue = (cellValue, key) => {
    switch (fieldMap[key].type) {
      case FieldType.Text:
      case FieldType.URL:
      case FieldType.Email:
      case FieldType.Phone:
      case FieldType.SingleText:
      case FieldType.DateTime:
      case FieldType.CreatedTime:
      case FieldType.LastModifiedTime:
      case FieldType.Number:
      case FieldType.SingleSelect:
      case FieldType.MultiSelect:
      case FieldType.Member:
      case FieldType.CreatedBy:
      case FieldType.LastModifiedBy:
      case FieldType.Rating:
      case FieldType.Formula:
      case FieldType.Checkbox:
        return Field.bindModel(fieldMap[key]).cellValueToString(cellValue);
      case FieldType.Attachment:
        return cellValue?.map((item) => `${item.name} (${getEnvVariables()[item.bucket] + item.token})`).join(', ');
      case FieldType.Link:
      case FieldType.OneWayLink:
        return Array.isArray(cellValue) ? cellValue.map((item) => item).join(', ') : cellValue;
      case FieldType.Currency:
      case FieldType.Percent:
      case FieldType.AutoNumber:
      case FieldType.Cascader:
      case FieldType.LookUp:
      default:
        return JSON.stringify(cellValue);
    }
  };

  const columns: ColumnsType<any> = useMemo(() => {
    let firstColumn = {};

    const fieldMapColums: ColumnsType = Object.keys(fieldMap)
      .map((key) => {
        const { name, id } = fieldMap[key];
        const fieldSetting: any = {
          title: name,
          key: id,
          dataIndex: id,
          width: 200,
          ellipsis: true,
          render: (cellValue) => (
            <div
              className={styles.cellValue}
              onClick={() => {
                copyToClipboard(showArchivedCellValue(cellValue, key));
              }}
            >
              {showArchivedCellValue(cellValue, key)}
            </div>
          ),
        };
        if (key === visibleColumns[0].fieldId) {
          fieldSetting.fixed = 'left';
          firstColumn = fieldSetting;
          return null;
        }
        return fieldSetting;
      })
      .filter((item) => item !== null);

    fieldMapColums.unshift(firstColumn);

    fieldMapColums.push({
      title: t(Strings.archived_by),
      key: 'archivedUser',
      dataIndex: 'archivedUser',
      width: 200,
      render: (archivedUser) => (
        <div className={styles.archivedBy}>
          <Avatar size={24} id={archivedUser.id} title={archivedUser.nikeName} src={archivedUser.avatar} />
          <span>{archivedUser.nikeName}</span>
        </div>
      ),
    });

    fieldMapColums.push({
      title: t(Strings.archived_time),
      key: 'archivedTime',
      dataIndex: 'archivedTime',
      width: 200,
      render: (time) => <div className={styles.cellValue}>{dayjs.tz(time).format('YYYY-MM-DD HH:mm:ss')}</div>,
    });

    fieldMapColums.push({
      title: t(Strings.archived_action),
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <div className={styles.toolList}>
          <Tooltip title={t(Strings.archived_undo)}>
            <span>
              <RestoreOutlined
                onClick={() => {
                  Modal.warning({
                    title: t(Strings.archived_undo),
                    content: t(Strings.unarchive_notice),
                    onOk: () => cancelArchived(record),
                    closable: true,
                    hiddenCancelBtn: false,
                  });
                }}
              />
            </span>
          </Tooltip>
          <Tooltip title={t(Strings.archive_delete_record_title)}>
            <span>
              <DeleteOutlined
                onClick={() => {
                  Modal.danger({
                    title: t(Strings.archive_delete_record),
                    content: t(Strings.delete_archived_records_warning_description),
                    onOk: () => deleteRecord(record),
                    closable: true,
                    hiddenCancelBtn: false,
                  });
                }}
              />
            </span>
          </Tooltip>
        </div>
      ),
    });

    return fieldMapColums;
  }, [fieldMap, recordData]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onDrawerClose = () => {
    setOpen(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pageNum: pagination.current || 1,
      pageSize: pagination.pageSize || 20,
    });
    setSelectedRowKeys([]);
  };

  const hasSelected = selectedRowKeys.length > 0;

  const TitleComponents = useCallback(() => {
    return (
      <div className={styles.header}>
        <p>{t(Strings.archived_records)} </p>
        <Tooltip title={t(Strings.robot_panel_help_tooltip)}>
          <Box display="flex" alignItems="center">
            <IconButton
              shape="square"
              icon={QuestionCircleOutlined}
              onClick={() => {
                window.open(getEnvVariables().ARCHIVED_HELP_LINK);
              }}
            />
          </Box>
        </Tooltip>
      </div>
    );
  }, []);

  return (
    <>
      <ToolItem
        key="archivedRecords"
        icon={<ArchiveOutlined size={16} />}
        showLabel={isHide ?? showLabel}
        className={classnames(className)}
        text={t(Strings.archived_records)}
        onClick={showDrawer}
        id={DATASHEET_ID.ARCHIVED_RECORDS_BTN}
        disabled={!permissions.editable}
      />
      <Drawer
        className="archiveDrawer"
        title={<TitleComponents />}
        placement="right"
        onClose={onDrawerClose}
        width={window.innerWidth * 0.9}
        open={open}
      >
        <div className={styles.batchHandle}>
          <Button
            disabled={!hasSelected}
            onClick={() => {
              Modal.warning({
                title: t(Strings.archived_undo),
                content: t(Strings.unarchive_notice),
                onOk: () => batchCancelArchived(),
                closable: true,
                hiddenCancelBtn: false,
              });
            }}
            variant="fill"
            size="small"
            prefixIcon={<RestoreOutlined currentColor />}
          >
            {t(Strings.archived_undo)}
          </Button>
          <Button
            disabled={!hasSelected}
            variant="fill"
            onClick={() => {
              Modal.danger({
                title: t(Strings.archive_delete_record),
                content: t(Strings.delete_archived_records_warning_description),
                onOk: () => batchDeleteRecord(),
                closable: true,
                hiddenCancelBtn: false,
              });
            }}
            size="small"
            prefixIcon={<DeleteOutlined currentColor />}
          >
            {t(Strings.delete_record)}
          </Button>
          {hasSelected && <p>{t(Strings.archived_select_info, { selected: selectedRowKeys.length })}</p>}
        </div>
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          loading={archivedRecordsLoading}
          columns={columns}
          scroll={{ x: window.innerWidth * 0.9, y: window.innerHeight - 234 }}
          dataSource={handleRecordsData(fastCloneDeep(recordData))}
          pagination={{
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} total`,
            current: tableParams.pageNum,
            pageSize: tableParams.pageSize,
          }}
          onChange={handleTableChange}
          className="archivedRecordsTable"
        />
      </Drawer>
    </>
  );
};
