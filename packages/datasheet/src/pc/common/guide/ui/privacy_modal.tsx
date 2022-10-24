import { Button, lightColors, Typography } from '@vikadata/components';

import { Settings, Strings, t } from '@apitable/core';
import { Modal as AntdModal } from 'antd';
import classNames from 'classnames';
import { ScrollBar } from 'pc/common/guide/scroll_bar';
import { TComponent } from 'pc/components/common/t_component';
import { usePlatform } from 'pc/hooks/use_platform';
import { store } from 'pc/store';
import { isMobileApp } from 'pc/utils/env';
import { FC } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export interface IPrivacyModalProps {
  title: string;
  children?: Element;
  onClose?: () => void;
}

const PrivacyModal: FC<IPrivacyModalProps> = props => {
  const { title, children, onClose } = props;
  const { desktop } = usePlatform();

  const _isMobileApp = isMobileApp();
  const linkToPrivacyPolicy = _isMobileApp ? Settings.link_to_privacy_policy_in_app.value : Settings.link_to_privacy_policy.value;

  return (
    <AntdModal
      visible
      className={classNames('vika-guide-privacy-modal', { ['vika-guide-modal-no-box-shadow']: true })}
      width={desktop ? 560 : '78vw'}
      closable={false}
      centered
      bodyStyle={{
        height: desktop ? '68vh' : '36vh',
      }}
      title={(
        <Typography
          variant="h4"
          style={{
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
      )}
      footer={(
        <div
          className="privacy-footer"
        >
          <div className="agreement">
            <Typography variant="body3" style={{ textAlign: 'justify' }}>
              <TComponent
                tkey={t(Strings.guide_privacy_modal_content)}
                params={{
                  content: (
                    <>
                      <a href={linkToPrivacyPolicy} target="_blank" rel="noreferrer">
                        {t(Strings.vika_privacy_policy)}
                      </a>
                    </>
                  )
                }}
              />
            </Typography>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 16,
          }}>
            <Button
              onClick={onClose}
              color={lightColors.primaryColor}
              block={!desktop}
              style={{
                width: desktop ? 200 : '100%',
              }}
            >
              {t(Strings.understand_and_accept)}
            </Button>
          </div>
        </div>
      )}
      getContainer=".vika-guide-modal"
    >
      <ScrollBar>
        <div
          className={'vika-guide-notice-content'}
        >
          <div className={'vika-guide-notice-body'}>
            {children}
          </div>
        </div>
      </ScrollBar>
    </AntdModal>
  );
};
export const showPrivacyModal = (props: IPrivacyModalProps) => {
  const { children, ...rest } = props;
  const destroy = () => {
    const dom = document.querySelector('.vika-guide-modal');
    const node = dom && dom.parentNode;
    if (node) {
      setTimeout(() => {
        node && document.body.removeChild(node);
      });

    }
  };

  const render = () => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.setAttribute('class', 'vika-guide-modal');
      document.body.appendChild(div);
      ReactDOM.render(
        (<Provider store={store}><PrivacyModal {...rest}>{children}</PrivacyModal></Provider>), div);
    });
  };

  const run = () => {
    destroy();
    render();
  };

  run();
};

export const destroyPrivacyModal = () => {
  const destroy = () => {
    const dom = document.querySelector('.vika-guide-modal');
    dom && document.body.removeChild(dom);
  };
  destroy();
};
