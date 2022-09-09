import { integrateCdnHost, TrackEvents } from '@vikadata/core';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import { Modal as ModalBase } from 'pc/components/common/modal/modal/modal';
import { Loading } from 'pc/components/preview_file/preview_type/preview_doc/loading';
import { tracker } from 'pc/utils/tracker';
import { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import IconClose from 'static/icon/common/common_icon_close_large.svg';
import dynamic from 'next/dynamic';

const PreviewMedia = dynamic(() => import('./media'), {
  loading: () => <Loading />,
  ssr: false,
});

export interface IGuideModalOptions {
  title: string;
  description: string;
  children?: Element;
  backdrop?: boolean;
  video?: string;
  onClose?: () => void;
  onPlay?: () => void;
  videoId?: string;
  autoPlay?: boolean;
}

const Modal: FC<IGuideModalOptions> = props => {
  const { title, description, backdrop, children, video, onClose, videoId, autoPlay, onPlay } = props;
  const [show, setShow] = useState(true);
  const finalClose = e => {
    setShow(false);
    onClose && onClose();
    tracker.quick('trackHeatMap', e.target);
    tracker.quick('trackHeatMap', e.target);
    if (videoId === 'VIKA_GUIDE_VIDEO_NEW_USER') {
      tracker.track(TrackEvents.IntroVideoEnd, {});
    }
  };

  useMount(() => {
    if (videoId === 'VIKA_GUIDE_VIDEO_NEW_USER') {
      tracker.track(TrackEvents.IntroVideoStart, {});
    }
  });

  return (
    <ModalBase
      visible={show}
      className={classNames('guideModal', { ['vika-guide-modal-no-box-shadow']: backdrop })}
      closable={false}
      maskClosable={!video}
      centered
      mask={backdrop}
      footer={null}
      onCancel={finalClose}
      getContainer={'.vika-guide-modal'}
    >
      <div className="vika-guide-modal-title">{title}
        <div className="vika-guide-modal-close" onClick={finalClose} id={videoId + '_CLOSE'}><IconClose /></div>
      </div>
      <div className="vika-guide-modal-body">
        <div className="vika-guide-modal-description">{description}</div>
        <div className="vika-guide-modal-children">{children}</div>
      </div>
      <div className="vika-guide-modal-video-wrap">
        {video && <PreviewMedia
          video={`${integrateCdnHost(video)}`}
          autoPlay={autoPlay}
          onPlay={onPlay}
          id={videoId}
        />}
      </div>

    </ModalBase>
  );
};
export const showModal = (props: IGuideModalOptions) => {
  const { children, video, ...rest } = props;
  const destroy = () => {
    const dom = document.querySelector('.vika-guide-modal');
    dom && document.body.removeChild(dom);
  };

  const render = () => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.setAttribute('class', video ? 'vika-guide-modal vika-guide-modal-video' : 'vika-guide-modal');
      document.body.appendChild(div);
      ReactDOM.render(
        (<Modal video={video} onClose={destroy} {...rest}>{children}</Modal>), div);
    });
  };

  const run = () => {
    destroy();
    render();
  };

  run();
};

export const destroyModal = () => {
  const destroy = () => {
    const dom = document.querySelector('.vika-guide-modal');
    dom && document.body.removeChild(dom);
  };
  destroy();
};
