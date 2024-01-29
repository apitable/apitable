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

import { Table, ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Typography, LinkButton, Box, useThemeColors, Pagination } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { RoleContext } from '../context';
import { IMemberItem } from '../interface';
import { UnitItem } from './unit_item';
import styles from './style.module.less';

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

export const RoleTable: React.FC<
  React.PropsWithChildren<{
    list: any[];
    total: number;
    onChangePage: (page: number, pageSize?: number) => void;
    onRemove?: (unitIds: string[]) => void;
    openAddMemberModal?: () => void;
    onBatchSelectMember?: (unitIds: string[]) => void;
  }>
> = (props) => {
  const colors = useThemeColors();
  const { list, total, onChangePage, onRemove, openAddMemberModal, onBatchSelectMember } = props;
  const { manageable } = useContext(RoleContext);
  const [pageInfo, setPageInfo] = useState<IPageInfo>(defaultPage);
  const { page, pageSize } = pageInfo;
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const pageWrapRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const updateScroll = useCallback(() => {
    const headerHeight = 47;
    const pageWrapHeight = pageWrapRef?.current?.clientHeight || 0;
    const clientHeight = tableWrapRef.current?.clientHeight || 0;
    if (clientHeight > headerHeight) {
      const height = clientHeight - headerHeight - pageWrapHeight;
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
      width: 27.6,
      render: (_, record) => <UnitItem {...record} />,
    },
    {
      dataIndex: 'teams',
      key: 'teams',
      title: t(Strings.role_member_table_header_team),
      align: 'left',
      width: 29.6,
      render: (_, record) => <Typography variant="body3">{record.teams || record.unitName}</Typography>,
    },
  ];

  // only manageable permission can operate
  manageable &&
    columns.push({
      key: 'operate',
      title: t(Strings.operation),
      align: 'left',
      width: 18,
      render: (_, record) => (
        <LinkButton component={'span'} underline={false} color={colors.textDangerDefault} onClick={() => onRemove && onRemove([record.unitRefId])}>
          {t(Strings.delete_role_member_title)}
        </LinkButton>
      ),
    });

  const rowSelection = manageable
    ? {
      columnWidth: 4.8,
      onChange: (_selectedRowKeys: React.Key[], selectedRow: IMemberItem[]) => {
        onBatchSelectMember && onBatchSelectMember(selectedRow.map((v) => v.unitRefId));
      },
    }
    : undefined;

  const showPage = total > 0;

  return (
    <div className={styles.roleTableWrap}>
      <Box ref={tableWrapRef} display={'flex'} height={'100%'} flexDirection={'column'} minWidth={480}>
        <ConfigProvider renderEmpty={() => <Empty wrapperHeight={scrollHeight} addRole={openAddMemberModal} />}>
          <Table
            dataSource={list}
            columns={columns}
            pagination={false}
            rowKey={(record) => String(record.unitId)}
            rowSelection={rowSelection}
            scroll={{ y: scrollHeight }}
          />
        </ConfigProvider>
        {showPage && (
          <Box ref={pageWrapRef} display={'flex'} justifyContent={'flex-end'} paddingTop={16}>
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

const Empty: React.FC<React.PropsWithChildren<{ wrapperHeight: number; addRole?: () => void }>> = (props) => {
  const { wrapperHeight, addRole } = props;
  const colors = useThemeColors();
  const { manageable } = useContext(RoleContext);
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      marginTop={`${wrapperHeight / 2}px`}
      style={{ transform: 'translateY(-50%)' }}
    >
      <Typography color={colors.textCommonTertiary} variant="body2">
        {t(Strings.role_member_table_empty)}
      </Typography>
      {manageable && <LinkButton onClick={addRole}>{t(Strings.add_member)}</LinkButton>}
    </Box>
  );
};
