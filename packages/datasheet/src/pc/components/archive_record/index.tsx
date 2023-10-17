import { Drawer, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import classnames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@apitable/components';
import { DATASHEET_ID, Strings, t, DatasheetApi, Selectors, CollaCommandName, fastCloneDeep, Field, FieldType } from '@apitable/core';
import { RestoreOutlined, DeleteOutlined, ArchiveOutlined } from '@apitable/icons';
import { Tooltip, Avatar, Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { ToolItem } from 'pc/components/tool_bar/tool_item';
import { useRequest } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { IArchivedRecordsProps } from './interface';
// eslint-disable-next-line no-restricted-imports
import styles from './style.module.less';

const handleRecordsData = (recordsData) => {
  const data = recordsData.map(item => {
    const { record, archivedUser, archivedAt } = item;
    const recordData = record.data;
    return {
      ...recordData,
      key: record.id,
      archivedUser: archivedUser,
      archivedTime: archivedAt
    };
  });
  return data;
};

export const ArchivedRecords: React.FC<React.PropsWithChildren<IArchivedRecordsProps>> = (props) => {
  const { className, showLabel = true, isHide } = props;
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState({
    pageNum: 1,
    pageSize: 10,
  });
  const [tablePagination] = useState<TablePaginationConfig>({});

  const [recordData, setRecordData] = useState<any[]>([]);
  const [recordsDataMap, setRecordsDataMap] = useState(new Map());

  const datasheetId = useSelector((state) => state.pageParams.datasheetId)!;
  const fieldMap = useSelector((state) => Selectors.getFieldMap(state, datasheetId))!;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const archivedRecordIds = useSelector((state) => Selectors.getSnapshot(state)!.meta.archivedRecordIds)!;
  const visibleColumns = useSelector((state) => Selectors.getVisibleColumns(state, datasheetId))!;
  const permissions = useSelector((state) => Selectors.getPermissions(state, datasheetId));

  const { run: getArchivedRecords, loading: archivedRecordsLoading } = useRequest(() => DatasheetApi.getArchivedRecords(datasheetId, tableParams), {
    manual: true,
    onSuccess(res) {
      const { success, data } = res.data;
      if(success) {
        const { total, records } = data;
        setTotal(total);
        setRecordData(records);

        const cloneRecords = fastCloneDeep(records);

        const recordsMap = new Map();
        cloneRecords.forEach(item => {
          recordsMap.set(item.record.id, item.record);
        });
        setRecordsDataMap(recordsMap);
      }
    }
  });

  useEffect(() => {
    if(!open) return;
    getArchivedRecords();
  }, [tableParams, archivedRecordIds, open]);

  const cancelArchied = (record) => {
    const data: any[] = [];
    data.push(recordsDataMap.get(record.key));

    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.UnarchiveRecords,
      data,
    });
    if(result === 'Success') {
      Message.success({ content: t(Strings.restore_success) });
      getArchivedRecords();
      setSelectedRowKeys([]);
    }
  };

  const batchCancelArchied = () => {
    const data: any[] = [];
    selectedRowKeys.forEach(key => {
      data.push(recordsDataMap.get(key));
    });
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.UnarchiveRecords,
      data,
    });
    if(result === 'Success') {
      Message.success({ content: t(Strings.restore_success) });
      getArchivedRecords();
      setSelectedRowKeys([]);
    }
  };

  const deleteRecord = (record) => {
    const data: any[] = [];
    data.push(recordsDataMap.get(record.key));
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteArchivedRecords,
      data,
    });
    if(result === 'Success') {
      Message.success({ content: 'Deleted successfully' });
      getArchivedRecords();
      setSelectedRowKeys([]);
    }
  };

  const batchDeleteRecord = () => {
    const data: any[] = [];
    selectedRowKeys.forEach(key => {
      data.push(recordsDataMap.get(key));
    });
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteArchivedRecords,
      data,
    });
    if(result === 'Success') {
      Message.success({ content: 'Deleted successfully' });
      getArchivedRecords();
      setSelectedRowKeys([]);
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
      case FieldType.Currency:
      case FieldType.Percent:
      case FieldType.AutoNumber:
      case FieldType.Cascader:
      case FieldType.Link:
      case FieldType.OneWayLink:
      case FieldType.LookUp:
      case FieldType.Attachment:
        return JSON.stringify(cellValue);
      default:
        return JSON.stringify(cellValue);
    }
  };

  const columns: ColumnsType<any> = useMemo(() => {
    let firstColumn = {};
    const fieldMapColums: ColumnsType = Object.keys(fieldMap).map((key) => {
      const { name, id } = fieldMap[key];
      const fieldSetting: any = {
        title: name,
        key: id,
        dataIndex: id,
        width: 200,
        render: (cellValue) => (
          <div className={styles.cellValue}>
            {showArchivedCellValue(cellValue, key)}
          </div>
        ),
      };
      if(key === visibleColumns[0].fieldId) {
        fieldSetting.fixed = 'left';
        firstColumn = fieldSetting;
        return null;
      }
      return fieldSetting;
    }).filter(item => item !== null);

    fieldMapColums.unshift(firstColumn);
    
    fieldMapColums.push({
      title: t(Strings.archived_by),
      key: 'archivedUser',
      dataIndex: 'archivedUser',
      width: 200,
      render: (archivedUser) => (
        <div className={styles.archivedBy}>
          <Avatar id={archivedUser.id} title={archivedUser.nikeName} src={archivedUser.avatar} />
          <span>{archivedUser.nikeName}</span>
        </div>
      )
    });

    fieldMapColums.push({
      title: t(Strings.archived_time),
      key: 'archivedTime',
      dataIndex: 'archivedTime',
      width: 200,
      render: (time) => (
        <div className={styles.cellValue}>
          {dayjs(time).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      )
    });

    fieldMapColums.push({
      title: t(Strings.archived_action),
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <div className={styles.toolList}>
          <Tooltip title={t(Strings.archived_undo)}>
            <RestoreOutlined
              onClick={() => {
                Modal.warning({
                  title: t(Strings.unarchiveRecord),
                  content: t(Strings.unarchive_notice),
                  onOk: () => cancelArchied(record),
                  closable: true,
                  hiddenCancelBtn: false,
                });
              }}
            />
          </Tooltip>
          <Tooltip title={t(Strings.archive_delete_record_title)}>
            <DeleteOutlined onClick={() => {
              Modal.danger({
                title: t(Strings.archive_delete_record),
                content: t(Strings.delete_archived_records_warning_description),
                onOk: () => deleteRecord(record),
                closable: true,
                hiddenCancelBtn: false,
              });
            }} />
          </Tooltip>
        </div>
      ),
    });

    return fieldMapColums;
  }, [fieldMap, recordData, archivedRecordIds]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onDrawerClose = () => {
    setOpen(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
  ) => {
    setTableParams({
      pageNum: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
    setSelectedRowKeys([]);
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <ToolItem
        key="archivedRecords"
        icon={<ArchiveOutlined size={16} />}
        showLabel={isHide || showLabel}
        className={classnames(className)}
        text={t(Strings.archived_records)}
        onClick={showDrawer}
        id={DATASHEET_ID.ARCHIVED_RECORDS_BTN}
        disabled={!permissions.editable}
      />
      <Drawer 
        className='archiveDrawer' 
        title={t(Strings.archived_records)} 
        placement="right" 
        onClose={onDrawerClose} 
        width={window.innerWidth * 0.9} 
        open={open}
      >
        <div className={styles.batchHandle}>
          <Button disabled={!hasSelected} onClick={() => {
            Modal.warning({
              title: t(Strings.unarchiveRecord),
              content: t(Strings.unarchive_notice),
              onOk: () => batchCancelArchied(),
              closable: true,
              hiddenCancelBtn: false,
            });
          }} variant="fill" size="small" prefixIcon={<RestoreOutlined currentColor />}> {t(Strings.unarchiveRecord)} </Button>
          <Button disabled={!hasSelected} variant="fill" onClick={() => {
            Modal.danger({
              title: t(Strings.archive_delete_record),
              content: t(Strings.delete_archived_records_warning_description),
              onOk: () => batchDeleteRecord(),
              closable: true,
              hiddenCancelBtn: false,
            });
          }} size="small" prefixIcon={<DeleteOutlined currentColor />}> {t(Strings.delete_record)} </Button>
          { hasSelected && <p>{t(Strings.archived_select_info, { selected: selectedRowKeys.length })}</p> }
        </div>
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          loading={archivedRecordsLoading}
          columns={columns}
          scroll={{ x: window.innerWidth * 0.9, y: window.innerHeight - 258 }}
          dataSource={handleRecordsData(fastCloneDeep(recordData))}
          pagination={{
            ...tablePagination,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} total`,
          }}
          onChange={handleTableChange}
          className='archivedRecordsTable'
        />
      </Drawer>
    </>
  );
};

