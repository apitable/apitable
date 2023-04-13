import { Cascader as AntCascader } from 'antd';
import styles from './styles.module.less';
import { Strings, t } from '@apitable/core';
import { ChevronRightOutlined, AddOutlined, CloseOutlined } from '@apitable/icons';
import { colorVars, IconButton } from '@apitable/components';
import React from 'react';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from '../common/component_display';
import { ICascader } from './interface';
import { MobileCascader } from './mobile_cascader';

export const Cascader = (props: ICascader) => {
  const { loading, options, onChange, editing, cascaderRef, ...rest } = props;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  if (isMobile) {
    return (
      <MobileCascader
        cascaderRef={cascaderRef}
        options={options}
        value={rest.value}
        onChange={onChange}
      />
    );
  }
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
  );
};