import RcCalendar from 'rc-calendar';
import * as React from 'react';
import createPicker from './create_picker';
import { IDatePickerProps } from './interface';
import wrapPicker from './wrap_picker';

const DatePicker = wrapPicker(createPicker(RcCalendar)) as React.ClassicComponentClass<IDatePickerProps>;

export default DatePicker;
