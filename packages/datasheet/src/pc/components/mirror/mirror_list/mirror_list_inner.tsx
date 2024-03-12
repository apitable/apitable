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

import Image from 'next/image';
import * as React from 'react';
import { Button, Checkbox, Skeleton, Typography, useThemeColors } from '@apitable/components';
import { CollaCommandName, ConfigConstant, Events, ICollaCommandOptions, Navigation, Player, Selectors, Strings, t, ThemeName } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { PopUpTitle } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useCatalog } from 'pc/hooks/use_catalog';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import MirrorEmptyDark from 'static/icon/common/mirror_empty_dark.png';
import MirrorEmptyLight from 'static/icon/common/mirror_empty_light.png';
import { IMirrorItem } from './interface';
import { gstMirrorIconByViewType } from './utils';
import styles from './style.module.less';

interface IMirrorListInner {
  mirrorList: IMirrorItem[];
  creatable: boolean;
  loading: boolean;
}

interface IBlankInner {
  mirrorCreatable: boolean;
  createMirrorNode: () => void;
}

const BlankInner = ({ createMirrorNode, mirrorCreatable }: IBlankInner) => {
  const theme = useAppSelector((state) => state.theme);
  const MirrorEmpty = theme === ThemeName.Light ? MirrorEmptyLight : MirrorEmptyDark;
  return (
    <div className={styles.blackInner}>
      <div className={styles.imgBox}>
        <Image src={MirrorEmpty} alt="" width={160} height={120} />
      </div>
      <span className={styles.emptyText}>{t(Strings.black_mirror_list_tip)}</span>
      <Button color={'primary'} onClick={createMirrorNode} disabled={!mirrorCreatable}>
        {t(Strings.create_mirror_by_view)}
      </Button>
    </div>
  );
};

export const MirrorListInner: React.FC<React.PropsWithChildren<IMirrorListInner>> = (props) => {
  const colors = useThemeColors();
  const { mirrorList, loading } = props;
  const { datasheetId, viewId } = useAppSelector((state) => state.pageParams)!;
  const folderId = useAppSelector((state) => {
    return Selectors.getDatasheetParentId(state, datasheetId);
  });
  const view = useAppSelector((state) => {
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    return Selectors.getViewById(snapshot, viewId!);
  });

  const mirrorCreatable = useAppSelector((state) => {
    const { manageable } = Selectors.getPermissions(state);
    const { manageable: folderManageable } = state.catalogTree.treeNodesMap[folderId!]?.permissions ||
    state.catalogTree.privateTreeNodesMap[folderId!]?.permissions || {};
    return manageable && folderManageable;
  });
  const execute = (cmd: ICollaCommandOptions) => resourceService.instance!.commandManager.execute(cmd);
  const { editable } = useAppSelector((state) => Selectors.getPermissions(state));

  const { addTreeNode } = useCatalog();

  const createMirrorNode = () => {
    addTreeNode(
      folderId,
      ConfigConstant.NodeType.MIRROR,
      {
        datasheetId,
        viewId,
      },
      `${view!.name}${t(Strings.key_of_adjective)}${t(Strings.mirror)}`,
    );
    Player.doTrigger(Events.datasheet_create_mirror_tip);
  };

  const linkTo = (id: string) => {
    Router.push(Navigation.WORKBENCH, {
      params: {
        nodeId: id,
      },
    });
  };

  const switchShowHiddenFieldWithinMirror = (checked: boolean) => {
    executeCommandWithMirror(() => {
      execute({
        cmd: CollaCommandName.ModifyViews,
        data: [
          {
            viewId: view!.id,
            key: 'displayHiddenColumnWithinMirror',
            value: checked,
          },
        ],
      });
    }, {});
  };

  return (
    <div className={styles.mirrorListInner}>
      <PopUpTitle
        variant={'h7'}
        title={t(Strings.mirror)}
        infoUrl={t(Strings.mirror_help_url)}
        className={styles.boxTop}
        rightContent={
          editable ? (
            <div className={styles.switchCoverFit}>
              <Checkbox
                checked={typeof view!.displayHiddenColumnWithinMirror === 'boolean' ? view!.displayHiddenColumnWithinMirror : true}
                onChange={switchShowHiddenFieldWithinMirror}
                size={14}
              />
              <span style={{ paddingLeft: 4 }}>{t(Strings.mirror_show_hidden_checkbox)}</span>
            </div>
          ) : undefined
        }
      />
      {loading ? (
        <div className={styles.skeletonWrapper} style={{ width: 368, height: 200 }}>
          <Skeleton count={2} height="24px" />
        </div>
      ) : mirrorList.length ? (
        <div>
          <div className={styles.scroll}>
            {mirrorList.map((item) => {
              return (
                <div
                  key={item.nodeId}
                  className={styles.listItem}
                  onClick={() => {
                    linkTo(item.nodeId);
                  }}
                >
                  {gstMirrorIconByViewType(view!.type)}
                  <Typography variant={'body3'} ellipsis>
                    {item.nodeName}
                  </Typography>
                </div>
              );
            })}
          </div>
          <Button
            color={colors.defaultBg}
            disabled={!mirrorCreatable}
            className={styles.operateButton}
            onClick={createMirrorNode}
            block
            prefixIcon={<AddOutlined color={colors.thirdLevelText} />}
          >
            <Typography variant={'body3'}>{t(Strings.create_mirror_by_view)}</Typography>
          </Button>
        </div>
      ) : (
        <BlankInner createMirrorNode={createMirrorNode} mirrorCreatable={mirrorCreatable} />
      )}
    </div>
  );
};
