
import { TComponent } from '.';
import { Button } from '@vikadata/components';
import { Tag } from '../tag';
import { t, Strings } from '@vikadata/core';

export function TComponentDemo() {
  // eslint-disable-next-line
  const tkey = '这是一个带 component 的 i18n。 ${btn}组件${btn},这是第二个 ${tag} 组件';
  const params = {
    btn: <Button color="primary">{t(Strings.test)}</Button>,
    tag: <Tag>tag</Tag>,
  };
  return <TComponent tkey={tkey} params={params} />;
}
