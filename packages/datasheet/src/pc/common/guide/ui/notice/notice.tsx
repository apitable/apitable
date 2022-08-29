import { Button, ThemeProvider } from '@vikadata/components';
import { Selectors, TrackEvents } from '@vikadata/core';
import { useMount } from 'ahooks';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display/component_display';
import { isSocialWecom } from 'pc/components/home/social_platform';
import { Method, navigationToUrl } from 'pc/components/route_manager/use_navigation';
import { store } from 'pc/store';
import { tracker } from 'pc/utils/tracker';
import { FC } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { MobileModal } from './components/mobile_modal';
import { Modal } from './components/modal';

export interface IGuideNoticeOptions {
  headerImg: string;
  readMoreTxt: string;
  readMoreUrl: string;
  children: Element;
  onClose?: (...args: any) => void;
}

const Notice: FC<IGuideNoticeOptions> = props => {
  const { headerImg, readMoreTxt, readMoreUrl, children, onClose } = props;

  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const isWecomSpace = isSocialWecom(spaceInfo);

  useMount(() => {
    const state = store.getState();
    const { curGuideWizardId: wizardId } = state.hooks;
    tracker.track(TrackEvents.UpdateLog, { wizardId });
  });

  const navHistoryUpdatePage = () => {
    navigationToUrl(readMoreUrl, { method: Method.NewTab });
  };

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Modal
          width={288}
          onClose={() => { onClose && onClose(); }}
        >
          <div className="vika-guide-notice">
            <div className={'vika-guide-notice-content'}>
              <div className={'vika-guide-notice-head-img'}
                style={{
                  backgroundImage: `url(${headerImg})`,
                }}
                onClick={navHistoryUpdatePage}
              />
              <div className={'vika-guide-notice-body'}>
                {children}
              </div>
            </div>
            {!isWecomSpace && <div className="vika-guide-notice-btnWrap">
              <Button color="primary" block onClick={navHistoryUpdatePage}>{readMoreTxt}</Button>
            </div>}
          </div>
        </Modal>
      </ComponentDisplay>
      {/* 移动端 */}
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileModal onClose={() => { onClose && onClose(); }}>
          <div className="vika-guide-notice">
            <div className={'vika-guide-notice-content'}>
              <div>
                <span onClick={navHistoryUpdatePage}>
                  <img src={headerImg} style={{ width: '100%' }} />
                </span>
              </div>
              <div className={'vika-guide-notice-body'}>
                {children}
              </div>
            </div>
            {!isWecomSpace && <div className="vika-guide-notice-btnWrap">
              <Button color="primary" block onClick={navHistoryUpdatePage}>{readMoreTxt}</Button>
            </div>}
          </div>
        </MobileModal>
      </ComponentDisplay>
    </>

  );
};
export const showNotice = (props: IGuideNoticeOptions) => {
  const { children, ...rest } = props;
  const destroy = () => {
    const dom = document.querySelector('.vika-guide-modal');
    const node = dom && dom.parentNode;
    if (node) {
      setTimeout(() => {
        try {
          if (document.body.contains(node)) {
            node && document.body.removeChild(node);
          }
        } catch (e) {
          console.error(e);
        }

      });
    }
  };

  const NoticeWithTheme = (props) => {
    const { children, ...rest } = props;
    const cacheTheme = useSelector(Selectors.getTheme);
    return (
      <ThemeProvider theme={cacheTheme}>
        <Notice {...rest}>{children}</Notice>
      </ThemeProvider>
    );
  };

  const render = () => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.setAttribute('class', 'vika-guide-modal');
      document.body.appendChild(div);
      ReactDOM.render(
        (
          <Provider store={store}>
            <NoticeWithTheme {...rest}>
              {children}
            </NoticeWithTheme>
          </Provider>
        ),
        div);
    });
  };

  const run = () => {
    destroy();
    render();
  };

  run();
};

export const destroyNotice = () => {
  const destroy = () => {
    const dom = document.querySelector('.vika-guide-modal');
    dom && document.body.removeChild(dom);
  };
  destroy();
};
