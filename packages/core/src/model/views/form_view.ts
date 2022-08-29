import { View } from './views';
import { Strings, t } from 'i18n';
import { Settings } from 'config';
import { integrateCdnHost } from 'utils';

export class FormView extends View {
  static getViewIntroduce() {
    return {
      title: t(Strings.form_view),
      desc: t(Strings.form_view_desc),
      videoGuide: integrateCdnHost(Settings.form_guide_video.value),
    };
  }
  static generateDefaultProperty() {
    return null;
  }
}
