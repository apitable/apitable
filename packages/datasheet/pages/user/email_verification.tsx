import dynamic from 'next/dynamic';

// @ts-ignore
const DynamicComponentWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.EmailVerification;
}), { ssr: false });

const EmailVerfication = () => {
  return DynamicComponentWithNoSSR && <DynamicComponentWithNoSSR />;
};

export default EmailVerfication;