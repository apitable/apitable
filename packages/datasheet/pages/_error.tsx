import dynamic from 'next/dynamic';

const ErrorPage = dynamic(() => import('error_page'), { ssr: true });

const Error = () => {
  return <ErrorPage />;
};
export default Error;
