import { Api, ConfigConstant, Url } from '@apitable/core';
import axios from 'axios';
import { TemplateListContext } from 'context/template_list';
import { TemplateRecommendContext } from 'context/template_recommend';
import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { getRequestHeaders } from '../../../utils/utils';

const TemplateCentre = dynamic(() => import('pc/components/template_centre/template_centre'), { ssr: false });
const TemplatePreview = dynamic(() => import('pc/components/template_centre/template_preview'), { ssr: true });

const App = (props) => {
  return <>
    <TemplateCentre>
      <TemplateRecommendContext.Provider value={{ recommendData: props.templateRecommendData }}>
        <TemplateListContext.Provider value={{ templateListData: props.templateList }}>
          <TemplatePreview />
        </TemplateListContext.Provider>
      </TemplateRecommendContext.Provider>
    </TemplateCentre>
  </>;
};

export const getServerSideProps = async(context: NextPageContext) => {
  const { category_code: categoryCode } = context['params'];
  const host = process.env.API_PROXY;

  if (categoryCode === 'album') {
    return { props: {}};
  }

  if (categoryCode === 'tpcprivate') {
    return { props: {}};
  }

  // uncategorized template
  if (categoryCode === ConfigConstant.TEMPLATE_UNCATEGORIZED) {
    return { props: {}};
  }

  axios.defaults.baseURL = host + Url.BASE_URL;
  const headers = getRequestHeaders(context);

  if (categoryCode === 'tpc000') {
    const res = await Api.templateRecommend(headers);
    const { success, data } = res.data;
    if (success) {
      return {
        props: {
          templateList: [],
          templateRecommendData: data
        }
      };
    }
  } else {
    const res = await Api.getTemplateCategories(categoryCode, headers);
    const { success, data } = res.data;
    if (success) {
      return {
        props: {
          templateList: data,
          templateRecommendData: {}
        }
      };
    }
  }
  return { props: {}};
};

export default App;
