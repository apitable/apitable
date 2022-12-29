import { Events, IReduxState, Player } from '@apitable/core';

import { useMount } from 'ahooks';
import { Loading } from 'pc/components/common';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RecoverSpace } from './components/recover_space/recover_space';
import { SpaceInfo } from './space_info';

const SpaceCockpit: FC = () => {
  const spaceInfo = useSelector((state: IReduxState) => (state.space.curSpaceInfo));

  useMount(() => {
    Player.doTrigger(Events.space_setting_overview_shown);
  });

  if (!spaceInfo) {
    return <Loading />;
  }

  return (
    spaceInfo.delTime ? <RecoverSpace /> : <SpaceInfo />
  );
};

export default SpaceCockpit;
