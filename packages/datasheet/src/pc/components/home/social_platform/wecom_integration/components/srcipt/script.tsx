import { useEffect, useImperativeHandle, useState } from 'react';
import * as React from 'react';

export interface IScriptProps {
  src: string;
  reloadCount?: number;
  onload?: () => void;
  onerror?: () => void;
}

export interface IScriptRef {
  reload(cb: any): any;
}

const ScriptBase: React.ForwardRefRenderFunction<IScriptRef, IScriptProps> = (props, ref) => {

  const { src, onload, onerror, reloadCount = 3 } = props;
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, (): IScriptRef => {
    const reload = (cb) => {
      if (count >= reloadCount) {
        return cb();
      }
      const cur = document.getElementById(src);
      if (cur) {
        document.body.removeChild(cur);
      }
      setCount(count + 1);
    };
    return {
      reload
    };
  });
  
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.setAttribute('id', src);
    document.body.appendChild(script);
    script.onload = onload || (() => {});
    script.onerror = () => {
      onerror && onerror();
    };
    return () => {
      script && document.body.contains(script) && document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  return <></>;
};

export const Script = React.forwardRef(ScriptBase);