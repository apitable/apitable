/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

// Check if the same script already exists
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

    // eslint-disable-next-line
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
