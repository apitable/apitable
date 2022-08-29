import dynamic from 'next/dynamic';
import React from 'react';

const SettingNicknameWithNoSSR = dynamic(() => import('pc/components/setting_nickname/setting_nickname'), { ssr: false });

const App = () => {
  return <SettingNicknameWithNoSSR />;
};

export default App;
