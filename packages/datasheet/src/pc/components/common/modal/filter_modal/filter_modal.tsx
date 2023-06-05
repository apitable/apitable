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

import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { FC } from 'react';
import * as React from 'react';
import { BaseModal, Message } from 'pc/components/common';
import { ModalViewFilter } from 'pc/components/tool_bar/view_filter';
import { t, Strings, IFilterInfo, IFilterCondition, FilterConjunction, ILookUpField } from '@apitable/core';
import styles from './style.module.less';

interface IFilterModalProps extends IModalProps {
  title: React.ReactNode;
  handleCancel: () => void;
  datasheetId: string;
  handleOk: (value: any) => void;
  okBtnDisabled?: boolean;
  className?: string;
  filterInfo?: IFilterInfo;
  field?: ILookUpField;
}

export const FilterModal: FC<React.PropsWithChildren<IFilterModalProps>> = props => {
  const { title, handleCancel, datasheetId, handleOk, field } = props;
  const [filterInfo, setFilters] = React.useState(props.filterInfo || {
    conditions: [] as IFilterCondition[],
    conjunction: FilterConjunction.And,
  });
  const handleSubmit = () => {
    handleOk(filterInfo);
    Message.success({ content: t(Strings.submit_filter_success) });
    handleCancel();
  };
  return (
    <BaseModal
      visible
      centered
      width={720}
      title={title}
      onCancel={handleCancel}
      onOk={handleSubmit}
      className={styles.filterModal}
    >
      <ModalViewFilter
        datasheetId={datasheetId}
        setFilters={setFilters}
        filterInfo={filterInfo}
        field={field}
      />
    </BaseModal>
  );
};
