import * as React from 'react';
import classNames from 'classnames';

const scrollTo = (element, to, duration) => {
  const requestAnimationFrame = window.requestAnimationFrame ||
    function requestAnimationFrameTimeout() {
      return setTimeout(arguments[0], 10);
    };
  // jump to target if duration zero
  if (duration <= 0) {
    element.scrollTop = to;
    return;
  }
  const difference = to - element.scrollTop;
  const perTick = difference / duration * 10;

  requestAnimationFrame(() => {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  });
};

function generateOptions(length: number, step = 1) {
  const arr: number[] = [];
  for (let value = 0; value < length; value += step) {
    arr.push(value);
  }
  return arr;
}

const formatOption = (option: number) => {
  let value = `${option}`;
  if (option < 10) {
    value = `0${option}`;
  }

  return value;
};
interface IPanelProps {
  prefixCls: string;
  value: string;
  onChange?: (time: string) => void;
  hourStep?: number;
  minuteStep: number;
  clickPanelOutside: () => void;
}

interface IPanelState {
  value: string;
}

export class Panel extends React.PureComponent<IPanelProps, IPanelState> {
  list!: HTMLUListElement;
  selectedIndex!: number;
  panelRef: React.RefObject<HTMLDivElement>;

  static defaultProps: Partial<IPanelProps> = {
    prefixCls: 'cp-time-picker-panel',
    hourStep: 1,
  };

  static getDerivedStateFromProps(nextProps: IPanelProps, prevState: IPanelState) {
    const { value } = nextProps;
    // 当传入的value发生变化的时候，更新state
    if (value !== prevState.value) {
      return {
        value,
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }

  constructor(props: IPanelProps) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.panelRef = React.createRef();
    this.state = {
      value: props.value,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  scrollToSelected = (duration: number) => {
    // move to selected item
    const list = this.list;
    if (!list) {
      return;
    }
    let index = this.selectedIndex;
    if (!index || index < 0) {
      index = 0;
    }
    const topOption = list.children[index];
    const to = (topOption as HTMLLIElement).offsetTop;
    scrollTo(list, to, duration);
  };

  saveList = (node: HTMLUListElement) => {
    this.list = node;
    this.scrollToSelected(0);
  };

  onSelect = (value: string) => {
    this.props.onChange && this.props.onChange(value);
  };

  getTimeSelect(value: string) {
    const {
      prefixCls,
      hourStep,
      minuteStep,
    } = this.props;
    const hourOptions = generateOptions(24, hourStep);
    const minuteOptions = generateOptions(60, minuteStep);

    // 设置最近的时间默认选择 todo：如果已选择就用已选择的
    let selectHour;
    let selectMinute;
    let isValidHour = true;
    let isValidMinite = true;

    // 已有选择内容或填充内容
    if (value !== '') {
      const splitTime = value.split(':');
      isValidHour = !Number.isNaN(parseInt(splitTime[0], 10));
      selectHour = isValidHour ? parseInt(splitTime[0], 10) : '';
      isValidMinite = splitTime.length > 1 && !Number.isNaN(parseInt(splitTime[1], 10));
      selectMinute = isValidHour && isValidMinite ? parseInt(splitTime[1], 10) : '';
    } else {
      // 获取当前时间显示高亮
      const time = new Date();
      selectHour = time.getHours();
      selectMinute = time.getMinutes();
    }

    if (isValidHour && isValidMinite) {
      if (selectMinute <= 15) {
        selectMinute = 0;
      } else if (selectMinute > 45) {
        selectHour = selectHour === 11 ? 0 : selectHour + 1;
        selectMinute = 0;
      } else {
        selectMinute = 30;
      }
    }

    const divArr: { value: string, selected: boolean }[] = [];
    hourOptions.forEach((hourOption) => {
      minuteOptions.forEach((minuteOption) => {
        const hour = formatOption(hourOption);
        const minute = formatOption(minuteOption);
        const selected = hourOption === selectHour && minuteOption === selectMinute;
        divArr.push({
          value: hour + ':' + minute,
          selected,
        });
      });
    });
    return divArr.map((item, index) => {
      if (item.selected) {
        this.selectedIndex = index;
        this.scrollToSelected(120);
      }
      const cls = classNames({
        [`${prefixCls}-select-option-selected`]: item.selected,
      });
      return (
        <li
          className={cls}
          key={index}
          onClick={() => this.onSelect(item.value)}
        >
          {item.value}
        </li>
      );
    });
  }

  handleClickOutside(event) {
    if (this.panelRef && this.panelRef.current && !this.panelRef.current.contains(event.target)) {
      this.props.clickPanelOutside();
    }
  }

  render() {
    const {
      prefixCls,
    } = this.props;
    const {
      value,
    } = this.state;

    return (
      <div className={classNames({ [`${prefixCls}-inner`]: true })} ref={this.panelRef}>
        <div className={`${prefixCls}-combobox`}>
          <div className={`${prefixCls}-select`}>
            <ul className={`${prefixCls}-select-ul`} ref={this.saveList}>
              {this.getTimeSelect(value)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
