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

import { ConfigProvider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { UnitTag } from 'pc/components/catalog/permission_settings/permission/select_unit_modal/unit_tag';
import { UserCardTrigger } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { antdConfig } from 'pc/components/route_manager/router_provider';
import { useRequest } from 'pc/hooks';
import { useCapacityRequest } from 'pc/hooks/use_capacity_request';
import { store } from 'pc/store';
import styles from './style.module.less';

const { TabPane } = Tabs;

interface ICapacityRewardModalProps {
  onCancel: () => void;
}

enum CapacityType {
  InEffect = 'InEffect',
  Expired = 'Expired',
}

type IRecord = {
  quotaSource: string;
  quota: string;
  expireDate: string;
  inviteUserInfo?: {
    avatar: string;
    userId: string;
    userName: string;
  };
};

export const CapacityRewardModal: FC<React.PropsWithChildren<ICapacityRewardModalProps>> = ({ onCancel }) => {
  const columns: ColumnsType<IRecord> = [
    {
      title: t(Strings.attachment_capacity_details_model_source),
      dataIndex: 'quotaSource',
      width: 330,
      render(source, record) {
        const templateFn =
          {
            subscription_package_capacity: () => t(Strings.capacity_from_subscription_package),
            official_gift_capacity: () => t(Strings.capacity_from_official_gift),
            purchase_capacity: () => t(Strings.capacity_from_purchase),
            participation_capacity: () => {
              const inviteUserInfo = record.inviteUserInfo;
              if (!inviteUserInfo) return null;
              const userId = inviteUserInfo.userId;
              const avatar = inviteUserInfo.avatar;
              const userName = inviteUserInfo.userName || t(Strings.guests_per_space);
              return (
                <div className={styles.source}>
                  <TComponent
                    tkey={t(Strings.capacity_from_participation)}
                    params={{
                      user: (
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
                              avatar={avatar}
                              name={userName || t(Strings.guests_per_space)}
                              maxWidth={100}
                            />
                          </span>
                        </UserCardTrigger>
                      ),
                    }}
                  />
                </div>
              );
            },
          }[source] || (() => source);

        return templateFn();
      },
    },
    { title: t(Strings.attachment_capacity_details_model_capacity_size), dataIndex: 'quota' },
    {
      title: t(Strings.attachment_capacity_details_model_expiry_time),
      dataIndex: 'expireDate',
      render(date) {
        return date == '-1' ? t(Strings.attachment_capacity_details_model_expiry_time_permanent) : date;
      },
    },
  ];
  const [list, setList] = useState([]);

  const [currTab, setCurrTab] = useState(CapacityType.InEffect);
  const { getCapacityRewardListReq } = useCapacityRequest();
  const { run: getCapacityRewardList } = useRequest(getCapacityRewardListReq, { manual: true });
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    const isExpire = currTab === CapacityType.Expired;
    getCapacityRewardList(isExpire, pageNo).then((res) => {
      const _list = res.records.map((item: any, index) => {
        return {
          ...item,
          key: index,
        };
      });
      setList(_list);
      setTotal(res.total);
    });
  }, [currTab, getCapacityRewardList, pageNo]);

  const TableEl = (
    <div className={styles.rewardTable}>
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
      title={<div>{t(Strings.attachment_capacity_details_model_title)}</div>}
      visible
      className={styles.capacityRewardModal}
      width={856}
      centered
      onCancel={onCancel}
      footer={null}
      zIndex={100}
    >
      <div className={styles.content}>
        <Tabs
          onChange={(type) => {
            setCurrTab(type as CapacityType);
            setPageNo(1);
          }}
        >
          <TabPane tab={t(Strings.attachment_capacity_details_model_tab_in_effect)} key={CapacityType.InEffect} />
          <TabPane tab={t(Strings.attachment_capacity_details_model_tab_expired)} key={CapacityType.Expired} />
        </Tabs>
        {TableEl}
      </div>
    </Modal>
  );
};

export const expandCapacityRewardModal = () => {
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
            <CapacityRewardModal onCancel={close} />
          </ThemeProvider>
        </Provider>
      </ConfigProvider>,
    );
  };

  render();
};
