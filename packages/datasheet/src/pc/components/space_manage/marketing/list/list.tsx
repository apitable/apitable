// import { Strings, t } from '@vikadata/core';
// import React from 'react';
// import { Card } from '../card/card';
// import { IApp } from '../interface';
// import style from '../style.module.less';

// export interface IListDeprecateProps {
//   type: 'open' | 'close';
//   data: IApp[];
// }

// export const List: React.FC<IListDeprecateProps> = ({
//   type,
//   data,
// }) => {
//   return (
//     <div className={style.list}>
//       <div className={style.header}>
//         {type === 'open' ? t(Strings.app_opening) : t(Strings.app_closed)}
//       </div>
//       <div className={style.group}>
//         {data.map((app) => {
//           return (
//             <Card
//               key={app.appId}
//               {...app}
//             />
//           );
//         })}
//       </div>
//     </div >
//   );
// };

import { Strings, t } from '@vikadata/core';
import * as React from 'react';
import { Card } from '../card/card';
import { AppStatus, IStoreApp } from '../interface';
import style from '../style.module.less';

export interface IListDeprecateProps {
  type: AppStatus;
  data: IStoreApp[];
}

const ListBase: React.FC<IListDeprecateProps> = ({
  type,
  data,
}) => {
  return (
    <div className={style.list}>
      <div className={style.header}>
        {type === AppStatus.Open ? t(Strings.app_opening) : t(Strings.app_closed)}
      </div>
      <div className={style.group}>
        {data.map((app) => <Card openStatus={type} key={app.appId} {...app} /> )}
      </div>
    </div >
  );
};

export const List = React.memo(ListBase);
