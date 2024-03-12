
import { Cascader as AntCascader } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { colorVars, IconButton } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronRightOutlined, AddOutlined, CloseOutlined } from '@apitable/icons';
import { ICascader } from './interface';
import styles from './styles.module.less';
export const PcCascader = (props: ICascader) => {
  const { showSearch = true, disabled, loading, options, onChange, editing, cascaderRef, ...rest } = props;

  const [search, setSearch] = useState('');

  return (
    <AntCascader
      allowClear
      showSearch={showSearch}
      disabled={disabled}
      bordered={false}
      className={classNames(styles.cascader, { [styles.cascaderDisbaled]: disabled })}
      dropdownRender={(menus) =>
        options.length > 0 ? (
          menus
        ) : (
          <div className={styles.emptyPlaceholder}>{loading ? t(Strings.loading) : t(Strings.cascader_no_data_field_error)}</div>
        )
      }
      expandIcon={<ChevronRightOutlined color={colorVars.secondLevelText} size={14} />}
      onChange={onChange}
      options={options}
      placeholder={<AddOutlined color={colorVars.secondLevelText} size={16} />}
      clearIcon={<IconButton className={styles.closeBtn} icon={CloseOutlined} />}
      onClear={() => {
        setTimeout(() => {
          cascaderRef?.current?.blur();
        });
      }}
      popupVisible={editing}
      onPopupVisibleChange={(visible) => {
        if (!visible) {
          cascaderRef?.current?.blur();
        }
      }}
      popupClassName={classNames({
        [styles.search]: Boolean(search),
      })}
      searchValue={search}
      onSearch={(value) => {
        setSearch(value);
      }}
      ref={cascaderRef}
      suffixIcon={null}
      {...rest}
    />
  );
};
