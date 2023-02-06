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

import { useMemo } from 'react';
import * as React from 'react';
import { t, Strings } from '@apitable/core';
import { Typography, ContextMenu, Button, TextButton } from '@apitable/components';
import { SettingOutlined, InfoFilled, DeleteOutlined } from '@apitable/icons';
import { DELETE_SPACE_CONTEXT_MENU_ID, SpaceLevelInfo } from '../../utils';
import { ChangeLogo } from '../change_logo/change_logo';
import { ChangeName } from '../change_name/change_name';
import { BasicInfo } from './basic_info';
import { ISpaceLevelType } from '../../interface';
import classnames from 'classnames';
import styles from './style.module.less';
import CorpCertifiedTag from './corp_certified_tag';
import { flatContextData } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { Popup } from 'pc/components/common/mobile/popup';

interface IInfoProps {
  showContextMenu: (e: React.MouseEvent<HTMLElement>) => void;
  handleDelSpace: () => void;
  level: ISpaceLevelType,
  certified: boolean;
  spaceId: string;
  isSocialEnabled: boolean;
  minHeight?: number | string;
  className?: string;
  isMobile?: boolean;
}

export const Info = (props: IInfoProps) => {

  const { showContextMenu, handleDelSpace, level, minHeight, className, certified, isSocialEnabled, spaceId, isMobile } = props;

  const { spaceLevelTag:{ label }} = SpaceLevelInfo[level] || SpaceLevelInfo.bronze;
  const [visible, setVisible] = React.useState(false);

  const env = getEnvVariables();

  const style: React.CSSProperties = useMemo(() => {
    if (!minHeight) return {};
    return { minHeight };
  }, [minHeight]);

  const handleClick = (e) => {
    if (!isMobile) {
      showContextMenu(e);
      return;
    }
    setVisible((val) => !val);
  };

  return <div className={classnames(styles.card, className)} style={{ ...style, transform: 'none' }}>
    {env.DELETE_SPACE_VISIBLE && <div className={styles.moreMenuWrap} onClick={handleClick}>
      <TextButton 
        size='small'
        prefixIcon={<SettingOutlined />}
      >
        {t(Strings.form_tab_setting)}
      </TextButton>
    </div>}
    {
      isMobile && <Popup
        visible={visible}
        placement="bottom"
        title={t(Strings.org_chart_setting)}
        onClose={handleClick}
        height={122}
        headerStyle={{ borderBottom: 'none', paddingBottom: 0 }}
      >
        <Button
          block
          style={{ textAlign: 'left', color: 'rgb(227, 62, 56)' ,marginTop:'24px' }}
          prefixIcon={<DeleteOutlined />}
          onClick={() => {
            setVisible(false);
            handleDelSpace();
          }}
        >
          {t(Strings.delete_space)}
        </Button>
      </Popup>
    }
    <ContextMenu
      menuId={DELETE_SPACE_CONTEXT_MENU_ID}
      overlay={flatContextData([
        [{
          text: t(Strings.delete_space),
          icon: <span />,
          onClick: handleDelSpace,
        }],
      ], true)}
    />
    <div>
      <Typography variant="h7" className={styles.spaceTitle}>
        <InfoFilled/>{t(Strings.space_info)}
      </Typography>
      <ChangeLogo />
      <ChangeName />
      <div className={styles.spaceLevel}>
        {label}
        <CorpCertifiedTag certified={certified} isSocialEnabled={isSocialEnabled} spaceId={spaceId} />
      </div>
      <BasicInfo />
    </div>
  </div>;
};