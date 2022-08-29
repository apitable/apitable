import generatePicker from 'antd/es/date-picker/generatePicker';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs';

dayjs.extend(weekday);
dayjs.extend(localeData);

export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig as any);

