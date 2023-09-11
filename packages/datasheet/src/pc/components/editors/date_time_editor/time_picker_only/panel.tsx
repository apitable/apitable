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

import classNames from 'classnames';
import * as React from 'react';

const scrollTo = (element: HTMLUListElement, to: number, duration: number) => {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    function requestAnimationFrameTimeout() {
      return setTimeout(arguments[0], 10);
    };
  // jump to target if duration zero
  if (duration <= 0) {
    element.scrollTop = to;
    return;
  }
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;

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
    if (value !== prevState.value) {
      return {
        value,
      };
    }
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

  override componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  override componentWillUnmount() {
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
    const { prefixCls, hourStep, minuteStep } = this.props;
    const hourOptions = generateOptions(24, hourStep);
    const minuteOptions = generateOptions(60, minuteStep);

    let selectHour: number;
    let selectMinute: number;
    let isValidHour = true;
    let isValidMinite = true;

    if (value !== '') {
      const splitTime = value.split(':');
      isValidHour = !Number.isNaN(parseInt(splitTime[0], 10));
      selectHour = isValidHour ? parseInt(splitTime[0], 10) : 0;
      isValidMinite = splitTime.length > 1 && !Number.isNaN(parseInt(splitTime[1], 10));
      selectMinute = isValidHour && isValidMinite ? parseInt(splitTime[1], 10) : 0;
    } else {
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

    const divArr: { value: string; selected: boolean }[] = [];
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
        <li className={cls} key={index} onClick={() => this.onSelect(item.value)}>
          {item.value}
        </li>
      );
    });
  }

  handleClickOutside(event: any) {
    if (this.panelRef && this.panelRef.current && !this.panelRef.current.contains(event.target)) {
      this.props.clickPanelOutside();
    }
  }

  override render() {
    const { prefixCls } = this.props;
    const { value } = this.state;

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
