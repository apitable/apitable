import { useState, useRef, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.less';

export const useShowTip = (container: HTMLElement, tipWidth: number) => {
  const [info, setInfo] = useState(
    {
      top: 0,
      title: '',
      desc: '',
    }
  );
  const divRef = useRef<HTMLDivElement>();

  const { left } = useMemo(() => {
    if (!container) return { left: 0 };
    const rect = container.getBoundingClientRect();
    const clientWidth = window.innerWidth;
    const containerRight = rect.right;
    const containerLeft = rect.left;
    if (containerRight + tipWidth > clientWidth) {
      return {
        left: containerLeft - tipWidth,
      };
    }
    return {
      left: containerRight,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

  useEffect(() => {
    function unMountDiv() {
      if (!divRef.current) return;
      ReactDOM.unmountComponentAtNode(divRef.current);
      divRef.current.parentElement &&
        divRef.current.parentElement.removeChild(divRef.current);
    }

    unMountDiv();

    if (info.top) {
      divRef.current = document.createElement('div');
      divRef.current.setAttribute('style',
        `top:${info.top}px;left:${left}px;position:fixed;z-index:1100;`
      );
      document.body.appendChild(divRef.current);
      ReactDOM.render(
        (
          <div className={styles.tip}>
            <h3>
              {info.title}
            </h3>
            <p>
              {info.desc}
            </p>
          </div>
        ),
        divRef.current
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, left]);

  return {
    setInfo,
  };
};
