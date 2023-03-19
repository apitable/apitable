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

import React from 'react';
import style, { css } from 'styled-components';
import { ISkeletonProps } from './interface';
import { applyDefaultTheme } from 'theme';

const SkeletonStyles = style.div.attrs(applyDefaultTheme)<ISkeletonProps>`
    position: relative;
    overflow: hidden;
    background-size: 200px 100%;
    background-repeat: no-repeat;
    border-radius: 4px;
    height: 16px;
    width: 100%;
    margin-top: 16px;
    ${(props) => {
    if (!props.disabledAnimation) {
      return css`
          &::after {
            position: absolute;
            top: 0;
            right: -150%;
            bottom: 0;
            left: -150%;
            background: linear-gradient(
              90deg,
              rgba(190,190,190,.2) 25%,
              rgba(129,129,129,.24) 37%,
              rgba(190,190,190,.2) 63%
              );
            animation: skeletonKeyframes 1.4s ease infinite;
            content: "";
          }
        `;
    }
    return '';
  }}
    
    &.react-image-skeleton {
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 48px;
        height: 48px;
        ${props => {
    const { fc3 } = props.theme.color;
    return css`
              fill: ${fc3}
            `;
  }}
      }
    }
    ${props => {
    const { fc11 } = props.theme.color;
    return css`
        background-color: ${fc11};
      `;
  }}

    @keyframes skeletonKeyframes {
      0% {
        transform: translateX(-37.5%);
      }
    
      100% {
        transform: translateX(37.5%);
      }
    }
`;

const path =
  // eslint-disable-next-line max-len
  'M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z';

export const Skeleton: React.FC<React.PropsWithChildren<ISkeletonProps>> = (props) => {
  const {
    count = 1,
    width,
    wrapper: Wrapper,
    height,
    circle,
    image,
    style: customStyle,
    className: customClassName,
    disabledAnimation = false,
  } = props;
  const elements:JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    const style:React.CSSProperties = {};

    if (width != null) {
      style.width = width;
    }

    if (height != null) {
      style.height = height;
    }

    if (circle) {
      style.borderRadius = '50%';
    }

    let className = image ? 'react-image-skeleton' : 'react-loading-skeleton';
    if (customClassName) {
      className += ' ' + customClassName;
    }

    elements.push(
      <SkeletonStyles
        key={i}
        className={className}
        style={{
          ...customStyle,
          ...style,
        }}
        disabledAnimation={disabledAnimation}
      >
        {image && <svg
          viewBox="0 0 1098 1024"
          xmlns="http://www.w3.org/2000/svg"
          className="image-svg-skeleton"
        >
          <path d={path} />
        </svg>}
      </SkeletonStyles>
    );
  }

  return (
    <>
      {Wrapper
        ? elements.map((element, i) => (
          <Wrapper key={i}>
            {element}
          </Wrapper>
        ))
        : elements}
    </>
  );
};
