import { Strings, t } from '@apitable/core';
import { CodeOutlined } from '@apitable/icons';
import { getEnvVariables } from 'pc/utils/env';

import AnythingDarkPng from 'static/icon/embed/Anything_dark.png';
import AnythingLightPng from 'static/icon/embed/Anything_light.png';
import BilibiliPng from 'static/icon/embed/Bilbili.png';
import DocsPng from 'static/icon/embed/Docs.png';
import FigmaPng from 'static/icon/embed/Figma.png';
import JishiPng from 'static/icon/embed/Jishi.png';
import SheetPng from 'static/icon/embed/Sheet.png';
import TencentDocPng from 'static/icon/embed/TencentDoc.png';
import WpsPng from 'static/icon/embed/WPS.png';
import YouTubePng from 'static/icon/embed/YouTube.png';

const AI_TABLE_CONFIG = [
  {
    name: t(Strings.embed_link_default),
    desc: t(Strings.embed_link_default_desc),
    linkText: t(Strings.embed_link_default_link_text),
    linkUrl: t(Strings.embed_link_default_link_url),
    tip: t(Strings.embed_paste_link_default_placeholder),
    icon: {
      dark: AnythingDarkPng.src,
      light: AnythingLightPng.src,
    },
  },
  {
    name: t(Strings.embed_link_google_docs),
    desc: t(Strings.embed_link_google_docs_desc),
    linkText: t(Strings.embed_link_google_docs_link_text),
    linkUrl: t(Strings.embed_link_google_docs_link_url),
    tip: t(Strings.embed_paste_link_google_docs_placeholder),
    icon: DocsPng.src,
  },
  {
    name: t(Strings.embed_link_google_sheets),
    desc: t(Strings.embed_link_google_sheets_desc),
    linkText: t(Strings.embed_link_google_sheets_link_text),
    linkUrl: t(Strings.embed_link_google_sheets_link_url),
    tip: t(Strings.embed_paste_link_google_sheets_placeholder),
    icon: SheetPng.src,
  },
  {
    name: t(Strings.embed_link_figma),
    desc: t(Strings.embed_link_figma_desc),
    linkText: t(Strings.embed_link_figma_link_text),
    linkUrl: t(Strings.embed_link_figma_link_url),
    tip: t(Strings.embed_paste_link_figma_placeholder),
    icon: FigmaPng.src,
  },
  {
    name: t(Strings.embed_link_youtube),
    desc: t(Strings.embed_link_youtube_desc),
    linkText: t(Strings.embed_link_youtube_link_text),
    linkUrl: t(Strings.embed_link_youtube_link_url),
    tip: t(Strings.embed_paste_link_youtube_placeholder),
    icon: YouTubePng.src,
  },
];

const VIKA_CONFIG = [
  {
    name: t(Strings.embed_link_default),
    desc: t(Strings.embed_link_default_desc),
    linkText: t(Strings.embed_link_default_link_text),
    linkUrl: t(Strings.embed_link_default_link_url),
    tip: t(Strings.embed_paste_link_default_placeholder),
    icon: {
      dark: AnythingDarkPng.src,
      light: AnythingLightPng.src,
    },
  },
  {
    name: t(Strings.embed_link_wps),
    desc: t(Strings.embed_link_wps_desc),
    linkText: t(Strings.embed_link_wps_link_text),
    linkUrl: t(Strings.embed_link_wps_link_url),
    tip: t(Strings.embed_paste_link_wps_placeholder),
    icon: WpsPng.src,
  },
  {
    name: t(Strings.embed_link_tencent_docs),
    desc: t(Strings.embed_link_tencent_docs_desc),
    linkText: t(Strings.embed_link_tencent_docs_link_text),
    linkUrl: t(Strings.embed_link_tencent_docs_link_url),
    tip: t(Strings.embed_paste_link_tencent_docs_placeholder),
    icon: TencentDocPng.src,
  },
  {
    name: t(Strings.embed_link_jishi_design),
    desc: t(Strings.embed_link_jishi_design_desc),
    linkText: t(Strings.embed_link_jishi_design_link_text),
    linkUrl: t(Strings.embed_link_jishi_design_link_url),
    tip: t(Strings.embed_paste_link_jsdesign_placeholder),
    icon: JishiPng.src,
  },
  {
    name: t(Strings.embed_link_bilibili),
    desc: t(Strings.embed_link_bilibili_desc),
    linkText: t(Strings.embed_link_bilibili_link_text),
    linkUrl: t(Strings.embed_link_bilibili_link_url),
    tip: t(Strings.embed_paste_link_bilibili_placeholder),
    icon: BilibiliPng.src,
  },
];

export const getConfig = () => {
  return getEnvVariables().IS_AITABLE ? AI_TABLE_CONFIG : VIKA_CONFIG;
};
