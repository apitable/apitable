import * as React from 'react';
import { Strings, t } from '@vikadata/core';
import ReactDOM from 'react-dom';
import { Modal } from 'pc/components/common';
import parser from 'html-react-parser';
import classNames from 'classnames';
import styles from './style.module.less';
import { AnimationItem } from 'lottie-web/index';
import { useMount } from 'ahooks';

interface IShowExchangeVSuccessProps {
  amount: number;
  refreshData: () => void;
}

interface IExchangeVSuccessProps {
  amount: number;
  onClose: () => void;
}

const ANIMATE_DOM_ID = 'ANIMATE_DOM_ID';

const loadAnimation = async(ele: Element) => {
  const exchangeSuccessJson = await import('static/json/exchange_v_success.json').then(module => module.default);
  const lottie = await import('lottie-web/build/player/lottie_svg').then(module => module.default);
  return lottie.loadAnimation({
    container: ele,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    animationData: exchangeSuccessJson,
  });
};

const ExchangeSuccess: React.FC<IExchangeVSuccessProps> = ({ amount, onClose }) => {
  const lottieAnimate = React.useRef<AnimationItem>();
  useMount(()=>{
    setTimeout(() => {
      const ele = document.querySelector(`#${ANIMATE_DOM_ID}`);
      if (ele && !ele.hasChildNodes()) {
        loadAnimation(ele).then(animation => {
          lottieAnimate.current = animation;
          lottieAnimate.current.addEventListener('complete', () => {
            lottieAnimate.current && lottieAnimate.current.goToAndPlay(43, true);
          });
        });
      }
    });
  });
  return (
    <Modal
      visible
      footer={null}
      centered
      className={styles.exchangeSuccess}
      width={440}
      onCancel={onClose}
    >
      <div id={ANIMATE_DOM_ID} className={styles.animateContainer}/>
      <div className={styles.content}>
        <div className={classNames(styles.title, styles.textCenter, styles.orange)}>
          {parser(t(Strings.entered_a_valid_redemption_code, { amount: amount.toLocaleString() }))}
        </div>
        <div className={classNames(styles.tip, styles.textCenter)}>
          {parser(t(Strings.entered_a_valid_redemption_code_info))}
        </div>
      </div>
    </Modal>
  );
};
export const showExchangeSuccess = (props: IShowExchangeVSuccessProps) => {
  const { amount, refreshData } = props;
  const div = document.createElement('div');
  document.body.appendChild(div);

  const destroy = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    refreshData();
  };

  function render() {
    ReactDOM.render(
      (<ExchangeSuccess amount={amount} onClose={destroy}/>),
      div,
    );
  }
  render();
};