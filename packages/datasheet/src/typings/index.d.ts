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

import { Object } from 'ts-toolbelt';
import { ThemeName } from '@apitable/components';
import {
  IReduxState,
  IUserInfo,
  // @ts-ignore
  IWizardsConfig,
  TrackEvents,
} from '@apitable/core';
import { getEnvVars } from 'get_env';
import 'react-redux';

declare module 'react-redux' {
  // eslint-disable-next-line
  interface DefaultRootState extends IReduxState {}

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
  wizards?: IWizardsConfig;
  env: string;
  locale: string;
  lang?: string;
  envVars: IEnvVars;
}

export interface ISensors {
  login(userId: string, cb?: () => void): any;
  track(eventName: TrackEvents, props: { [key: string]: any }, cb?: () => void): any;
  setProfile(props: { [key: string]: any }, cb?: () => void): any;
  setOnceProfile(props: { [key: string]: any }, cb?: () => void): any;
  quick(key: string, target: Element | EventTarget, props?: { [key: string]: any }, cb?: () => void): any;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    __initialization_data__: IInitializationData;
    LiveChatWidget: any;
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
    new (callback: ResizeObserverCallback): ResizeObserver;
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
