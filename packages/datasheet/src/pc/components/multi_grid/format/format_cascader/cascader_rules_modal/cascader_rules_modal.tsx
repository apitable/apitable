import classNames from 'classnames';
import { compact, find, isEqual, pick, take } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
// eslint-disable-next-line no-restricted-imports
import { IconButton, IOption, LinkButton, Loading, Select, Typography, useThemeColors } from '@apitable/components';
import { DatasheetApi, FieldType, ICascaderField, ICascaderNode, IField, ILinkedField, IReduxState, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined, ChevronRightOutlined, DeleteOutlined, QuestionCircleOutlined, ReloadOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Message, Tooltip } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { filterCommonGroup } from 'pc/components/multi_grid/type_select';
import { useAppSelector } from 'pc/store/react-redux';
import { ButtonOperateType } from 'pc/utils';
import styles from './styles.module.less';

interface ICascaderRulesModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  currentField: ICascaderField;
  setCurrentField: React.Dispatch<React.SetStateAction<IField>>;
}

const isCascaderLinkedField = (fieldType: FieldType) => filterCommonGroup(fieldType) && fieldType !== FieldType.Attachment;

const initLinkedFields = (linkedFields: ILinkedField[]): (ILinkedField | undefined)[] => (!linkedFields.length ? [undefined] : linkedFields);

