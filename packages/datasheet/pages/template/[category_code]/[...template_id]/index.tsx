import dynamic from 'next/dynamic';
import React from 'react';

const TemplateCentreWithNoSSR = dynamic(() => import('pc/components/template_centre/template_centre'), { ssr: false });
const TemplateDetailWithNoSSR = dynamic(() => import('pc/components/template_centre/template_detail'), { ssr: false });

const App = () => {
  return <>
    <TemplateCentreWithNoSSR>
      <TemplateDetailWithNoSSR />
    </TemplateCentreWithNoSSR>
  </>;
};

export default App;
