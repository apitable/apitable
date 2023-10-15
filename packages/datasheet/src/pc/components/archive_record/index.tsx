import { Drawer, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import classnames from 'classnames';
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@apitable/components';
import { DATASHEET_ID, Strings, t, DatasheetApi, Selectors, CollaCommandName, fastCloneDeep, Field } from '@apitable/core';
import { ListOutlined, RestoreOutlined, DeleteOutlined } from '@apitable/icons';
import { ToolItem } from 'pc/components/tool_bar/tool_item';
import { IArchivedRecordsProps } from './interface';
import { useRequest } from 'pc/hooks';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Tooltip, Avatar } from 'pc/components/common';
import styles from './style.module.less';
import { resourceService } from 'pc/resource_service';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Message } from 'pc/components/common';

const handleRecordsData = (recordsData) => {
  const data = recordsData.map(item => {
      const { record, archivedUser, archivedAt } = item;
      const recordData = record.data;
      recordData.key = record.id;
      recordData.archivedUser = archivedUser;
      recordData.archivedTime = archivedAt;
      return recordData;
  });
  return data;
}

export const ArchivedRecords: React.FC<React.PropsWithChildren<IArchivedRecordsProps>> = (props) => {
  const { className, showLabel = true, isHide } = props;
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState( {
    pageNum: 1,
    pageSize: 10,
  });
  const [tablePagination] = useState<TablePaginationConfig>({})

  const [recordData, setRecordData] = useState<any[]>([]);
  const [recordsDataMap, setRecordsDataMap] = useState(new Map());

  const datasheetId = useSelector((state) => state.pageParams.datasheetId)!;
  const fieldMap = useSelector((state) => Selectors.getFieldMap(state, datasheetId))!;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const archivedRecordIds = useSelector((state) => Selectors.getSnapshot(state)!.meta.archivedRecordIds)!;
  
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
      // 错误信息提示
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
    }
  }

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
    }
  }

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
    }
  }

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
    }
  }

  const columns: ColumnsType<any> = useMemo(() => {
    const fieldMapColums: ColumnsType = Object.keys(fieldMap).map((key) => {
      const { name, id } = fieldMap[key];
      return {
        title: name,
        key: id,
        dataIndex: id,
        width: 200,
        render: (cellValue) => (
          <div className={styles.cellValue}>
              {Field.bindModel(fieldMap[key]).cellValueToString(cellValue)}
          </div>
        ),
      }
    });
    fieldMapColums.push({
      title: 'Archied by',
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
      title: 'Archied time',
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
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
          <div className={styles.toolList}>
            <Tooltip title="Undo Archied">
              <RestoreOutlined
                onClick={() => {
                  Modal.warning({
                    title: t(Strings.unarchive),
                    content: t(Strings.unarchive_notice),
                    onOk: () => cancelArchied(record),
                    closable: true,
                    hiddenCancelBtn: false,
                  });
                }}
              />
            </Tooltip>
            <Tooltip title="Delete record">
              <DeleteOutlined onClick={() => {
                 Modal.danger({
                  title: 'Delete archived records',
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
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <ToolItem
        key="archivedRecords"
        icon={<ListOutlined size={16} />}
        showLabel={isHide || showLabel}
        className={classnames(className)}
        text={t(Strings.archived_records)}
        onClick={showDrawer}
        id={DATASHEET_ID.ARCHIVED_RECORDS_BTN}
      />
      <Drawer className='archiveDrawer' title={t(Strings.archived_record)} placement="right" onClose={onDrawerClose} width={window.innerWidth * 0.9} open={open}>
        { hasSelected &&  <div className={styles.batchHandle}>
          <Button onClick={() => {
             Modal.warning({
              title: t(Strings.unarchive),
              content: t(Strings.unarchive_notice),
              onOk: () => batchCancelArchied(),
              closable: true,
              hiddenCancelBtn: false,
            });
          }} variant="fill"  size="small" prefixIcon={<RestoreOutlined currentColor />}> {t(Strings.unarchive)} </Button>
          <Button variant="fill" onClick={() => {
             Modal.danger({
              title: 'Delete archived records',
              content: t(Strings.delete_archived_records_warning_description),
              onOk: () => batchDeleteRecord(),
              closable: true,
              hiddenCancelBtn: false,
            });
          }}  size="small" prefixIcon={<DeleteOutlined currentColor />}> {t(Strings.delete_record)} </Button>
          <p>{`Selected ${selectedRowKeys.length} items`}</p>
        </div>
        }
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          loading={archivedRecordsLoading}
          columns={columns}
          scroll={{ x: window.innerWidth * 0.9 }}
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





