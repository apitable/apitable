import { useState, useEffect } from 'react';

export interface IScriptProps {
  src: HTMLScriptElement['src'] | null;
  checkForExisting?: boolean;
  [key: string]: any;
}

interface IScriptResult {
  loaded: boolean;
  loading: boolean; 
  error: ErrorState;
}

type ErrorState = ErrorEvent | null;

type ScriptStatus = {
  loading: boolean;
  error: ErrorState;
  scriptEl: HTMLScriptElement;
};

type ScriptStatusMap = {
  [key: string]: ScriptStatus;
};

export const scripts: ScriptStatusMap = {};

// 检查是否已经存在相同的脚本
const checkExisting = (src: string): ScriptStatus | undefined => {
  const existing: HTMLScriptElement | null = document.querySelector(
    `script[src="${src}"]`,
  );
  if (existing) {
    return (scripts[src] = {
      loading: false,
      error: null,
      scriptEl: existing,
    });
  }
  return undefined;
};

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const useScript = ({
  src,
  checkForExisting = false,
  ...attributes
}: IScriptProps): IScriptResult => {
  let status: ScriptStatus | undefined = src ? scripts[src] : undefined;

  if (!status && checkForExisting && src && isBrowser) {
    status = checkExisting(src);
  }

  const [loading, setLoading] = useState<boolean>(
    status ? status.loading : Boolean(src),
  );
  const [error, setError] = useState<ErrorState>(
    status ? status.error : null,
  );

  useEffect(() => {
    if (!isBrowser || !src || error) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    status = scripts[src];
    if (!status && checkForExisting) {
      status = checkExisting(src);
    }

    let scriptEl: HTMLScriptElement;
    if (status) {
      scriptEl = status.scriptEl;
    } else {
      scriptEl = document.createElement('script');
      scriptEl.src = src;

      Object.keys(attributes).forEach((key) => {
        if (scriptEl[key] === undefined) {
          scriptEl.setAttribute(key, attributes[key]);
        } else {
          scriptEl[key] = attributes[key];
        }
      });

      status = scripts[src] = {
        loading: true,
        error: null,
        scriptEl: scriptEl,
      };
    }

    const handleLoad = () => {
      if (status) status.loading = false;
      setLoading(false);
    };
    
    const handleError = (error: ErrorEvent) => {
      if (status) status.error = error;
      setError(error);
    };

    scriptEl.addEventListener('load', handleLoad);
    scriptEl.addEventListener('error', handleError);

    document.body.appendChild(scriptEl);

    return () => {
      scriptEl.removeEventListener('load', handleLoad);
      scriptEl.removeEventListener('error', handleError);
    };
  }, [src]);

  return {
    loading, 
    error,
    loaded: !loading && !error && Boolean(src)
  };
};
