import { Api, Url } from '@apitable/core';
import axios from 'axios';
import { TemplateRecommendContext } from 'context/template_recommend';
import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { getRequestHeaders } from '../../utils/utils';

const TemplateCentre = dynamic(() => import('pc/components/template_centre/template_centre'), { ssr: true });
const TemplatePreview = dynamic(() => import('pc/components/template_centre/template_preview'), { ssr: true });

const App = (props) => {
  return <>
    <TemplateCentre>
      <TemplateRecommendContext.Provider value={{ recommendData: props.templateRecommendData }}>
        <TemplatePreview />
      </TemplateRecommendContext.Provider>
    </TemplateCentre>
  </>;
};

export const getServerSideProps = async(context: NextPageContext) => {
  const host = process.env.API_PROXY;
  axios.defaults.baseURL = host + Url.BASE_URL;
  const headers = getRequestHeaders(context);

  const res = await Api.templateRecommend(headers);

  const { success, data } = res.data;

  if (success) {
    return {
      props: {
        templateRecommendData: data
      }
    };
  }
  return { props: {}};
};

export default App;
