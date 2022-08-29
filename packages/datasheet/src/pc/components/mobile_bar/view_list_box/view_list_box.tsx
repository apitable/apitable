import * as React from 'react';
import { useSelector } from 'react-redux';
import { Selectors, t, Strings } from '@vikadata/core';
import styles from './style.module.less';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import classNames from 'classnames';
import IconCheck from 'static/icon/account/account_icon_checkbox_select.svg';
import { useThemeColors } from '@vikadata/components';
import { changeView } from 'pc/hooks';

interface IViewListBox {
  displayState: boolean;
  hideViewList: () => void;
}

export const ViewListBox: React.FC<IViewListBox> = props => {
  const colors = useThemeColors();
  const { hideViewList, displayState } = props;
  const snapshot = useSelector(state => Selectors.getSnapshot(state));
  const activeViewId = useSelector(state => Selectors.getActiveView(state));

  // 更改视图
  const switchView = (id: string) => {
    if (activeViewId === id) {
      hideViewList();
      return;
    }
    changeView(id);
    hideViewList();
  };

  return (
    <>
      <div
        className={classNames({
          [styles.active]: displayState,
          [styles.viewList]: true,
        })}
      >
        <h2>{t(Strings.view_list)}</h2>
        {
          snapshot && snapshot.meta.views.map(item => {
            return (
              <div
                key={item.id}
                onClick={() => switchView(item.id)}
                className={classNames({
                  [styles.viewItem]: true,
                  [styles.active]: item.id === activeViewId,
                })}
              >
                <ViewIcon viewType={item.type} />
                <span>
                  {item.name}
                </span>
                {item.id === activeViewId && <IconCheck fill={colors.primaryColor} />}
              </div>
            );
          })
        }
      </div>
      <div className={classNames({ [styles.active]: displayState, [styles.mask]: true })} onClick={hideViewList} />
    </>
  );
};
