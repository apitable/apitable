import {
  Api,
  Strings,
  t,
} from '@vikadata/core';
import { Message } from 'pc/components/common';

interface ISetURLRecogProps {
  url: string;
  callback: (meta: IURLMeta) => unknown;
}

export interface IURLMeta {
  isAware: boolean;
  favicon: string | null;
  title: string | null;
}

export const recognizeURLAndSetTitle = async({
  url,
  callback,
}: ISetURLRecogProps) => {
  const res = await Api.getURLMetaBatch([url]);

  if (res?.data?.success) {
    const meta: IURLMeta = res.data.data.contents[url];

    if (meta?.isAware) {
      callback(meta);
    } else {
      Message.warning({
        content: t(Strings.url_recog_failure_message),
      });
    }
  } else {
    Message.error({
      content: res.data.message,
    });
  }
};
