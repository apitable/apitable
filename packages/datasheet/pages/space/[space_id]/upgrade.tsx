import dynamic from 'next/dynamic';

const UpgradeRouterWithNoSSR = dynamic(() => import('pc/components/route_manager/upgrade_router'), { ssr: false });

const App = () => {
  return <UpgradeRouterWithNoSSR />;
};

export default App;
