import { Typography, LinkButton, Box, useThemeColors, Pagination } from '@vikadata/components';
import { Table, ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './style.module.less';
import { Strings, t } from '@vikadata/core';
import { RoleContext } from '../context';
import { IMemberItem } from '../interface';
import { UnitItem } from './unit_item';

export interface IPageParams {
  total: number;
  pageSize: number;
  page: number;
}

export interface IPageInfo {
  pageSize: number;
  page: number;
}

export const defaultPage: IPageInfo = {
  pageSize: 10,
  page: 1,
};

export const RoleTable: React.FC<{
  list: any[];
  total: number;
  onChangePage: (page: number, pageSize?: number) => void;
  onRemove?: (unitIds: string[]) => void;
  openAddMemberModal?: () => void;
  onBatchSelectMember?: (unitIds: string[]) => void;
}> = props => {
  const colors = useThemeColors();
  const { list, total, onChangePage, onRemove, openAddMemberModal, onBatchSelectMember } = props;
  const { manageable } = useContext(RoleContext);
  const [pageInfo, setPageInfo] = useState<IPageInfo>(defaultPage);
  const { page, pageSize } = pageInfo;
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const updateScroll = useCallback(() => {
    const headerHeight = 45;
    const clientHeight = tableWrapRef.current?.clientHeight || 0;
    if (clientHeight > headerHeight) {
      const height = clientHeight - headerHeight;
      setScrollHeight(height);
    }
  }, []);

  useLayoutEffect(() => {
    updateScroll();
  });

  useEffect(() => {
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('resize', updateScroll);
    };
  }, [updateScroll]);
  const columns: ColumnsType<IMemberItem> = [
    {
      key: 'unitName',
      title: t(Strings.role_member_table_header_name),
      align: 'left',
      width: 276,
      render: (_, record) => <UnitItem {...record} />,
    },
    {
      dataIndex: 'teams',
      key: 'teams',
      title: t(Strings.role_member_table_header_team),
      align: 'left',
      width: 296,
      render: (_, record) => <Typography variant='body3'>{record.teams || record.unitName}</Typography>,
    },
  ];

  // only manageable permission can operate
  manageable &&
    columns.push({
      key: 'operate',
      title: t(Strings.operation),
      align: 'left',
      width: 180,
      render: (_, record) => (
        <LinkButton component={'span'} underline={false} color={colors.textDangerDefault} onClick={() => onRemove && onRemove([record.unitRefId])}>
          {t(Strings.delete_role_member_title)}
        </LinkButton>
      ),
    });

  const rowSelection = manageable
    ? {
      columnWidth: 48,
      onChange: (selectedRowKeys: React.Key[], selectedRow: IMemberItem[]) => {
        onBatchSelectMember && onBatchSelectMember(selectedRow.map(v => v.unitRefId));
      },
    }
    : undefined;

  const showPage = total > 0;

  return (
    <div className={styles.roleTableWrap}>
      <Box ref={tableWrapRef} display={'flex'} height={'100%'} flexDirection={'column'} minWidth={815}>
        <ConfigProvider renderEmpty={() => <Empty wrapperHeight={scrollHeight} addRole={openAddMemberModal} />}>
          <Table
            dataSource={list}
            columns={columns}
            pagination={false}
            rowKey={record => String(record.unitId)}
            rowSelection={rowSelection}
            scroll={{ y: scrollHeight }}
          />
        </ConfigProvider>
        {showPage && (
          <Box display={'flex'} justifyContent={'flex-end'} paddingTop={16}>
            <Pagination
              current={page}
              total={total}
              pageSize={pageSize}
              onChange={(page, pageSize) => {
                setPageInfo({ page, pageSize });
                onChangePage(page, pageSize);
              }}
              showChangeSize
              showTotal
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

const Empty: React.FC<{ wrapperHeight: number, addRole?: () => void }> = props => {
  const { wrapperHeight, addRole } = props;
  const colors = useThemeColors();
  const { manageable } = useContext(RoleContext);
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      marginTop={`${wrapperHeight / 2}px`}
      style={{ transform: 'translateY(-50%)' }}>
      <Typography color={colors.textCommonTertiary} variant="body2">
        {t(Strings.role_member_table_empty)}
      </Typography>
      {manageable && <LinkButton onClick={addRole}>{t(Strings.add_member)}</LinkButton>}
    </Box>
  );
};

