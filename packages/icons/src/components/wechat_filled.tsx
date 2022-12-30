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

export const WechatFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.49908 17.9998C3.70773 17.8306 4.9346 16.9935 5.24435 16.6088C6.71113 17.0397 8.05643 17.1843 9.26811 17.1074C9.00813 16.5079 9.01466 15.7628 9.02047 15.0998C9.02131 15.0038 9.02213 14.9096 9.02213 14.8177C9.02213 10.9647 12.7331 7.67796 16.9178 7.91493C16.9846 7.918 17.0454 7.92724 17.1 7.9457C16.3378 4.55739 12.8607 2 8.68201 2C3.94156 2 0.100006 5.28983 0.100006 9.34596C0.100006 12.8174 1.82187 14.51 3.60448 15.4486C3.37193 16.4236 3.06235 16.9754 2.7747 17.4881C2.67921 17.6583 2.58612 17.8242 2.49908 17.9998ZM3.85001 7.03905C3.85001 6.34769 4.40864 5.78906 5.10001 5.78906C5.78861 5.78906 6.35001 6.34769 6.35001 7.03905C6.35001 7.72765 5.79138 8.28904 5.10001 8.28904C4.40864 8.28904 3.85001 7.73042 3.85001 7.03905ZM10.35 8.50046C11.0414 8.50046 11.6 7.93908 11.6 7.25048C11.6 6.55911 11.0414 6.00049 10.35 6.00049C9.65864 6.00049 9.10001 6.55911 9.10001 7.25048C9.10001 7.94184 9.65864 8.50046 10.35 8.50046ZM21.5647 21.9999C21.2846 21.463 20.8335 20.3008 20.8983 19.9999C22.2635 19.3745 23.8971 17.7728 23.9 14.9586C23.9 11.6666 20.7656 9 16.9 9C13.0344 9 9.89999 11.7817 9.89999 15.292C9.89999 18.7934 13.4029 22.2536 19.5655 20.9999C20.2703 21.6075 21.0693 21.8878 21.5647 21.9999ZM17.4 13.3359C17.4 12.7814 17.8454 12.3359 18.4 12.3359C18.9546 12.3359 19.4 12.7814 19.4 13.3359C19.4 13.8905 18.9546 14.3359 18.4 14.3359C17.8454 14.3359 17.4 13.8905 17.4 13.3359ZM14.4 12.3242C13.8454 12.3242 13.4 12.7696 13.4 13.3242C13.4 13.8788 13.8454 14.3242 14.4 14.3242C14.9546 14.3242 15.4 13.8788 15.4 13.3242C15.4 12.7696 14.9516 12.3242 14.4 12.3242Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'wechat_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2.49908 17.9998C3.70773 17.8306 4.9346 16.9935 5.24435 16.6088C6.71113 17.0397 8.05643 17.1843 9.26811 17.1074C9.00813 16.5079 9.01466 15.7628 9.02047 15.0998C9.02131 15.0038 9.02213 14.9096 9.02213 14.8177C9.02213 10.9647 12.7331 7.67796 16.9178 7.91493C16.9846 7.918 17.0454 7.92724 17.1 7.9457C16.3378 4.55739 12.8607 2 8.68201 2C3.94156 2 0.100006 5.28983 0.100006 9.34596C0.100006 12.8174 1.82187 14.51 3.60448 15.4486C3.37193 16.4236 3.06235 16.9754 2.7747 17.4881C2.67921 17.6583 2.58612 17.8242 2.49908 17.9998ZM3.85001 7.03905C3.85001 6.34769 4.40864 5.78906 5.10001 5.78906C5.78861 5.78906 6.35001 6.34769 6.35001 7.03905C6.35001 7.72765 5.79138 8.28904 5.10001 8.28904C4.40864 8.28904 3.85001 7.73042 3.85001 7.03905ZM10.35 8.50046C11.0414 8.50046 11.6 7.93908 11.6 7.25048C11.6 6.55911 11.0414 6.00049 10.35 6.00049C9.65864 6.00049 9.10001 6.55911 9.10001 7.25048C9.10001 7.94184 9.65864 8.50046 10.35 8.50046ZM21.5647 21.9999C21.2846 21.463 20.8335 20.3008 20.8983 19.9999C22.2635 19.3745 23.8971 17.7728 23.9 14.9586C23.9 11.6666 20.7656 9 16.9 9C13.0344 9 9.89999 11.7817 9.89999 15.292C9.89999 18.7934 13.4029 22.2536 19.5655 20.9999C20.2703 21.6075 21.0693 21.8878 21.5647 21.9999ZM17.4 13.3359C17.4 12.7814 17.8454 12.3359 18.4 12.3359C18.9546 12.3359 19.4 12.7814 19.4 13.3359C19.4 13.8905 18.9546 14.3359 18.4 14.3359C17.8454 14.3359 17.4 13.8905 17.4 13.3359ZM14.4 12.3242C13.8454 12.3242 13.4 12.7696 13.4 13.3242C13.4 13.8788 13.8454 14.3242 14.4 14.3242C14.9546 14.3242 15.4 13.8788 15.4 13.3242C15.4 12.7696 14.9516 12.3242 14.4 12.3242Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
