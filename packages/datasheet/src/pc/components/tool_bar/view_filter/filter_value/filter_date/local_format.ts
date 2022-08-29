// import { PickerLocale } from 'antd/es/date-picker/generatePicker';
import local from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';

class LocalHelper {
  getDefinedChineseLocal() {
    const definedChineseLocal: any = {
      ...local,
      lang: {
        ...local.lang,
        monthFormat: 'M月',
        shortWeekDays: ['日', '一', '二', '三', '四', '五', '六']
      }
    };
    return definedChineseLocal;
  }
}

export const LocalFormat = new LocalHelper();
