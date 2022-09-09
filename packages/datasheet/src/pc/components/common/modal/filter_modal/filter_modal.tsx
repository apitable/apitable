import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { FC } from 'react';
import * as React from 'react';
import { BaseModal, Message } from 'pc/components/common';
import { ModalViewFilter } from 'pc/components/tool_bar/view_filter';
import { t, Strings, IFilterInfo, IFilterCondition, FilterConjunction, ILookUpField } from '@vikadata/core';
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

export const FilterModal: FC<IFilterModalProps> = props => {
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
