import { useCloudStorage, useMeta, useViewsMeta } from '../../hooks';
import React from 'react';
import { Select } from '@apitable/components';
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
       * Asynchronously go through the jump to the associated datasheet to set the view, 
       * without affecting the current operation
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
 * 
 * View selector, using this components you can select all views of the currently datasheet.
 *
 * @returns
 *
 * #### Example
 *
 * Common usage.
 *
 * ``` ts
 * import React, { useState } from 'react';
 * import { ViewPicker } from '@apitable/widget-sdk';
 * const Example = () => {
 *   const [viewId, setViewId] = useState()
 *   return <ViewPicker viewId={viewId} onChange={option => setViewId(option.value)} />
 * }
 *
 * ```
 *
 * Use {@link useCloudStorage} implementing persistent storage.
 *
 * ``` ts
 * import React from 'react';
 * import { ViewPicker, useCloudStorage } from '@apitable/widget-sdk';
 * const ExampleCloud = () => {
 *   const [viewId, setViewId] = useCloudStorage('selectViewId');
 *   return <ViewPicker viewId={viewId} onChange={option => setViewId(option.value)} />;
 * };
 * ```
 *
 */
export const ViewPicker = ViewPickerWrapper;
