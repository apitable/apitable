import { Navigation, StoreActions, Strings, t } from '@vikadata/core';
import { Tooltip } from 'antd';
import { FC } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import DescIcon from 'static/icon/datasheet/datasheet_icon_skip.svg';
import { stopPropagation } from '../../../utils/dom';
import styles from './style.module.less';
import { useThemeColors } from '@vikadata/components';
import { useNavigation, navigationToUrl, Method } from 'pc/components/route_manager/use_navigation';
import path from 'path-browserify';

export enum JumpIconMode {
  Badge,
  Normal
}

interface ILinkJumpProps {
  foreignDatasheetId: string;
  viewId?: string;
  foreignFieldId?: string | null;
  iconColor?: string;
  mode?: JumpIconMode;
  hideOperateBox?: () => void;
}

export const LinkJump: FC<ILinkJumpProps> = (props) => {
  const colors = useThemeColors();
  const { mode = JumpIconMode.Normal, children, foreignDatasheetId, foreignFieldId, viewId, hideOperateBox } = props;
  const { hasShareId, hasTemplateId } = useSelector(state => ({
    hasShareId: Boolean(state.pageParams.shareId),
    hasTemplateId: Boolean(state.pageParams.templateId),
  }), shallowEqual);
  const navigationTo = useNavigation();
  const dispatch = useDispatch();

  if (hasShareId || hasTemplateId) {
    return <>{children}</>;
  }

  const handleClick = e => {
    stopPropagation(e);
    if (!foreignFieldId) {
      const url = new URL(window.location.href);
      url.pathname = path.join('workbench', foreignDatasheetId, viewId || '');
      navigationToUrl(url.href, { method: Method.Push });
      return;
    }
    foreignFieldId && dispatch(StoreActions.setHighlightFieldId(foreignFieldId, foreignDatasheetId));
    hideOperateBox && hideOperateBox();
    navigationTo({ path: Navigation.WORKBENCH, params: { nodeId: foreignDatasheetId, viewId }});
  };

  return (
    <Tooltip title={t(Strings.jump_link_url)}>
      <span
        className={mode === JumpIconMode.Badge ? styles.textWrapper : styles.iconWrapper}
        onClick={handleClick}
      >
        <sup>
          <DescIcon fill={colors.primaryColor} width={10} height={10} />
        </sup>
      </span>
    </Tooltip>
  );
};
