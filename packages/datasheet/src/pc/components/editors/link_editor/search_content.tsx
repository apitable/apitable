import { Button, LinkButton, useThemeColors } from '@vikadata/components';
import {
  CollaCommandName, ExecuteResult, Field, FieldType, ILinkField, ILinkIds, IReduxState, ISegment, IViewRow, SegmentType, Selectors, StoreActions,
  Strings, t, TextBaseField,
} from '@vikadata/core';
import { Align, FixedSizeList } from '@vikadata/react-window';
import { useDebounce, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import { isEqual } from 'lodash';
import Image from 'next/image';
import { Loading, Tooltip } from 'pc/components/common';
import { TComponent } from 'pc/components/common/t_component';
import { expandRecordInCenter } from 'pc/components/expand_record';
import { useDispatch, useGetViewByIdWithDefault } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import * as React from 'react';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import ImageNoRecord from 'static/icon/datasheet/datasheet_img_modal_norecord.png';
import { RecordList } from './record_list';
import style from './style.module.less';
import { expandPreviewModalClose } from 'pc/components/preview_file';

interface ISearchContentProps {
  field: ILinkField;
  searchValue: string;
  cellValue: ILinkIds;
  onlyShowSelected: boolean;
  focusIndex: number;
  onChange: (value: string[] | null) => void;
  // 这里的 datasheetId 有两种理解，如果是单纯的展开卡片，则针对的是当前的数表 id
  // 如果在本表的展开记录中打开关联的展开记录，datasheetId 指的就是关联数表的 id
  datasheetId: string
}

const SearchContentBase: React.ForwardRefRenderFunction<{ getFilteredRows (): { [key: string]: string }[] }, ISearchContentProps> = (props, ref) => {
  const { field, searchValue: _searchValue, onlyShowSelected, cellValue, onChange, focusIndex, datasheetId } = props;
  const foreignDatasheetId = field.property.foreignDatasheetId;
  const colors = useThemeColors();
  const store = useStore();
  const { foreignDatasheet, foreignDatasheetErrorCode } = useSelector((state: IReduxState) => {
    return {
      foreignDatasheet: Selectors.getDatasheet(state, foreignDatasheetId)!,
      foreignDatasheetErrorCode: Selectors.getDatasheetErrorCode(state, foreignDatasheetId),
    };
  });
  const { readable: foreignDatasheetReadable, editable: foreignDatasheetEditable } = useSelector(state => {
    return Selectors.getPermissions(state, foreignDatasheetId);
  });
  const { formId, mirrorId, datasheetId: urlDsId } = useSelector(state => state.pageParams);

  /**
   * foreignView 代表从关联表哪个 view 取数据，包括不带筛选的默认 view
   * hasLimitToView 明确表明是否有指定 view，指定 view 的情况下需要遵循 view 中的筛选条件
   */
  const foreignView = useGetViewByIdWithDefault(field.property.foreignDatasheetId, field.property.limitToView) as any;
  const hasLimitToView = Boolean(field.property.limitToView && foreignView?.id === field.property.limitToView);
  const { recordMap, meta } = foreignDatasheet.snapshot;
  const fieldMap = meta.fieldMap;
  const recordListRef = useRef<FixedSizeList>(null);
  const dispatch = useDispatch();
  const searchValue = useDebounce(_searchValue, { wait: 300 });
  // 仅包含 recordId 的映射，方便后续计算搜索数据构造
  const [filteredRecordIdMap, setFilteredRecordIdMap] = useState<{ [key: string]: string }>({});
  // 仅包含选中记录的 recordId 的映射表
  const [selectedRecordIds, setSelectedRecordIds] = useState<IViewRow[]>([]);
  // 用以标记是否进行过搜索，只要进行了搜索，就会开始构造 搜索集
  const [searchedFlag, setSearchedFlag] = useState(false);

  const foreignDataMap = useMemo(() => {
    /**
     * 当 hasLimitToView 存在的时候
     * 需要通过 getVisibleRowsBase 获取筛选、排序过后的记录。
     * 通过 getVisibleColumnsBase 获取指定视图的可见列。
     */
    if (hasLimitToView && !foreignDatasheet.isPartOfData) {
      return {
        foreignRows: Selectors.getVisibleRowsBase(store.getState(), foreignDatasheet.snapshot, foreignView),
        foreignColumns: Selectors.getVisibleColumnsBase(foreignView),
      };
    }

    /**
     * 当 hasLimitToView 不存在的时候，说明用户没有显式指定一个 view 从中获取关联记录，
     * 所以此时是从第 0 个 view 中不经过筛选条件拿到所有的原始 rows，确保用户能够对所有记录进行选择。
     */
    let foreignRows = foreignDatasheet.snapshot.meta.views[0].rows;
    // 有formId是说明在填写收集表，此时过收集表滤掉添加的临时记录
    if (formId) {
      foreignRows = foreignRows.filter((item) => !item.recordId.endsWith('_temp'));
    }
    return {
      foreignRows,
      foreignColumns: Selectors.getVisibleColumns(store.getState(), foreignDatasheet.id)
    };
  }, [hasLimitToView, foreignDatasheet, store, foreignView, formId]);

  const { foreignRows, foreignColumns } = foreignDataMap;

  const saveValue = useCallback((recordId: string) => {
    let value: string[] = [];

    if (field.property.limitSingleRecord) {
      value = [recordId];
      onChange(value);
      return;
    }

    // 反选关联
    if (cellValue && cellValue.includes(recordId)) {
      value = cellValue.filter(id => id !== recordId);
      // 选择关联
    } else {
      value = cellValue ? cellValue.concat([recordId]) : [recordId];
    }
    onChange(value.length ? value : null);
  }, [cellValue, onChange, field]);

  const addNewRecord = () => {
    let newCellValue: ISegment[] | undefined;
    const foreignPrimaryField = fieldMap[foreignColumns[0].fieldId];
    if (!foreignPrimaryField) {
      return;
    }

    if (Field.bindModel(foreignPrimaryField) instanceof TextBaseField && searchValue) {
      newCellValue = [{ type: SegmentType.Text, text: searchValue }];
    }

    const ret = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      datasheetId: foreignDatasheet.id,
      viewId: hasLimitToView ? foreignView.id : '',
      index: foreignRows.length,
      count: 1,
      cellValues: newCellValue ? [{ [foreignPrimaryField.id]: newCellValue }] : undefined,
    });

    if (ExecuteResult.Success === ret.result) {
      const recordId = ret.data && ret.data[0];
      saveValue(recordId);

      // 增加一个空记录的时候，要打开编辑卡片
      if (newCellValue == null) {
        expandPreviewModalClose();
        expandRecordInCenter({
          activeRecordId: recordId,
          recordIds: [recordId],
          viewId: hasLimitToView ? foreignView.id : undefined,
          datasheetId: foreignDatasheet.id,
          onClose: () => { recordListRef.current && recordListRef.current.scrollToItem(foreignRows.length); },
        });
      } else {
        recordListRef.current && recordListRef.current.scrollToItem(0);
      }
    }
  };

  useEffect(() => {
    const onlyRecordIdMap = {};
    Object.keys(recordMap).forEach(recordId => {
      onlyRecordIdMap[recordId] = recordId;
    });
    // 关联表增删 record 时才会导致后续 搜索集 的重新构造
    if (!isEqual(onlyRecordIdMap, filteredRecordIdMap)) {
      setFilteredRecordIdMap(onlyRecordIdMap);
    }
  }, [filteredRecordIdMap, recordMap]);

  useEffect(() => {
    if (cellValue?.length) {
      const currentSelectedRecordIds: IViewRow[] = cellValue.map(recordId => ({ recordId }));
      return setSelectedRecordIds(currentSelectedRecordIds);
    }
    return setSelectedRecordIds([]);
  }, [cellValue]);

  /**
   * 完整的 foreignRows，用于兼容指定视图切换的交互：
   * A 表关联 B 表
   * B 表有 视图1 和 视图2
   * A 表原先某条记录关联 视图1 中的某条 record，但是这条 record 不存在于 视图2
   * 此时改变指定视图为 视图2
   * 视图 2 的数据源不存在选中的 record，但是在 UI 交互上需要显示给用户
   */
  const entityForeignRows = useMemo(() => {
    const foreignRowMap: { [recordId: string]: string } = {};
    const restForeignRows: IViewRow[] = [];
    foreignRows.map(({ recordId }) => foreignRowMap[recordId] = recordId);
    selectedRecordIds.forEach(({ recordId }) => {
      if (!foreignRowMap[recordId]) {
        restForeignRows.push({ recordId });
      }
    });
    return [...foreignRows, ...restForeignRows];
  }, [foreignRows, selectedRecordIds]);

  /**
   * 抽出 “仅看已选记录” 相关逻辑的计算结果进行缓存
   * 先将 cellValue 缓存于映射表中，再遍历 foreignRows 找出顺序
   */
  const onlyShowRows = useMemo(() => {
    if (onlyShowSelected) {
      return selectedRecordIds;
    }
    return null;
  }, [onlyShowSelected, selectedRecordIds]);

  useUpdateEffect(() => setSearchedFlag(true), [_searchValue]);

  // 先构造一个搜索数组，将单元格的值全部转成 string 暂存起来，供搜索引擎使用。
  // 当前仅依赖关联表的行列数、dstId 和 是否“仅看已选记录” 的变化，才会引起重新构造搜索集。
  const searchSource = useMemo(() => {
    let rows: IViewRow[] = entityForeignRows;

    // 没搜索过，则不加载搜索数据源，
    // 防止关联表大数据情况下从打开关联表搜索框卡顿的情况
    if (!searchedFlag) {
      return null;
    }
    if (onlyShowRows) {
      rows = onlyShowRows;
    }
    return rows.filter(row => {
      return Boolean(filteredRecordIdMap[row.recordId]);
    }).map(row => {
      const recordId = row.recordId;
      const result: {
        recordId: string, content: { [fieldId: string]: string | null },
      } = { recordId: recordId, content: {}};
      // 只进行可见列的搜索集构建
      foreignColumns.slice(0, 6).forEach(column => {
        const field = fieldMap[column.fieldId];

        // 对附件字段进行过滤
        if (!field || field.type === FieldType.Attachment) {
          return;
        }
        const state = store.getState();
        const foreignDatasheet = Selectors.getDatasheet(state, foreignDatasheetId)!;
        const cellValue = Selectors.getCellValue(state, foreignDatasheet.snapshot, recordId, field.id);
        result.content[field.id] = Field.bindModel(field).cellValueToString(cellValue);
      });
      return result;
    });
  }, [entityForeignRows, foreignColumns, filteredRecordIdMap, fieldMap, foreignDatasheetId, onlyShowRows, searchedFlag, store]);

  const fuse = useMemo(() => {
    // 没有搜索过，则不构造搜索集
    if (searchSource == null) {
      return null;
    }
    // 有关联表的可读权限及以上，才支持对除了首列之外数据的查询
    const searchKeys = (formId || foreignDatasheetReadable) ?
      foreignColumns.slice(1).map(column => ({ name: 'content.' + column.fieldId, weight: 1 })) : [];
    // 给首列也就是主字段加更高的权重
    const fuse = new Fuse(searchSource, {
      keys: [{ name: 'content.' + foreignColumns[0].fieldId, weight: 2 }, ...searchKeys],
      /**
       * 只有 0.1 时才为 include 模式，其余都会分词（0 为完全匹配，1 为模糊搜索）
       * 遵循计分理论，参考：https://fusejs.io/concepts/scoring-theory.html
       */
      threshold: 0,
      // 忽略匹配项在字符串中出现的位置，否则会受计分理论的影响
      // 当 ignoreLocation 为 true 时，完全匹配也会变为 include 模式
      ignoreLocation: true,
      // 暂时不开启高级模式，之后等产品确认
      // useExtendedSearch: true,
    });
    return fuse;
  }, [foreignColumns, searchSource, foreignDatasheetReadable, formId]);

  const rows = useMemo(() => {
    let rows: IViewRow[] = entityForeignRows;
    if (onlyShowRows) {
      rows = onlyShowRows;
    }

    // 理论上 fuse 不会是 null，这里做个兼容
    if (!searchValue || fuse == null) {
      return rows;
    }

    return fuse.search(searchValue).map(result => {
      return { recordId: (result as any).item.recordId }; // FIXME:TYPE
    });

    // 如果关联表的 records 没有增减，查询结果只在 searchValue 变化的时候更新
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityForeignRows, searchValue, onlyShowSelected, filteredRecordIdMap]);

  useImperativeHandle(ref, () => ({
    getFilteredRows(): { recordId: string }[] {
      return rows;
    },
    scrollToItem: (index: number, align?: Align) => {
      recordListRef.current && recordListRef.current.scrollToItem(index, align);
    },
    saveValue: (recordId: string) => saveValue(recordId),
  }));

  useEffect(() => {
    // 添加关联记录的时候，要把关联表的 record 全部加载进来以供搜索
    if (foreignDatasheet.isPartOfData && !foreignDatasheetErrorCode) {
      if (formId) {
        dispatch(StoreActions.fetchForeignDatasheet(formId, foreignDatasheet.id) as any);
        return;
      }
      if (mirrorId && (!datasheetId || datasheetId === urlDsId)) {
        dispatch(StoreActions.fetchForeignDatasheet(mirrorId, foreignDatasheet.id) as any);
        return;
      }

      datasheetId && dispatch(StoreActions.fetchForeignDatasheet(datasheetId, foreignDatasheet.id) as any);
    }
    // eslint-disable-next-line
  }, [foreignDatasheet.isPartOfData, foreignDatasheet.id, dispatch, formId, mirrorId, datasheetId]);

  const showAddRecordOnBottom = Boolean(onlyShowSelected || rows.length);

  return (
    <>
      <div className={style.cardMiddle}>
        {foreignDatasheet.isPartOfData && !foreignDatasheetErrorCode ? <Loading className={style.loading} /> :
          rows.length ?
            <RecordList
              ref={recordListRef}
              datasheetId={foreignDatasheet.id}
              rows={rows}
              view={foreignView}
              focusIndex={focusIndex}
              selectedRecordIds={cellValue}
              onClick={saveValue}
              foreignDatasheetReadable={foreignDatasheetReadable}
            /> :
            <div className={style.empty}>
              {onlyShowSelected ?
                <>
                  <Image height={151} src={ImageNoRecord} alt="no record" />
                  <div className={style.text}>{t(Strings.no_selected_record)}</div>
                </> :
                <>
                  <div className={style.text}>{
                    <TComponent
                      tkey={t(Strings.not_found_record_contains_value)}
                      params={{
                        searchValueSpan: <span className={style.searchValue}>{searchValue}</span>,
                      }}
                    />
                  }</div>
                  {
                    // form 中打开关联的 modal，就算有关联表的最高权限，也不允许在 form 中创建新的关联记录，产品需求如此
                    foreignDatasheetEditable && !formId &&
                    <Button
                      className={classNames(style.addRecordBtn, 'textButton')}
                      onClick={addNewRecord}
                      color="primary"
                      prefixIcon={<IconAdd fill={colors.black[50]} width="14px" height="14px" />}
                    >
                      {<TComponent
                        tkey={t(Strings.add_new_record_by_name)}
                        params={{
                          span: searchValue && <>"<span className={style.searchValue}>{searchValue}</span>"</>,
                        }}
                      />}
                    </Button>
                  }
                </>
              }
            </div>
        }
      </div>
      {
        // TODO: info 需要改为指定颜色
        showAddRecordOnBottom &&
        <Tooltip
          title={foreignDatasheetEditable ? '' : t(Strings.no_permission_to_edit_datasheet)}
          trigger="hover"
        >
          <div className={classNames(style.addRecord)}>
            <LinkButton
              component="button"
              underline={false}
              onClick={addNewRecord}
              color={colors.fc2}
              prefixIcon={<IconAdd fill="currentColor" />}
              disabled={!foreignDatasheetEditable}
              block
            >
              {
                <TComponent
                  tkey={t(Strings.add_new_record_by_name)}
                  params={{
                    span: searchValue && <>"<span className={style.searchValue}>{searchValue}</span>"</>,
                  }}
                />
              }
            </LinkButton>
          </div>
        </Tooltip>
      }
    </>
  );
};

export const SearchContent = memo(forwardRef(SearchContentBase));
