import classNames from 'classnames';
import { memo, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState, useEffect, useCallback, useRef } from 'react';
import * as React from 'react';
import { string2Segment, ILinkedField, DatasheetApi, ISegment, ICascaderNode } from '@apitable/core';
import { Cascader } from 'pc/components/cascader';
import { mapTreeNodesRecursively, ICascaderOption } from 'pc/utils';
import { IBaseEditorProps, IEditor } from '../interface';
import { PopStructure } from '../pop_structure';
import styles from './styles.module.less';

export interface ICascaderEditorProps extends IBaseEditorProps {
  style?: React.CSSProperties;
  editing: boolean;
  editable: boolean;
  toggleEditing?: (next?: boolean) => void;
  showSearch?: boolean;
}

const CascaderEditorBase: ForwardRefRenderFunction<IEditor, ICascaderEditorProps> = (
  { field, style, datasheetId, height, width, editing, toggleEditing, onSave, editable, showSearch = true },
  ref,
) => {
  const cascaderRef = useRef<any>(null);

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => cascaderRef.current && cascaderRef.current!.focus(),
      onEndEdit: () => {},
      onStartEdit: (value?: ISegment[] | null) => onStartEdit(value),
      setValue: (value?: ISegment[] | null) => onStartEdit(value),
      saveValue: () => {},
    }),
  );
  const [cascaderValue, setCascaderValue] = useState<string[]>([]);
  const [options, setOptions] = useState<ICascaderOption[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTreeSnapshot = useCallback(async () => {
    setLoading(true);
    const res = await DatasheetApi.getCascaderSnapshot({
      datasheetId,
      fieldId: field.id,
      linkedFieldIds: field.property.linkedFields.map((linkedField: ILinkedField) => linkedField.id),
    });

    const nodes: ICascaderNode[] = res?.data?.data?.treeSelectNodes || [];

    const options = mapTreeNodesRecursively<ICascaderNode>(nodes, 'text');

    setOptions(options);
    setLoading(false);
  }, [datasheetId, field.id, field.property.linkedFields]);

  const onStartEdit = (value?: ISegment[] | null) => {
    if (!value) {
      setCascaderValue([]);
      return;
    }

    setCascaderValue(value.map((v: ISegment) => v.text));
  };

  const onClose = () => {
    toggleEditing && toggleEditing();
  };

  const onChange = (values?: (string | number)[]) => {
    if (!onSave) return;
    onSave(values ? string2Segment(values.join('/')) : undefined);

    onClose();
  };

  useEffect(() => {
    if (editing) {
      loadTreeSnapshot();
    }
  }, [loadTreeSnapshot, editing]);

  return (
    <PopStructure
      style={style}
      height={height}
      editing={editing}
      width={width}
      onClose={onClose}
      className={styles.cascaderEditor}
      disableMinWidth
      disableMobile
    >
      <div className={classNames(styles.cascaderContainer, 'cascaderContainer')}>
        <Cascader
          showSearch={showSearch}
          loading={loading}
          onChange={onChange}
          options={options}
          editing={editing}
          disabled={!editable}
          cascaderRef={cascaderRef}
          style={{
            height: `${height}px`,
            lineHeight: `${height}px`,
          }}
          displayRender={(label) => {
            return field.property.showAll ? label.join('/') : label[label.length - 1];
          }}
          value={cascaderValue.map((cv) => cv.split('/'))}
        />
      </div>
    </PopStructure>
  );
};

export const CascaderEditor = memo(forwardRef(CascaderEditorBase));
