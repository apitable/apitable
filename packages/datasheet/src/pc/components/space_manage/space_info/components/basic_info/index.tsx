import { useMemo } from 'react';
import * as React from 'react';
import { t, Strings } from '@vikadata/core';
import { Typography, IconButton, ContextMenu, Button } from '@vikadata/components';
import { SettingOutlined, InfoFilled, DeleteOutlined } from '@vikadata/icons';
import { Drawer } from 'antd';
import { DELETE_SPACE_CONTEXT_MENU_ID, SpaceLevelInfo } from '../../utils';
import { ChangeLogo } from '../change_logo/change_logo';
import { ChangeName } from '../change_name/change_name';
import { BasicInfo } from './basic_info';
import { ISpaceLevelType } from '../../interface';
import classnames from 'classnames';
import styles from './style.module.less';
import CorpCertifiedTag from './corp_certified_tag';
import { flatContextData } from 'pc/utils';

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
    <div className={styles.moreMenuWrap} onClick={handleClick}>
      <IconButton icon={SettingOutlined} size="small" />
    </div>
    {
      isMobile && <Drawer
        visible={visible}
        placement="bottom"
        title={t(Strings.org_chart_setting)}
        onClose={handleClick}
        height={122}
        headerStyle={{ borderBottom: 'none', paddingBottom: 0 }}
      >
        <Button
          block
          style={{ textAlign: 'left', color: 'rgb(227, 62, 56)' }}
          prefixIcon={<DeleteOutlined />}
          onClick={() => {
            setVisible(false);
            handleDelSpace();
          }}
        >
          {t(Strings.delete_space)}
        </Button>
      </Drawer>
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