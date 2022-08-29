import dynamic from 'next/dynamic';

const NoMatch = dynamic(() => import('pc/components/invalid_page/no_match/no_match'), { ssr: false });

const Error = () => {
  return <NoMatch />;
};

export default Error;
