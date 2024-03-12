import dynamic from 'next/dynamic';

// @ts-ignore
const DynamicComponentWithNoSSR = dynamic(
  () =>
    // @ts-ignore
    import('enterprise/email_verification').then((components) => {
      return components.EmailVerification;
    }),
  { ssr: false },
);

const EmailVerfication = () => {
  return DynamicComponentWithNoSSR && <DynamicComponentWithNoSSR />;
};

export default EmailVerfication;
