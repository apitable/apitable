import { useAtomValue } from 'jotai';
import { FC, memo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ConfigConstant, IReduxState, Selectors, Strings, t } from '@apitable/core';
import { DataSourceSelectorForNode } from 'pc/components/data_source_selector_enhanced/data_source_selector_for_node/data_source_selector_for_node';
import { SearchPanel } from 'pc/components/datasheet_search_panel';
import { RelatedResource } from '../../robot/robot_context';
import { automationStateAtom, loadableFormItemAtom } from '../controller';
import { SelectTrigger } from './select_trigger';

export const SelectDst: FC<{ value: string; onChange: (dstId: string | undefined) => void }> = memo(({ value, onChange }) => {
  const datasheet = useSelector((a) => Selectors.getDatasheet(a, value), shallowEqual);
  const { rootId } = useSelector((state: IReduxState) => state.catalogTree);

  const [visible, setVisible] = useState(false);

  const stateValue = useAtomValue(automationStateAtom);
  const { shareId } = useSelector((state: IReduxState) => state.pageParams);
  const name =
    shareId != null ? stateValue?.robot?.relatedResources?.find((item: RelatedResource) => item.nodeId === value)?.nodeName : datasheet?.name;
  return (
    <>
      <SelectTrigger
        variant={ConfigConstant.NodeType.DATASHEET}
        placeholder={t(Strings.please_choose)}
        onClick={() => {
          setVisible(true);
        }}
        value={value}
        label={name}
      />

      {visible && (
        <SearchPanel
          folderId={rootId}
          options={{
            showForm: false,
            showDatasheet: true,
            needPermission: 'manageable',
            showMirror: false,
            showView: false,
          }}
          noCheckPermission={false}
          activeDatasheetId={value}
          setSearchPanelVisible={(v) => {
            setVisible(v);
          }}
          onNodeSelect={({ datasheetId }) => {
            setVisible(false);
            if (datasheetId === value) {
              return;
            }
            onChange(datasheetId);
          }}
          onChange={({ datasheetId }) => {
            if (datasheetId === value) {
              return;
            }
            setVisible(false);
            onChange(datasheetId);
          }}
        />
      )}
    </>
  );
});

export const SelectForm: FC<{ value: string; onChange: (dstId: string | undefined) => void }> = memo(({ value, onChange }) => {
  const { rootId } = useSelector((state: IReduxState) => state.catalogTree);
  const { shareId } = useSelector((state: IReduxState) => state.pageParams);
  const treeMaps = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const [visible, setVisible] = useState(false);

  const form = useSelector((state: IReduxState) => Selectors.getForm(state, value), shallowEqual);

  const formMeta = useAtomValue(loadableFormItemAtom);

  const stateValue = useAtomValue(automationStateAtom);
  const node = treeMaps[value];

  let name =
    shareId != null
      ? stateValue?.robot?.relatedResources?.find((item: RelatedResource) => item.nodeId === value)?.nodeName
      : (formMeta?.data as any)?.form?.name ?? node?.nodeName;
  if(form) {
    name = form.name;
  }

  return (
    <>
      <SelectTrigger
        variant={ConfigConstant.NodeType.FORM}
        placeholder={t(Strings.please_choose)}
        onClick={() => {
          setVisible(true);
        }}
        value={value}
        label={name}
      />
      {visible && (
        <DataSourceSelectorForNode
          onHide={() => setVisible(false)}
          permissionRequired={'manageable'}
          onChange={({ formId }) => {
            if (value === formId) {
              return;
            }
            onChange(formId);
            setVisible(false);
          }}
          nodeTypes={[ConfigConstant.NodeType.FORM, ConfigConstant.NodeType.FOLDER]}
          defaultNodeIds={{ datasheetId: value, folderId: rootId, formId: value }}
          requiredData={['formId']}
        />
      )}
    </>
  );
});
