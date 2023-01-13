/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Api, ConfigConstant } from '@apitable/core';
import axios from 'axios';
import { TemplateListContext } from 'context/template_list';
import { TemplateRecommendContext } from 'context/template_recommend';
import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { getRequestHeaders } from '../../../utils/utils';
import { getBaseUrl } from '../../../utils/get_base_url';

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

  axios.defaults.baseURL = getBaseUrl(context);
  const headers = getRequestHeaders(context);

  const userMeRes = await Api.getUserMe({}, false, headers);
  const { data: userInfo } = userMeRes.data;

  if (userInfo) {
    return { props: {}};
  }

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
