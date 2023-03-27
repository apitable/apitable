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

/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const StrikethroughOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.50099 14.028C4.90699 14.636 6.41433 14.94 8.02299 14.94C8.98566 14.94 9.83433 14.7816 10.569 14.465C11.3037 14.1483 11.8737 13.7113 12.279 13.154C12.6843 12.584 12.887 11.9443 12.887 11.235C12.887 10.3736 12.6653 9.68964 12.222 9.18297C12.1684 9.11992 12.1133 9.05893 12.0568 9H13.25C13.6642 9 14 8.66421 14 8.25C14 7.83579 13.6642 7.5 13.25 7.5H8.86843C8.66593 7.44666 8.45379 7.39332 8.23199 7.33997C7.45933 7.16264 6.84499 6.99797 6.38899 6.84597C5.94566 6.68131 5.57199 6.45964 5.26799 6.18097C4.97666 5.88964 4.83099 5.51597 4.83099 5.05997C4.83099 4.37597 5.14133 3.84397 5.76199 3.46397C6.39533 3.08397 7.21233 2.89397 8.21299 2.89397C9.26433 2.89397 10.284 3.06497 11.272 3.40697C11.3987 3.45764 11.5 3.48297 11.576 3.48297C11.804 3.48297 11.9877 3.40064 12.127 3.23597C12.2663 3.07131 12.336 2.88764 12.336 2.68497C12.336 2.30497 12.1587 2.05164 11.804 1.92497C10.6767 1.50697 9.41633 1.29797 8.02299 1.29797C6.98433 1.29797 6.09133 1.47531 5.34399 1.82997C4.60933 2.17197 4.05199 2.64064 3.67199 3.23597C3.29199 3.81864 3.10199 4.47097 3.10199 5.19297C3.10199 6.01631 3.32999 6.67497 3.78599 7.16897C3.89409 7.28608 4.00717 7.39642 4.12523 7.5H2.75C2.33579 7.5 2 7.83579 2 8.25C2 8.66421 2.33579 9 2.75 9H7.71799C7.78088 9.01661 7.84455 9.03327 7.90899 9.04997C8.68166 9.25264 9.27699 9.42997 9.69499 9.58197C10.113 9.72131 10.4613 9.91764 10.74 10.171C11.0313 10.4243 11.177 10.741 11.177 11.121C11.177 12.5776 10.0687 13.306 7.85199 13.306C6.52199 13.306 5.27433 13.0463 4.10899 12.527C3.99499 12.4763 3.87466 12.451 3.74799 12.451C3.51999 12.451 3.32999 12.5333 3.17799 12.698C3.03866 12.85 2.96899 13.0336 2.96899 13.249C2.96899 13.4136 3.01966 13.572 3.12099 13.724C3.22233 13.8633 3.34899 13.9646 3.50099 14.028Z" fill={ colors[0] }/>

  </>,
  name: 'strikethrough_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.50099 14.028C4.90699 14.636 6.41433 14.94 8.02299 14.94C8.98566 14.94 9.83433 14.7816 10.569 14.465C11.3037 14.1483 11.8737 13.7113 12.279 13.154C12.6843 12.584 12.887 11.9443 12.887 11.235C12.887 10.3736 12.6653 9.68964 12.222 9.18297C12.1684 9.11992 12.1133 9.05893 12.0568 9H13.25C13.6642 9 14 8.66421 14 8.25C14 7.83579 13.6642 7.5 13.25 7.5H8.86843C8.66593 7.44666 8.45379 7.39332 8.23199 7.33997C7.45933 7.16264 6.84499 6.99797 6.38899 6.84597C5.94566 6.68131 5.57199 6.45964 5.26799 6.18097C4.97666 5.88964 4.83099 5.51597 4.83099 5.05997C4.83099 4.37597 5.14133 3.84397 5.76199 3.46397C6.39533 3.08397 7.21233 2.89397 8.21299 2.89397C9.26433 2.89397 10.284 3.06497 11.272 3.40697C11.3987 3.45764 11.5 3.48297 11.576 3.48297C11.804 3.48297 11.9877 3.40064 12.127 3.23597C12.2663 3.07131 12.336 2.88764 12.336 2.68497C12.336 2.30497 12.1587 2.05164 11.804 1.92497C10.6767 1.50697 9.41633 1.29797 8.02299 1.29797C6.98433 1.29797 6.09133 1.47531 5.34399 1.82997C4.60933 2.17197 4.05199 2.64064 3.67199 3.23597C3.29199 3.81864 3.10199 4.47097 3.10199 5.19297C3.10199 6.01631 3.32999 6.67497 3.78599 7.16897C3.89409 7.28608 4.00717 7.39642 4.12523 7.5H2.75C2.33579 7.5 2 7.83579 2 8.25C2 8.66421 2.33579 9 2.75 9H7.71799C7.78088 9.01661 7.84455 9.03327 7.90899 9.04997C8.68166 9.25264 9.27699 9.42997 9.69499 9.58197C10.113 9.72131 10.4613 9.91764 10.74 10.171C11.0313 10.4243 11.177 10.741 11.177 11.121C11.177 12.5776 10.0687 13.306 7.85199 13.306C6.52199 13.306 5.27433 13.0463 4.10899 12.527C3.99499 12.4763 3.87466 12.451 3.74799 12.451C3.51999 12.451 3.32999 12.5333 3.17799 12.698C3.03866 12.85 2.96899 13.0336 2.96899 13.249C2.96899 13.4136 3.01966 13.572 3.12099 13.724C3.22233 13.8633 3.34899 13.9646 3.50099 14.028Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
