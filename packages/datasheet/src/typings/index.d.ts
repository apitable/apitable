import { ThemeName } from '@apitable/components';
import { IReduxState, IUserInfo, IWizardsConfig } from '@apitable/core';
import { getEnvVars } from 'get_env';
import 'react-redux';
import { Object } from 'ts-toolbelt';

declare module 'react-redux' {
  // eslint-disable-next-line
  interface DefaultRootState extends IReduxState { }

  export function useSelector<TState = DefaultRootState, TSelected = unknown>(
    selector: (state: TState, props?: any) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
  ): TSelected;
}
const envVars = getEnvVars();
type IEnvVars = Object.Update<typeof envVars, 'THEME', ThemeName | undefined>;

export interface IInitializationData {
  userInfo?: IUserInfo;
  version?: string;
  wizards?: IWizardsConfig
  env: string;
  locale: string;
  lang?: string;
  envVars: IEnvVars;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    __initialization_data__: IInitializationData;

    __vika_custom_config__: ICustomConfig;
  }

  const WwLogin: any;
  const QRLogin: any;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface ResizeObserver {
    observe(target: Element): void;
    unobserve(target: Element): void;
    disconnect(): void;
  }

  const ResizeObserver: {
    prototype: ResizeObserver;
    new(callback: ResizeObserverCallback): ResizeObserver;
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface ResizeObserverSize {
    inlineSize: number;
    blockSize: number;
  }

  type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface ResizeObserverEntry {
    readonly target: Element;
    readonly contentRect: DOMRectReadOnly;
    readonly borderBoxSize: ResizeObserverSize;
    readonly contentBoxSize: ResizeObserverSize;
  }
}
