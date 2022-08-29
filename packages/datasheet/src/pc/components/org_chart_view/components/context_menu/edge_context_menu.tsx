import { FC, useContext } from 'react';
import { FlowContext } from '../../context/flow_context';
import { ContextMenu, useThemeColors } from '@vikadata/components';
import { ORG_EDGE_MENU } from '../../constants';
import {
  DeleteOutlined,
} from '@vikadata/icons';
import {
  CollaCommandName,
  t,
  Strings,
} from '@vikadata/core';
import { INode } from '../../interfaces';
import { resourceService } from 'pc/resource_service';
import { useStoreState } from '@vikadata/react-flow-renderer';
import { flatContextData } from 'pc/utils';

export const EdgeContextMenu: FC = props => {
  const colors = useThemeColors();
  const {
    linkField,
    datasheetId,
  } = useContext(FlowContext);

  const commandManager = resourceService.instance!.commandManager;
  const nodes = useStoreState(state => state.nodes);

  const linkFieldId = linkField.id;
  return (
    <ContextMenu
      menuId={ORG_EDGE_MENU}
      overlay={flatContextData([
        [
          {
            icon: <DeleteOutlined color={colors.thirdLevelText} />,
            text: t(Strings.org_chart_del_link_relationship),
            onClick: ({ props: { edge }}) => {
              const { source, target } = edge;
              const sourceNode = nodes.find(item => item.id === source);
              if (sourceNode) {
                const { data, id } = sourceNode as INode;
                commandManager.execute({
                  cmd: CollaCommandName.SetRecords,
                  datasheetId,
                  data: [{
                    recordId: id,
                    fieldId: linkFieldId,
                    value: data.linkIds.filter(item => item !== target),
                  }],
                });
              }
            },
          },
        ],
      ], true)}
    />
  );
};