export const CascaderRulesModal = ({ visible, setVisible, currentField, setCurrentField }: ICascaderRulesModalProps): JSX.Element => {
  const { linkedDatasheetId, linkedViewId, linkedFields: currFieldLinkedFields, fullLinkedFields: currFieldFullLinkedFields } = currentField.property;

  const spaceId = useAppSelector(Selectors.activeSpaceId)!;
  const datasheetId = useAppSelector(Selectors.getDatasheet)?.id!;
  const linkedDatasheet = useAppSelector((state: IReduxState) => Selectors.getDatasheet(state, linkedDatasheetId));
  const activeFieldState = useAppSelector((state) => Selectors.gridViewActiveFieldState(state, datasheetId));
  const columns = useAppSelector((state) => Selectors.getVisibleColumns(state, linkedDatasheetId))!;
  const fieldMap = linkedDatasheet?.snapshot.meta?.fieldMap;
  const primaryFullLinkedFields = columns.map((column) => pick(fieldMap?.[column.fieldId]!, ['id', 'name', 'type']));

  const colors = useThemeColors();

  const [linkedFields, setLinkedFields] = useState<(ILinkedField | undefined)[]>(initLinkedFields(currFieldLinkedFields));
  const [fullLinkedFields, setFullLinkedFields] = useState<ILinkedField[]>(currFieldFullLinkedFields);
  const [cascaderPreviewLoading, setCascaderPreviewLoading] = useState(false);
  const [previewNodesMatrix, setPreviewNodesMatrix] = useState<ICascaderNode[][]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  const onCancel = () => {
    setVisible(false);
  };

  const updateField = () => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField?.property,
        linkedFields: linkedFields as ILinkedField[],
        fullLinkedFields,
      },
    });
    setVisible(false);
  };

  const onOk = () => {
    if (linkedFields.some((linkedField) => !linkedField)) {
      Message.error({
        content: t(Strings.cascader_undefined_field_error),
      });
      return;
    }

    if (linkedFields.length < 2) {
      Message.error({
        content: t(Strings.cascader_min_field_error),
      });
      return;
    }

    if (previewNodesMatrix.length === 0 || previewNodesMatrix[0].length === 0 || previewNodesMatrix[0].every((pv) => pv?.children?.length === 0)) {
      Message.error({
        content: t(Strings.cascader_no_data_field_error),
      });
      return;
    }
    updateField();
  };

  const loadData = async (_linkedFields: ILinkedField[], isLoading: boolean, isUpdateLinked?: boolean) => {
    isLoading && setCascaderPreviewLoading(true);
    const isNewField = activeFieldState.fieldId === ButtonOperateType.AddField;
    // cascader snapshot is empty while new field or change linked datasheet
    if (isNewField || !currFieldLinkedFields.length) {
      const res = await DatasheetApi.getCascaderData({
        spaceId,
        datasheetId: linkedDatasheetId,
        linkedViewId,
        linkedFieldIds: _linkedFields.map((linkedField) => linkedField.id),
      });

      isLoading && setCascaderPreviewLoading(false);

      if (res.data.success) {
        const linkedFields = res.data.data?.linkedFields;
        if (linkedFields && linkedFields.length > 0) {
          setFullLinkedFields(linkedFields.filter((lf) => isCascaderLinkedField(lf.type)));
          // set two initial fields for the first-time config
          if (isUpdateLinked && !currFieldLinkedFields?.length) {
            setLinkedFields(linkedFields.slice(0, 2));
          }
        }
        return res.data.data?.treeSelects;
      }
      Message.error({
        content: res.data.message,
      });
    } else {
      const res = await DatasheetApi.getCascaderSnapshot({
        datasheetId,
        fieldId: currentField.id,
        linkedFieldIds: _linkedFields.map((linkedField) => linkedField.id),
      });

      isLoading && setCascaderPreviewLoading(false);

      if (res.data.success) {
        return res.data.data.treeSelectNodes;
      }
      Message.error({
        content: res.data.message,
      });
    }
    return;
  };

  // update preview nodes matrix while selected node ids changes
  const updatePreviewMatrixBySelectedNode = (_selectedNodeIds: string[], treeSelects?: ICascaderNode[]) => {
    if (!treeSelects) {
      setPreviewNodesMatrix([]);
      setSelectedNodeIds([]);
    }
    const _previewNodesMatrix: ICascaderNode[][] = [];
    let child = treeSelects!;
    for (let i = 0; i <= _selectedNodeIds.length; i++) {
      _previewNodesMatrix.push(child);
      const selectedNodeId = _selectedNodeIds[i];
      const selectdNodesMatrix = find(child, ({ linkedFieldId, linkedRecordId }) => `${linkedFieldId}-${linkedRecordId}` === selectedNodeId);
      child = selectdNodesMatrix?.children!;
    }
    setPreviewNodesMatrix(_previewNodesMatrix);
    setSelectedNodeIds(_selectedNodeIds);
  };

  const onRefreshConfig = async () => {
    // the fields of primary linked datasheet hidden or update permissions should be filter
    const filterLinkedFields = compact(linkedFields).filter((lf) => primaryFullLinkedFields.some((plf) => plf.id === lf.id));
    if (!isEqual(filterLinkedFields, linkedFields)) {
      setLinkedFields(filterLinkedFields);
    }
    const treeSelects = await loadData(filterLinkedFields, true);

    if (treeSelects && treeSelects.length > 0) {
      setPreviewNodesMatrix([treeSelects]);
      setSelectedNodeIds([]);
    }
  };

  const onFieldSelect = async (selectedFieldId: string, selectedIndex: number, oldFieldId?: string) => {
    if (selectedFieldId === oldFieldId) return;
    const selectedField = fullLinkedFields.find((linkableField) => linkableField.id === selectedFieldId);
    if (!selectedField) return;

    const newLinkedFields = linkedFields.map((field, index) => (selectedIndex === index ? selectedField : field));
    setLinkedFields(newLinkedFields);

    // TODO(Perhaps the client should cache and maintain this cascade structure data)
    const treeSelects = await loadData(newLinkedFields.filter((linkedField) => !!linkedField) as ILinkedField[], true);
    if (treeSelects) {
      const _selectedNodeIds = take(selectedNodeIds, selectedIndex);
      updatePreviewMatrixBySelectedNode(_selectedNodeIds, treeSelects);
    }
  };

  const onRemoveLinkedField = async (linkedFieldId: string | undefined, index: number) => {
    if (linkedFields.length === 1) {
      setLinkedFields([undefined]);
      return;
    }

    const newLinkedFields = linkedFields.filter((_linkedField, linkedFieldIndex) => linkedFieldIndex !== index);
    setLinkedFields(newLinkedFields);

    // reset cascader preview after field removement, or the preview could be confused
    if (linkedFieldId) {
      const treeSelects = await loadData(newLinkedFields.filter((linkedField) => !!linkedField) as ILinkedField[], false);
      if (treeSelects) {
        const _selectedNodeIds = selectedNodeIds.filter((_sn, _index) => _index !== index);
        updatePreviewMatrixBySelectedNode(_selectedNodeIds, treeSelects);
      }
    }
  };

  const onAddField = () => {
    if (linkedFields.length > 4) return;

    setLinkedFields([...linkedFields, undefined]);
  };

  const onPreviewCascaderSelect = (node: ICascaderNode, index: number, isLeaf?: boolean) => {
    if (isLeaf) return;

    setSelectedNodeIds([...selectedNodeIds.slice(0, index), `${node.linkedFieldId}-${node.linkedRecordId}`]);
    setPreviewNodesMatrix([...previewNodesMatrix.slice(0, index + 1), node.children || []]);
  };

  const handleRefresh = () => {
    Modal.warning({
      title: t(Strings.please_note),
      content: t(Strings.cascader_snapshot_update_text),
      hiddenCancelBtn: false,
      onOk: () => {
        setCascaderPreviewLoading(true);
        DatasheetApi.updateCascaderSnapshot({
          spaceId,
          datasheetId,
          fieldId: currentField.id,
          linkedDatasheetId: linkedDatasheetId,
          linkedViewId: linkedViewId,
        }).then(() => {
          setFullLinkedFields(primaryFullLinkedFields.filter((lf) => isCascaderLinkedField(lf.type)));
          onRefreshConfig();
        });
      },
    });
  };

  useEffect(() => {
    if (!visible) return;
    if (currFieldLinkedFields?.length > 0) {
      setLinkedFields(currFieldLinkedFields);
    }
    const fetchData = async () => {
      try {
        const treeSelects = await loadData(currFieldLinkedFields, true, true);
        setPreviewNodesMatrix(treeSelects ? [treeSelects] : []);
      } catch (e: any) {
        onRefreshConfig();
      }
    };

    fetchData();
  }, [visible]); // eslint-disable-line

  const RenderContent = () => {
    if (cascaderPreviewLoading)
      return (
        <div className={classNames(styles.fieldSelectsContainer, styles.loadingContainer)}>
          <Loading />
        </div>
      );

    return (
      <div className={styles.fieldSelectsContainer}>
        {linkedFields.map((linkedField, index) => (
          <div className={styles.fieldSelectCol} key={`${linkedField?.id}-${index}`}>
            <div className={styles.fieldSelect}>
              <Select
                onSelected={(option: IOption) => onFieldSelect(option.value as string, index, linkedField?.id)}
                openSearch
                searchPlaceholder={t(Strings.search)}
                placeholder={t(Strings.cascader_field_select_placeholder)}
                prefixIcon={linkedField?.type && getFieldTypeIcon(linkedField.type)}
                value={linkedField?.id}
                triggerCls={classNames([styles.select, linkedFields.length <= 2 && styles.fullWidth])}
                options={fullLinkedFields
                  .filter((fullLinkedField) => {
                    if (fullLinkedField.id === linkedField?.id) {
                      return true;
                    }
                    return !linkedFields.some((field) => field?.id === fullLinkedField.id);
                  })
                  .map((fullLinkedField: ILinkedField) => ({
                    label: fullLinkedField.name,
                    value: fullLinkedField.id,
                  }))}
              />
              {linkedFields.length > 2 && (
                <IconButton
                  shape="square"
                  className={styles.deleteButton}
                  icon={DeleteOutlined}
                  onClick={() => onRemoveLinkedField(linkedField?.id, index)}
                />
              )}
            </div>
            <div className={styles.fieldPreview}>
              <RenderPreview linkedField={linkedField} index={index} />
            </div>
          </div>
        ))}
        <div className={styles.columnAdd}>
          <Tooltip title={linkedFields.length > 4 ? t(Strings.cascader_max_field_tip) : t(Strings.cascader_new_field_tip)}>
            <div className={styles.buttonAddWrapper}>
              <IconButton className={styles.buttonAdd} disabled={linkedFields.length > 4} icon={AddOutlined} onClick={onAddField} />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  };

  const RenderPreview = ({
    linkedField,
    index,
  }: React.PropsWithChildren<{
    linkedField: ILinkedField | undefined;
    index: number;
  }>) => {
    if (!linkedField) return null;
    const currentPreviewNodes = previewNodesMatrix[index];
    if (!currentPreviewNodes) return null;

    return (
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={currentPreviewNodes.length}
            itemSize={42}
            itemKey={(idx: number) => `${currentPreviewNodes[idx].linkedFieldId}-${currentPreviewNodes[idx].linkedRecordId}`}
            itemData={currentPreviewNodes}
          >
            {({ data, index: _index, style }) => {
              const _node = data[_index];
              const isLeaf = !_node?.children?.length;
              const currNodeId = `${_node.linkedFieldId}-${_node.linkedRecordId}`;
              const isSelect = selectedNodeIds.some((nodeId) => nodeId === currNodeId);

              return (
                <div key={currNodeId} style={style}>
                  <div
                    className={classNames([styles.previewOption, !isSelect && styles.previewOptionUnselected, isLeaf && styles.isLeaf])}
                    onClick={() => onPreviewCascaderSelect(_node, index, isLeaf)}
                  >
                    <Typography component="span" variant="body3" ellipsis>
                      {_node?.text}
                    </Typography>
                    {isLeaf ? undefined : <ChevronRightOutlined />}
                  </div>
                </div>
              );
            }}
          </List>
        )}
      </AutoSizer>
    );
  };

  const renderSyncTip = () => {
    const content = t(Strings.cascader_no_sync_tip, { url: `/workbench/${linkedDatasheet?.id}`, datasheetName: linkedDatasheet?.name });

    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <Modal
      cancelText={t(Strings.cancel)}
      centered
      className={styles.cascaderRulesModal}
      closable={false}
      destroyOnClose
      maskClosable={false}
      okText={t(Strings.confirm)}
      onCancel={onCancel}
      onOk={onOk}
      title={
        <p className={styles.modalTitle}>
          <span style={{ marginRight: 6 }}>{t(Strings.cascader_rules)}</span>
          <Tooltip title={t(Strings.cascader_rules_help_tip)}>
            <a
              href={t(Strings.field_help_cascader)}
              rel="noopener noreferrer"
              target="_blank"
              style={{ cursor: 'pointer', verticalAlign: '-0.125em', marginLeft: 4, display: 'inline-block' }}
            >
              <QuestionCircleOutlined color={colors.thirdLevelText} />
            </a>
          </Tooltip>
        </p>
      }
      open={visible}
      width={920}
    >
      <div className={styles.cascaderRulesContainer}>
        <div className={styles.tipRow}>
          {renderSyncTip()}
          <LinkButton
            block={false}
            className={styles.refreshButton}
            component="button"
            onClick={handleRefresh}
            prefixIcon={<ReloadOutlined color={colors.primaryColor} />}
            underline={false}
          >
            {t(Strings.cascader_datasource_refresh)}
          </LinkButton>
        </div>
        {visible && <RenderContent />}
      </div>
    </Modal>
  );
};
