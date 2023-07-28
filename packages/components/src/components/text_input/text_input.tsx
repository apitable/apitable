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

import { ITextInputProps } from './text_input.interface';
import styled, { css } from 'styled-components';
import { applyDefaultTheme, ITheme } from 'theme';
import React, { useState } from 'react';
import Color from 'color';
import classnames from 'classnames';

const sizeHeightMap = {
  small: 32,
  middle: 40,
  large: 48,
};

type IInputWrapperProps = Pick<ITextInputProps, 'size' | 'block' | 'error' | 'lineStyle' | 'disabled'>;
const InputWrapper = styled.div.attrs(applyDefaultTheme) <IInputWrapperProps>`
  ${(props) => {
    const theme = props.theme as ITheme;
    const { color } = theme;
    const { block, size = 'middle', error, lineStyle, disabled } = props;
    const width = block ? '100%' : '240px';
    const height = sizeHeightMap[size];
    const borderColor = error ? color.errorColor : 'transparent';
    const commonCSS = css`
      background: ${lineStyle ? 'inherit' : color.fill0};
      color: ${color.fc1};
      height: ${height}px;
      width: ${width};
      border-radius: ${lineStyle ? '0' : '4px'};
    `;
    if (lineStyle) {
      return [
        ...commonCSS, ...css`
        border-bottom: 1px solid ${color.fc2};
        &:focus-within {
          border-bottom: 1px solid ${color.primaryColor};
      } 
      `];
    }
    const focusBorderColor = error ? color.errorColor : color.primaryColor;
    return [
      ...commonCSS, ...css`
      border: 1px solid ${borderColor};
      ${PrefixWrapper} svg,
      ${SuffixWrapper} svg {
        width: 16px;
        height: 16px;
        fill: ${props.theme.color.fc4};
      }
      ${!disabled && !error && css`
        &:hover {
          border-color: ${color.primaryColor};
          background-color: ${color.bgControlsElevateDefault};   
        }
      `}
      ${!disabled && css`
        &:hover {
          background-color: ${color.bgControlsElevateDefault};
        }
      `}
      :focus-within {
        border-color: ${focusBorderColor};
        background-color: ${color.bgControlsElevateDefault};
      }
      // Error status
      ${error && css`
        &.error {
          border-color: ${color.errorColor};

          ${PrefixWrapper} svg {
            fill: ${color.errorColor};
          }
        }
      `}
      &.focused {
        border-color: ${focusBorderColor};
        background-color: ${color.bgCommonHigh};

        ${PrefixWrapper} svg {
          fill: ${color.primaryColor};
        }
      }
      ${disabled && css`
        ${InputInner} {
          cursor: not-allowed;
          color: ${color.fc3};
          opacity: 1;
          -webkit-text-fill-color: ${color.fc3};
        }
        cursor: not-allowed;
      `}
    `];
  }}
  font-size: 14px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 8px;
`;

const InputInner = styled.input.attrs(applyDefaultTheme)`
  font: inherit;
  outline: none;
  color: currentColor;
  width: 100%;
  border: 0;
  height: 100%;
  padding: 10px 0;
  display: block;
  min-width: 0;
  caret-color: ${(props) => props.theme.color.primaryColor};
  background: none;
  box-sizing: border-box;
  letter-spacing: inherit;
  -webkit-tap-highlight-color: transparent;
  ::placeholder {
    font-size: 14px;
    color: ${(props) => props.theme.color.fc4};
  }
  ::selection {
    background-color: ${props => Color(props.theme.color.primaryColor).alpha(0.2).string()};
  }
`;

const PrefixWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 4px;
`;

const SuffixWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 4px;
`;

const InputInnerWrapper = styled.div`
  flex: 1;
`;

export const TextInput = React.forwardRef(({
  value, type = 'text', error = false, block, size,
  placeholder, lineStyle, prefix, suffix, disabled, className,
  addonAfter, addonBefore,
  onChange, onBlur, onFocus, wrapperRef, ...rest
}: ITextInputProps, ref: React.Ref<HTMLInputElement>) => {
  const [focus, setFocus] = useState(false);

  const handleFocus = (e: React.FocusEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    setFocus(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    setFocus(false);
    onBlur && onBlur(e);
  };

  return (
    <InputWrapper
      ref={wrapperRef}
      size={size}
      block={block}
      error={error}
      lineStyle={lineStyle}
      disabled={disabled}
      className={classnames(className, { error: error, focused: focus })}
    >
      {addonBefore}
      {prefix &&
        <PrefixWrapper>{prefix}</PrefixWrapper>
      }
      <InputInnerWrapper onFocus={handleFocus} onBlur={handleBlur}>
        <InputInner
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
      </InputInnerWrapper>
      {suffix &&
        <SuffixWrapper>{suffix}</SuffixWrapper>
      }
      {addonAfter}
    </InputWrapper>
  );
});
