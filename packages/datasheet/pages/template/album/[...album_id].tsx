import { Api } from '@vikadata/core';
import dynamic from 'next/dynamic';
import React from 'react';
import { NextPageContext } from 'next';
import { getRequestHeaders } from '../../../utils/utils';

const TemplateCentreWithNoSSR = dynamic(() => import('pc/components/template_centre/template_centre'), { ssr: false });
const AlbumDetailWithNoSSR = dynamic(() => import('pc/components/template_centre/album/album'), { ssr: false });

const App = ({ album, recommends }) => {
  return <>
    <TemplateCentreWithNoSSR>
      <AlbumDetailWithNoSSR album={album} recommends={recommends} />
    </TemplateCentreWithNoSSR>
  </>;
};

export const getServerSideProps = async(context: NextPageContext) => {
  const { album_id: albumId } = context['params'];
  const headers = getRequestHeaders(context);
  const res = await Api.getTemplateAlbum(albumId[0], headers);
  const recommendRes = await Api.getTemplateAlbumsRecommend(albumId[0], 5, headers);
  const { success, data } = res.data;
  const { success: recommendSuccess, data: recommendData } = recommendRes.data;
  if (success && recommendSuccess) {
    return {
      props: {
        album: data,
        recommends: recommendData
      }
    };
  }
  return { props: {}};
};

export default App;