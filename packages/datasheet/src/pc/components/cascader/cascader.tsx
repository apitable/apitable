import { Cascader as AntCascader } from 'antd';
import styles from './styles.module.less';
import { Strings, t } from '@apitable/core';
import { ChevronRightOutlined, AddOutlined, CloseOutlined } from '@apitable/icons';
import { colorVars, IconButton } from '@apitable/components';
import { ICascaderOption } from 'pc/utils';
import { MutableRefObject } from 'react';
import React from 'react';

interface ICascader {
  loading?: boolean;
  options: ICascaderOption[];
  onChange: (values: (string | number)[]) => void;
  editing?: boolean;
  cascaderRef: MutableRefObject<any>;
  value: string[][] | string[];
  displayRender?: (label: string[]) => React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Cascader = (props: ICascader) => {
  const { loading, options, onChange, editing, cascaderRef, ...rest } = props;
  return (
    <AntCascader
      allowClear
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
      ref={cascaderRef}
      suffixIcon={null}
      {...rest}
    />
  )
}