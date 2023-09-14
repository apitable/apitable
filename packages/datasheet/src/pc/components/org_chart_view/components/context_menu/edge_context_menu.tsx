/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { FC, useContext } from 'react';
import { ContextMenu, useThemeColors } from '@apitable/components';
import { CollaCommandName, t, Strings } from '@apitable/core';
import { DeleteOutlined } from '@apitable/icons';
import { useStoreState } from '@apitable/react-flow';
import { resourceService } from 'pc/resource_service';
import { flatContextData } from 'pc/utils';
import { ORG_EDGE_MENU } from '../../constants';
import { FlowContext } from '../../context/flow_context';
import { INode } from '../../interfaces';

export const EdgeContextMenu: FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const { linkField, datasheetId } = useContext(FlowContext);

  const nodes = useStoreState((state) => state.nodes);

  const linkFieldId = linkField.id;
  return (
    <ContextMenu
      menuId={ORG_EDGE_MENU}
      overlay={flatContextData(
        [
          [
            {
              icon: <DeleteOutlined color={colors.thirdLevelText} />,
              text: t(Strings.org_chart_del_link_relationship),
              onClick: ({ props: { edge } }: any) => {
                const { source, target } = edge;
                const sourceNode = nodes.find((item) => item.id === source);
                if (sourceNode) {
                  const { data, id } = sourceNode as INode;
                  resourceService.instance!.commandManager.execute({
                    cmd: CollaCommandName.SetRecords,
                    datasheetId,
                    data: [
                      {
                        recordId: id,
                        fieldId: linkFieldId,
                        value: data.linkIds.filter((item) => item !== target),
                      },
                    ],
                  });
                }
              },
            },
          ],
        ],
        true,
      )}
    />
  );
};
