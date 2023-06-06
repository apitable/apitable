import { Cascader as AntCascader } from 'antd';
import styles from './styles.module.less';
import { ChevronRightOutlined, AddOutlined, CloseOutlined } from '@apitable/icons';
import { colorVars, IconButton } from '@apitable/components';
import React, { useState } from 'react';
import { ICascader } from './interface';
import classNames from 'classnames';
import { Strings, t } from '@apitable/core';

export const PcCascader = (props: ICascader) => {
  const { showSearch = true, loading, options, onChange, editing, cascaderRef, ...rest } = props;

  const [search, setSearch] = useState('');

  return (
    <AntCascader
      allowClear
      showSearch={showSearch}
      bordered={false}
      className={styles.cascader}
      dropdownRender={menus => options.length > 0 ? menus : (
        <div className={styles.emptyPlaceholder}>
          {loading ? t(Strings.loading) : t(Strings.cascader_no_data_field_error)}
        </div>
      )}
      expandIcon={<ChevronRightOutlined color={colorVars.secondLevelText} size={14}/>}
      onChange={onChange}
      options={options}
      placeholder={<AddOutlined color={colorVars.secondLevelText} size={16}/>}
      clearIcon={<IconButton className={styles.closeBtn} icon={CloseOutlined}/>}
      popupVisible={editing}
      popupClassName={classNames({
        [styles.search]: Boolean(search)
      })}
      searchValue={search}
      onSearch={value => {
        setSearch(value);
      }}
      ref={cascaderRef}
      suffixIcon={null}
      {...rest}
    />
  );
};