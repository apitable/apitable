import { TrackEvents, isPrivateDeployment } from '@apitable/core';

declare const sensors: {
  login(userId: string, cb?: () => void);
  track(eventName: TrackEvents, props: { [key: string]: any }, cb?: () => void);
  setProfile(props: { [key: string]: any }, cb?: () => void);
  setOnceProfile(props: { [key: string]: any }, cb?: () => void);
  quick(key: string, target: Element, props?: { [key: string]: any }, cb?: () => void)
};

export const tracker = {
  login(userId: string, cb?: () => void) {
    if (isPrivateDeployment()) return;
    return sensors.login(userId, cb);
  },
  track(eventName: TrackEvents, props: { [key: string]: any }, cb?: () => void) {
    if (isPrivateDeployment()) return;
    return sensors.track(eventName, props, cb);
  },
  setProfile(props: { [key: string]: any }, cb?: () => void) {
    if (isPrivateDeployment()) return;
    return sensors.setProfile(props, cb);
  },
  setOnceProfile(props: { [key: string]: any }, cb?: () => void) {
    if (isPrivateDeployment()) return;
    return sensors.setOnceProfile(props, cb);
  },
  quick(key: string, target: Element, props?: { [key: string]: any }, cb?: () => void) {
    if (isPrivateDeployment()) return;
    return sensors.quick(key, target, props, cb);
  },
};
