import { useCloudStorage, useMeta, useViewsMeta } from '../../hooks';
import React from 'react';
import { Select } from '@vikadata/components';
import { useMount } from 'ahooks';
import { InstallPosition, IOption, IViewPicker } from 'interface';
import { noop } from 'lodash';
import { Strings, t } from 'core';

const ViewPickerWrapper = (props: IViewPicker) => {
  const [pickerViewId, setPickerViewId, editable] = useCloudStorage<string | undefined>('_picker_view_id');
  const { datasheet, viewId, onChange, controlJump } = props;
  const { installPosition } = useMeta();
  const viewsMeta = useViewsMeta();
  const syncPickerViewId = (viewId?: string) => {
    if (
      editable &&
      installPosition === InstallPosition.Dashboard &&
      !datasheet &&
      controlJump &&
      pickerViewId !== viewId &&
      viewsMeta.some(viewMeta => viewMeta.id === viewId)
    ) {
      /**
       * 异步的去完成跳转关联表设置视图，不对当前操作产生影响
       */
      setTimeout(() => {
        setPickerViewId(viewId);
      });
    }
  };
  const onChangeProxy = (option: IOption) => {
    onChange && onChange(option);
    syncPickerViewId(option.value);
  };
  useMount(() => {
    syncPickerViewId(viewId);
  });
  return <ViewPickerBase {...props} onChange={onChangeProxy}/>;
};

const ViewPickerBase = (props: IViewPicker) => {
  const { viewId, onChange, placeholder, datasheet, disabled, allowedTypes } = props;
  const allViewsMeta = useViewsMeta(datasheet);
  const viewsMeta = allViewsMeta.filter(viewMate => !allowedTypes || allowedTypes?.includes(viewMate.type));

  return (
    <Select
      placeholder={placeholder || t(Strings.please_choose)}
      value={viewId as any}
      disabled={disabled}
      options={viewsMeta.map(viewMate => ({ label: viewMate.name, value: viewMate.id }))}
      onSelected={option => onChange ? onChange(option as IOption) : noop} />
  );
};

/**
 * 视图选择器，使用该组件可以选择当前维格表的所有视图
 *
 * @returns
 *
 * #### 示例
 *
 * 普通示例
 *
 * ``` ts
 * import React, { useState } from 'react';
 * import { ViewPicker } from '@vikadata/widget-sdk';
 * const Example = () => {
 *   const [viewId, setViewId] = useState()
 *   return <ViewPicker viewId={viewId} onChange={option => setViewId(option.value)} />
 * }
 *
 * ```
 *
 * 配合 {@link useCloudStorage} 实现持久化存储
 *
 * ``` ts
 * import React from 'react';
 * import { ViewPicker, useCloudStorage } from '@vikadata/widget-sdk';
 * const ExampleCloud = () => {
 *   const [viewId, setViewId] = useCloudStorage('selectViewId');
 *   return <ViewPicker viewId={viewId} onChange={option => setViewId(option.value)} />;
 * };
 * ```
 *
 */
export const ViewPicker = ViewPickerWrapper;
