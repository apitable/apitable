import dynamic from 'next/dynamic';

const WidgetStage = dynamic(() => import('widget-stage'), { ssr: false });

const Page = () => {
  return <WidgetStage />;
};
export default Page;
