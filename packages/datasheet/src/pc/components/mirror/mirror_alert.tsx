import { useEffect, useState } from 'react';
import * as React from 'react';
import { Api } from '@vikadata/core';
import { NodeType } from '@vikadata/core/dist/config/constant';
import { StatusAlert } from 'pc/components/common';

interface IMirrorAlertProps {
  datasheetId: string;
  viewId: string;
  style?: React.CSSProperties
}
// 该文件暂时废弃
export const MirrorAlert: React.FC<IMirrorAlertProps> = ({ datasheetId, viewId, style }) => {
  const [existMirror, setExistMirror] = useState(false);
  useEffect(() => {
    Api.getRelateNodeByDstId(datasheetId, viewId, NodeType.MIRROR).then(res => {
      const { success, data } = res.data;
      if (success) {
        setExistMirror(Boolean(data.length));
      }
    });
  }, [datasheetId, viewId]);

  if (!existMirror) {
    return null;
  }
  return <StatusAlert
    content={'该视图已生成视图镜像，你设置的分组条件会同步到镜像中'}
    style={style}
  />;
};
