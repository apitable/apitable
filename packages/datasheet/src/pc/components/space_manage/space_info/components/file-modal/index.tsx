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

import { ConfigProvider, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { LinkButton, ThemeProvider, Typography } from '@apitable/components';
import { ConfigConstant, decimalCeil, Strings, t } from '@apitable/core';
import { UnitTag } from 'pc/components/catalog/permission_settings/permission/select_unit_modal/unit_tag';
import { UserCardTrigger } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { antdConfig } from 'pc/components/route_manager/router_provider';
import { getPercent } from 'pc/components/space_manage/space_info/utils';
import { useRequest } from 'pc/hooks';
import { useCapacityRequest } from 'pc/hooks/use_capacity_request';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

interface IFileModalProps {
  onCancel: () => void;
  maxNodeCount: number;
}

type IRecord = {
  avatar: string;
  memberId: string;
  userName: string;
  avatarColor?: number | null;
  memberName?: string;
  teamName: string;
  privateNodeCount: number;
  teamNodeCount: number;
  totalNodeCount: number;
};

export const FileModal: FC<React.PropsWithChildren<IFileModalProps>> = ({ onCancel, maxNodeCount }) => {
  const columns: ColumnsType<IRecord> = [
    {
      title: t(Strings.capacity_file_member),
      dataIndex: 'member',
      render(source, record) {
        if (!record) return null;
        const userId = record.memberId;
        const avatar = record.avatar;
        const avatarColor = record.avatarColor;
        const userName = record.memberName || t(Strings.guests_per_space);
        return (
          <UserCardTrigger
            popupAlign={{
              points: ['tl', 'bl'],
              offset: [0, 8],
              overflow: { adjustX: true, adjustY: true },
            }}
            memberId={userId}
            permissionVisible={false}
          >
            <span>
              <UnitTag
                className={styles.unitTag}
                deletable={false}
                isTeam={false}
                unitId={userId}
                avatarColor={avatarColor}
                avatar={avatar}
                name={userName || t(Strings.guests_per_space)}
                maxWidth={100}
              />
            </span>
          </UserCardTrigger>
        );
      },
    },
    { title: t(Strings.capacity_file_member_team), dataIndex: 'teamName' },
    { title: t(Strings.capacity_file_member_team_node_count), dataIndex: 'teamNodeCount' },
    { title: t(Strings.capacity_file_member_private_node_count), dataIndex: 'privateNodeCount' },
    {
      title: t(Strings.capacity_file_member_private_percent),
      dataIndex: 'percent',
      render(date, record) {
        return decimalCeil(getPercent(record.totalNodeCount / maxNodeCount) * 100) + '%';
      },
    },
  ];
  const [list, setList] = useState([]);
  const spaceId = useAppSelector((state) => state.space.activeId)!;
  const { getCapacityNodeListReq } = useCapacityRequest();
  const { run: getCapacityNodeList } = useRequest(getCapacityNodeListReq, { manual: true });
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    getCapacityNodeList(spaceId, pageNo).then((res) => {
      const _list = res.records.map((item: any) => {
        return {
          ...item,
          key: item.memberId,
        };
      });
      setList(_list);
      setTotal(res.total);
    });
  }, [getCapacityNodeList, pageNo, spaceId]);

  const TableEl = (
    <div className={styles.nodeTable}>
      <Table
        columns={columns}
        dataSource={list}
        scroll={{ y: 320 }}
        pagination={{
          current: pageNo,
          total: total,
          defaultPageSize: ConfigConstant.CAPACITY_REWARD_LIST_PAGE_SIZE,
          onChange(page) {
            setPageNo(page);
          },
          showSizeChanger: false,
        }}
      />
    </div>
  );

  return (
    <Modal
      title={<div>{t(Strings.capacity_file_detail_title)}</div>}
      open
      className={styles.capacityFileModal}
      width={856}
      centered
      onCancel={onCancel}
      footer={null}
      zIndex={100}
    >
      <div className={styles.content}>
        <Typography variant="body3">
          {t(Strings.capacity_file_detail_desc)}
          <LinkButton
            onClick={() => {
              window.open(`/space/${spaceId}/upgrade`, '_blank', 'noopener,noreferrer');
            }}
          >{t(Strings.capacity_file_upgrade)}</LinkButton>
        </Typography>
        {TableEl}
      </div>
    </Modal>
  );
};

export const expandFileModal = (maxNodeCount: number) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  function destroy() {
    root.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function close() {
    setTimeout(() => {
      destroy();
    }, 0);
  }

  const render = () => {
    root.render(
      <ConfigProvider {...antdConfig}>
        <Provider store={store}>
          <ThemeProvider>
            <FileModal onCancel={close} maxNodeCount={maxNodeCount} />
          </ThemeProvider>
        </Provider>
      </ConfigProvider>,
    );
  };

  render();
};
