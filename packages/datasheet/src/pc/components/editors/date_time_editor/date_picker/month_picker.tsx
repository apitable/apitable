import MonthCalendar from 'rc-calendar/es/MonthCalendar';
import * as React from 'react';
import createPicker from './create_picker';
import { IMonthPickerProps } from './interface';
import wrapPicker from './wrap_picker';

const MonthPicker = wrapPicker(createPicker(MonthCalendar)) as React.ClassicComponentClass<IMonthPickerProps>;

export default MonthPicker;
