import dayjs from 'dayjs';

export interface IPickerProps {
  id?: number | string;
  prefixCls?: string;
  format?: string;
  className?: string;
  locale?: any;
  getCalendarContainer?: (triggerNode: Element) => HTMLElement;
  open?: boolean;
  onOpenChange?: (status: boolean) => void;
  showDateInput?: boolean | true;
  readOnly?: boolean | true;
  align?: any;
  onInputBlur?: () => void;
  suffixIcon?: React.ReactNode;
  dropdownClassName?: string;
  disabledDate?: (current: dayjs.Dayjs) => boolean;
  // 如果需要哪些属性可自行添加并在createPicker里添加相关逻辑
}
export interface IDatePickerProps extends IPickerProps {
  value?: dayjs.Dayjs;
  className?: string;
  showToday?: boolean;
  placeholder?: string;
  inputDateValue: string;
  disabled: boolean;
  onChange?: (date: dayjs.Dayjs | null, dateString: string, displayDateStr: string) => void;
  onPanelValueChange?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  renderFooter?: () => React.ReactNode;
}

export interface IMonthPickerProps extends IPickerProps {
  value: dayjs.Dayjs | null;
  onChange?: (date: dayjs.Dayjs | null) => void;
  onPanelValueChange?: () => void;
  inputDateValue: string;
}
