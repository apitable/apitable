import { Cascader as AntMobileCascader } from 'antd-mobile';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { colorVars } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { IMobileCascader } from './interface';
import styles from './styles.module.less';

export const MobileCascader = (props: IMobileCascader) => {
  const { value, disabled, cascaderRef, options, onChange } = props;

  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        className={`${styles.mobileCascaderText} mobileCascaderText`}
        onClick={() => {
          if (disabled) {
            return;
          }
          setVisible(true);
        }}
      >
        {!isEmpty(value) ? typeof value[0] === 'string' ? value[0] : value[0].join('/') : <AddOutlined color={colorVars.secondLevelText} size={16} />}
      </div>
      {visible && (
        <AntMobileCascader
          ref={cascaderRef}
          destroyOnClose
          options={options}
          visible={visible}
          onClose={() => setVisible(false)}
          cancelText={t(Strings.cancel)}
          confirmText={t(Strings.confirm)}
          value={isEmpty(value) || typeof value[0] === 'string' ? [] : value[0]}
          title={
            <div
              className="adm-cascader-header-button"
              onClick={() => {
                onChange(undefined);
                setVisible(false);
              }}
            >
              {t(Strings.clear)}
            </div>
          }
          onConfirm={(value, extend) => {
            if (extend.isLeaf) {
              onChange(value);
            }
          }}
        />
      )}
    </>
  );
};
