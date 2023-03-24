import { Button, IconButton, IOption, LinkButton, Loading, Select, useThemeColors } from '@apitable/components';
import { DatasheetApi, ICascaderField, ICascaderNode, IField, ILinkedField, IReduxState, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined, ChevronRightOutlined, DeleteOutlined, InformationSmallOutlined, ReloadOutlined } from '@apitable/icons';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Message, Tooltip } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import styles from './styles.module.less';

interface ICascaderRulesModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  currentField: ICascaderField;
  setCurrentField: React.Dispatch<React.SetStateAction<IField>>;
}

const initLinkedFields = (linkedFields: ILinkedField[]): (ILinkedField | undefined)[] => (!linkedFields.length ? [undefined] : linkedFields);

export const CascaderRulesModal = ({ visible, setVisible, currentField, setCurrentField }: ICascaderRulesModalProps): JSX.Element => {
  const spaceId = useSelector(Selectors.activeSpaceId)!;
  const linkedDatasheet = useSelector((state: IReduxState) => Selectors.getDatasheet(state, currentField.property.linkedDatasheetId));

  const colors = useThemeColors();

  const [linkedFields, setLinkedFields] = useState<(ILinkedField | undefined)[]>(initLinkedFields(currentField.property.linkedFields));
  const [fullLinkedFields, setFullLinkedFields] = useState<ILinkedField[]>(currentField.property.fullLinkedFields);
  const [cascaderPreviewLoading, setCascaderPreviewLoading] = useState(false);
  const [previewNodesMatrix, setPreviewNodesMatrix] = useState<ICascaderNode[][]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  const onCancel = () => setVisible(false);

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

  const loadData = async(_linkedFields: ILinkedField[], isLoading?: boolean) => {
    isLoading && setCascaderPreviewLoading(true);

    const res = await DatasheetApi.getCascaderData({
      spaceId,
      datasheetId: currentField.property.linkedDatasheetId,
      linkedViewId: currentField.property.linkedViewId,
      linkedFieldIds: _linkedFields.map((linkedField) => linkedField.id),
    });

    isLoading && setCascaderPreviewLoading(false);

    if (res.data.success) {
      return res.data.data;
    }

    Message.error({
      content: res.data.message,
    });

    return;
  };

  const onRefreshConfig = async() => {
    const res = await loadData([], true);

    if (res?.linkedFields && res.linkedFields.length > 0) {
      setFullLinkedFields(res.linkedFields);
    }

    if (res?.treeSelects && res.treeSelects.length > 0) {
      setPreviewNodesMatrix([res.treeSelects]);
      setSelectedNodeIds([]);
    }
  };

  const onFieldSelect = async(selectedFieldId: string, selectedIndex: number, oldFieldId?: string) => {
    if (selectedFieldId === oldFieldId) return;
    const selectedField = fullLinkedFields.find((linkableField) => linkableField.id === selectedFieldId);
    if (!selectedField) return;

    const newLinkedFields = linkedFields.map((field, index) => (selectedIndex === index ? selectedField : field));
    setLinkedFields(newLinkedFields);

    // TODO(Perhaps the client should cache and maintain this cascade structure data)
    const res = await loadData(newLinkedFields.filter((linkedField) => !!linkedField) as ILinkedField[]);
    if (res?.treeSelects && res.treeSelects.length > 0) {
      setPreviewNodesMatrix([res.treeSelects]);
      setSelectedNodeIds([]);
    }
  };

  const onRemoveLinkedField = async(linkedFieldId: string | undefined, index: number) => {
    if (linkedFields.length === 1) {
      setLinkedFields([undefined]);
      return;
    }

    const newLinkedFields = linkedFields.filter((_linkedField, linkedFieldIndex) => linkedFieldIndex !== index);
    setLinkedFields(newLinkedFields);

    // reset cascader preview after field removement, or the preview could be confused
    if (linkedFieldId) {
      const res = await loadData(newLinkedFields.filter((linkedField) => !!linkedField) as ILinkedField[]);
      if (res?.treeSelects) {
        setPreviewNodesMatrix([res.treeSelects]);
        setSelectedNodeIds([]);
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

  useEffect(() => {
    if (!visible) return;

    const fetchData = async() => {
      try {
        const res = await loadData(currentField.property.linkedFields);

        setPreviewNodesMatrix(res?.treeSelects ? [res.treeSelects] : []);

        // set two initial fields for the first-time config
        if (!currentField.property.linkedFields?.length && res?.linkedFields) {
          setFullLinkedFields(res.linkedFields);
          setLinkedFields(res.linkedFields.slice(0, 5));
        }
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
                  .filter(fullLinkedField => {
                    if (fullLinkedField.id === linkedField?.id) {
                      return true;
                    }
                    return !linkedFields.some(field => field?.id === fullLinkedField.id);
                  })
                  .map((fullLinkedField: ILinkedField) => ({
                    label: fullLinkedField.name,
                    value: fullLinkedField.id,
                  }))
                }
              />
              {linkedFields.length > 2 && (
                <IconButton className={styles.deleteButton} icon={DeleteOutlined} onClick={() => onRemoveLinkedField(linkedField?.id, index)} />
              )}
            </div>
            <div className={styles.fieldPreview}>{<RenderPreview linkedField={linkedField} index={index} />}</div>
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

  const RenderPreview = ({ linkedField, index }: React.PropsWithChildren<{ linkedField: ILinkedField | undefined, index: number }>) => {
    if (!linkedField) return null;

    return (
      <div>
        {previewNodesMatrix[index]?.map((_node: ICascaderNode) => {
          const isLeaf = !_node?.children?.length;
          const isSelect = selectedNodeIds.some((nodeId) => nodeId === `${_node.linkedFieldId}-${_node.linkedRecordId}`);

          return (
            <Button
              block
              className={classNames([styles.previewOption, !isSelect && styles.previewOptionUnselected])}
              color={isSelect ? 'primary' : 'default'}
              key={_node.linkedRecordId}
              onClick={() => onPreviewCascaderSelect(_node, index, isLeaf)}
              suffixIcon={isLeaf ? undefined : <ChevronRightOutlined />}
              variant="jelly"
            >
              <span title={_node?.text}>{_node?.text}</span>
            </Button>
          );
        })}
      </div>
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
      okText={t(Strings.confirm)}
      onCancel={onCancel}
      onOk={onOk}
      title={
        <p className={styles.modalTitle}>
          <span style={{ marginRight: 6 }}>{t(Strings.cascader_rules)}</span>
          {/* TODO: help doc is not ready, waiting for Liam's feedback */}
          <Tooltip title={t(Strings.cascader_rules_help_tip)}>
            <InformationSmallOutlined color={colors.fc3} />
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
            onClick={onRefreshConfig}
            prefixIcon={<ReloadOutlined color={colors.primaryColor} />}
            underline={false}
          >
            {t(Strings.cascader_datasource_refresh)}
          </LinkButton>
        </div>
        {visible && <RenderContent/>}
      </div>
    </Modal>
  );
};