import { Fragment, FC, useContext } from 'react';
import { Typography, ListDeprecate, Button, black } from '@vikadata/components';
import { AddOutlined, CloseMiddleOutlined } from '@vikadata/icons';
import { DragItem } from './drag_item';
import { DropList } from './drop_list';
import styles from './styles.module.less';
import { CalendarContext } from '../calendar_context';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { CollaCommandName, ExecuteResult, t, Strings } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { RecordMenu } from 'pc/components/multi_grid/context_menu/record_menu';
import { useUnmount } from 'ahooks';

interface IRecordList {
  setRecord: (recordId: any, startTime: Date | null, endTime: Date | null) => void;
  records: {
    id: string;
  }[];
  disabled?: boolean;
}

export const RecordList: FC<IRecordList> = props => {
  const { setRecord, records, disabled } = props;
  const { keyword, setKeyword, view, onCloseGrid } = useContext(CalendarContext);

  const appendRecord = () => {
    const collaCommandManager = resourceService.instance!.commandManager;
    const result = collaCommandManager.execute({
      cmd: CollaCommandName.AddRecords,
      count: 1,
      viewId: view.id,
      index: 0,
    });
    if (
      result.result === ExecuteResult.Success
    ) {
      const newRecordId = result.data && result.data[0];
      expandRecordIdNavigate(newRecordId);
    }
  };

  const onSearchChange = (e, word) => {
    if (!keyword) {
      setKeyword('');
    }
    setKeyword(word);
  };

  useUnmount(() => {
    // 关闭记录面板清理搜索
    if (keyword) {
      setKeyword('');
    }
  });
  
  return (
    <div className={styles.recordList}>
      <RecordMenu hideInsert />
      <DropList update={setRecord}>
        <div className={styles.header}>
          <Typography variant="h6">
            {t(Strings.calendar_pre_record_list)}
          </Typography>
          <CloseMiddleOutlined
            className={styles.closeIcon}
            size={16}
            color={black[500]}
            onClick={onCloseGrid}
          />
        </div>
        <ListDeprecate
          className={styles.list}
          onClick={() => {}}
          searchProps={{
            onSearchChange,
            placeholder: t(Strings.calendar_list_search_placeholder),
          }}
        >
          {!disabled ? (
            <div className={styles.add}>
              <Button onClick={appendRecord} block size="small" prefixIcon={<AddOutlined size={16} /> }>
                {t(Strings.add_kanban_group_card)}
              </Button>
            </div>
          ) : <Fragment />}
          <div className={styles.listItems}>
            {records.length > 0 ? records.map(pr => <DragItem {...pr} key={pr.id} disabled={disabled} />) : (
              <div className={styles.empty}>
                {keyword ? t(Strings.no_search_result) : t(Strings.empty_record)}
              </div>
            ) as any}
          </div>
        </ListDeprecate>
      </DropList>
    </div>
  );
};