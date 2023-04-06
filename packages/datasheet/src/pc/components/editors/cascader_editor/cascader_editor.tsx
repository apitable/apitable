import { memo, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Cascader } from 'pc/components/cascader';
import { string2Segment, ILinkedField, DatasheetApi, Selectors, ISegment, ICascaderNode } from '@apitable/core';
import { PopStructure } from '../pop_structure';
import { IEditor } from '../interface';
import { IEditorProps } from '../options_editor';
import { mapTreeNodesRecursively, ICascaderOption } from 'pc/utils';
import styles from './styles.module.less';
import classNames from 'classnames';

const CascaderEditorBase: ForwardRefRenderFunction<IEditor, IEditorProps> = ({
  field,
  style,
  datasheetId,
  height,
  width,
  editing,
  toggleEditing,
  onSave,
  editable,
}, ref) => {
  const spaceId = useSelector(Selectors.activeSpaceId)!;

  const cascaderRef = useRef<any>(null);

  useImperativeHandle(ref, (): IEditor => ({
    focus: () => cascaderRef.current && cascaderRef.current!.focus(),
    onEndEdit: () => {},
    onStartEdit: (value?: ISegment[] | null) => onStartEdit(value),
    setValue: (value?: ISegment[] | null) => onStartEdit(value),
    saveValue: () => {},
  }));

  const [cascaderValue, setCascaderValue] = useState<string[]>([]);
  const [options, setOptions] = useState<ICascaderOption[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTreeSnapshot = useCallback(async() => {
    setLoading(true);
    const res = await DatasheetApi.getCascaderSnapshot({
      spaceId,
      datasheetId,
      fieldId: field.id,
      linkedFieldIds: field.property.linkedFields.map((linkedField: ILinkedField) => linkedField.id),
    });

    const nodes: ICascaderNode[] = res?.data?.data?.treeSelectNodes || [];

    const options = mapTreeNodesRecursively<ICascaderNode>(nodes, 'text');

    setOptions(options);
    setLoading(false);
  }, [spaceId, datasheetId, field.id, field.property.linkedFields]);

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
    >
      <div className={classNames(styles.cascaderContainer, 'cascaderContainer')}>
        <Cascader
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
          displayRender={label => {
            return field.property.showAll ? label.join('/') : label[label.length - 1];
          }}
          value={cascaderValue.map(cv => cv.split(('/')))}
        />
      </div>
    </PopStructure>
  );
};

export const CascaderEditor = memo(forwardRef(CascaderEditorBase));