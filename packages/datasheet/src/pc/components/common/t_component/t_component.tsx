import * as React from 'react';

interface I18nProps {
  tkey: string;
  params: {
    [key: string]: React.ReactNode;
  };
}

export const TComponent: React.FC<I18nProps> = props => {
  const { tkey, params } = props;
  const text= tkey;

  const keys = Object.keys(params);
  if (keys.length === 0) return <>{tkey}</>;
  const startKey = keys[0];
  const keyRegx = new RegExp('\\${' + startKey + '}', 'g');
  const component = params[startKey];
  delete params[startKey];
  const segments = text.split(keyRegx);
  return (
    <>
      {segments.map((segment: string, index: number) => {
        const isPureString = !segment.includes('${');
        const showComponent = index !== segments.length - 1;
        return <React.Fragment key={index}>
          {isPureString ? segment : React.createElement(TComponent, { tkey: segment, params })}
          {showComponent && component}
        </React.Fragment>;
      })}
    </>
  );
};
