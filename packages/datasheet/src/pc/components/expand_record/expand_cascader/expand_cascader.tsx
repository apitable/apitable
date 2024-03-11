import { memo, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState, useEffect, useCallback, useRef } from 'react';
import { string2Segment, ILinkedField, DatasheetApi, ISegment, ICellValue, ICascaderNode } from '@apitable/core';
import { Cascader } from 'pc/components/cascader';
import { IEditor, IBaseEditorProps } from 'pc/components/editors/interface';
import { mapTreeNodesRecursively, ICascaderOption } from 'pc/utils';
import styles from './styles.module.less';

interface IExpandCascaderProps extends IBaseEditorProps {
  isFocus: boolean;
  cellValue: ICellValue;
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  className?: string;
}

const ExpandCascaderBase: ForwardRefRenderFunction<IEditor, IExpandCascaderProps> = ({ field, datasheetId, editing, onSave }, ref) => {
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
  const _editing = editing;

  const [cascaderValue, setCascaderValue] = useState<string[]>([]);
  const [options, setOptions] = useState<ICascaderOption[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTreeSnapshot = useCallback(async () => {
    setLoading(false);
    const res = await DatasheetApi.getCascaderSnapshot({
      datasheetId,
      fieldId: field.id,
      linkedFieldIds: field.property.linkedFields.map((linkedField: ILinkedField) => linkedField.id),
    });

    const nodes: ICascaderNode[] = res?.data?.data?.treeSelectNodes || [];

    const options = mapTreeNodesRecursively<ICascaderNode>(nodes, 'text');

    setOptions(options);
    setLoading(true);
  }, [datasheetId, field.id, field.property.linkedFields]);

  const onStartEdit = (value?: ISegment[] | null) => {
    if (!value) {
      setCascaderValue([]);
      return;
    }

    setCascaderValue(value.map((v: ISegment) => v.text));
  };

  const onChange = (values?: (string | number)[]) => {
    if (!onSave) return;

    onSave(values ? string2Segment(values.join('/')) : undefined);
  };

  useEffect(() => {
    if (_editing) {
      loadTreeSnapshot();
    }
  }, [loadTreeSnapshot, _editing]);

  return (
    <div className={styles.expandCascader}>
      <Cascader
        disabled={_editing}
        loading={loading}
        onChange={onChange}
        options={options}
        style={{
          height: '32px',
          lineHeight: '32px',
        }}
        cascaderRef={cascaderRef}
        displayRender={(label) => {
          return field.property.showAll ? label.join('/') : label[label.length - 1];
        }}
        value={cascaderValue.map((cv) => cv.split('/'))}
      />
    </div>
  );
};

export const ExpandCascader = memo(forwardRef(ExpandCascaderBase));
