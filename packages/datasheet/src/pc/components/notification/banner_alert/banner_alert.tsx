import { Button, LinkButton, Typography, useThemeColors } from '@vikadata/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import Image from 'next/image';
import { Emoji } from 'pc/components/common';
import ReactDOM from 'react-dom';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import Vikaby from 'static/icon/workbench/vikaby-good.png';
import styles from './style.module.less';

export interface IAlertProps {
  content: string;
  closable?: boolean;
  onClose?: any;
  btnText?: string; // 刷新页面的按钮文字，设置为空字符串或者不传此参数则不显示此按钮
  onBtnClick?: any;
  showVikaby?: boolean; // 是否显示Vikaby的头像，默认为false
  upgrade?: boolean;
}

interface IShowBannerAlert extends IAlertProps {
  destroyPrev?: boolean;
  duration?: number;
  id?: string;
}

export const AlertUi = (props: IAlertProps) => {
  const colors = useThemeColors();
  const { showVikaby = true, content, btnText, onBtnClick, closable, onClose, upgrade } = props;
  return (
    <div className={classNames(styles.alert, { [styles.hasUpgradeBtn]: upgrade })}>
      {showVikaby && <span className={styles.img}><Image src={Vikaby} /></span>}
      <div className={styles.body}>
        <Typography variant="h7" color={colors.primaryColor}>{content}</Typography>
      </div>
      {btnText && <LinkButton className={styles.reloadBtn} color={colors.primaryColor} onClick={onBtnClick}>{btnText}</LinkButton>}
      {upgrade && <Button color="primary" size={'middle'} className={styles.upgradeBtn} onClick={onBtnClick}>
        <span style={{ position: 'relative', top: 3 }}>
          <Emoji emoji={'star2'} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />
        </span>
        <span style={{ position: 'relative', left: 3 }}>{t(Strings.upgrade)}</span>
      </Button>}
      {closable && <span onClick={onClose} className={styles.close}><CloseIcon /></span>}
    </div>
  );
};

export const showBannerAlert = (config: IShowBannerAlert) => {
  const { duration = 0, destroyPrev = true, onClose, ...rest } = config;
  const BANNER_ALERT_ID = config.id || 'BANNER_ALERT';

  if (destroyPrev) {
    const prev = document.getElementById(BANNER_ALERT_ID);
    prev && prev.parentNode && prev.parentNode.removeChild(prev);
  } else {
    if (document.getElementById(BANNER_ALERT_ID)) {
      return;
    }
  }
  const div = document.createElement('div');
  div.setAttribute('class', styles.funcAlert);
  div.setAttribute('id', BANNER_ALERT_ID);
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function render() {
    setTimeout(() => {
      ReactDOM.render(
        <AlertUi
          onClose={() => {
            onClose && onClose();
            destroy();
          }}
          {...rest}
        />,
        div,
      );
    });
  }

  const start = () => {
    destroyPrev && destroy();
    render();
    if (duration !== 0) {
      setTimeout(() => {
        destroy();
      }, duration * 1000);
    }
  };
  start();
};
