import dynamic from 'next/dynamic';
import React from 'react';

const TemplateCentreWithNoSSR = dynamic(() => import('pc/components/template_centre/template_centre'), { ssr: false });
const AlbumDetailWithNoSSR = dynamic(() => import('pc/components/template_centre/album/album'), { ssr: false });

const App = () => {
  return <>
    <TemplateCentreWithNoSSR>
      <AlbumDetailWithNoSSR />
    </TemplateCentreWithNoSSR>
  </>;
};

export default App;