import { Api, ConfigConstant, IReduxState, Navigation, StoreActions, Strings, t } from '@vikadata/core';
import { useRequest } from 'pc/hooks';
import { NormalModal, WithTipTextInput } from 'pc/components/common';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { FC, useState } from 'react';
import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export interface ICreateDataSheetModalProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateDataSheetModal: FC<ICreateDataSheetModalProps> = props => {
  const { setShow } = props;
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const spaceId = useSelector(state => state.space.activeId);
  const navigationTo = useNavigation();
  const [error, setError] = useState('');
  const { run: addNode } = useRequest((parentId: string, type: number, nodeName?: string, preNodeId?: string) =>
    Api.addNode({ parentId, type, nodeName, preNodeId }).then(res => {
      const { data, message, success } = res.data;
      if (success) {
        dispatch(StoreActions.addNode(data));
        dispatch(StoreActions.setEditNodeId(''));
        if (type === ConfigConstant.NodeType.DATASHEET) {
          navigationTo({ path: Navigation.WORKBENCH, params: { spaceId, nodeId: data.nodeId }});
        }
      } else {
        setError(message);
      }
    }), { manual: true });
  const { parentId } = useSelector((state: IReduxState) => ({
    parentId: state.catalogTree.rootId,
  }), shallowEqual);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (error) {
      setError('');
    }
    setName(value);
    if (value.length === 0) {
      setError(t(Strings.name_length_err));
    }
  };

  const handleCancel = () => {
    setShow(false);
  };

  const handleSubmit = () => {
    if (error) {
      return;
    }
    addNode(parentId, ConfigConstant.NodeType.DATASHEET, name);
  };

  return (
    <NormalModal
      title={t(Strings.new_datasheet)}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={t(Strings.submit)}
      cancelText={t(Strings.cancel)}
      centered
      visible
    >
      <WithTipTextInput
        placeholder={t(Strings.placeholder_input_datasheet_name)}
        value={name}
        onChange={handleChange}
        error={Boolean(error)}
        helperText={error}
        block
      />
    </NormalModal>
  );
};
