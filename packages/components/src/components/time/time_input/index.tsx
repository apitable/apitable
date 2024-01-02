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

import React, { FC, memo, useMemo, useState } from 'react';
import { ListDropdown } from '../../select/dropdown/list_dropdown';
import { stopPropagation } from '../../../helper';
import { OptionItem, StyledListContainer } from '../../select';
import { ListDeprecate } from '../../list_deprecate';
import styled, { css } from 'styled-components';
import { CronConverter } from '../utils';
import { applyDefaultTheme } from '../../../theme';

export const getDefaultHourArray = () => {
  const CONST_DEFAULT_HOUR_ARRAY = [
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
  ];
  return CONST_DEFAULT_HOUR_ARRAY;
};

const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const StyledSelectTrigger = styled.div.attrs(applyDefaultTheme)<{ disabled: boolean; focus: boolean }>`
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  height: 40px;
  position: relative;
  user-select: none;
  outline: none;
  transition: all 0.3s;
  
  color: ${(props) => props.theme.color.textCommonPrimary};

  ${(props) => {
    const { fc5 } = props.theme.color;
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        color: ${props.theme.color.textCommonDisabled}
      `;
    }
    return (
      !props.disabled &&
      css`
        &:hover {
          border-color: ${fc5};
        }
      `
    );
  }};

  ${(props) => {
    return css`
      background-color: ${props.theme.color.bgControlsDefault};
    `;
  }};

  ${(props) => {
    const { borderBrandDefault } = props.theme.color;
    if (props.focus) {
      return css`
        border-color: ${borderBrandDefault} !important;
      `;
    }

    return (
      !props.disabled &&
      css`
        &:focus-within {
          border-color: ${borderBrandDefault} !important;
        }
      `
    );
  }}
`;

const StyledInput = styled.input.attrs(applyDefaultTheme)<{ disabled: boolean }>`
  cursor: pointer;
  border-radius: 4px;
  padding: 0 8px 0 8px;
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  user-select: none;
  outline: none;
  transition: all 0.3s;
  width: 64px;
  border: none;

  ${(props) => {
    return css`
      background-color: ${props.theme.color.fc6};
    `;
  }};

  ${(props) =>
    props.disabled &&
    `
    user-select: none;
    outline: none;
    cursor: not-allowed;
    border: none;
  `}
`;

const TimeInputComp: FC<{
  time: string;
  readonly?: boolean;
  onChange?: (value: string) => void;
}> = ({ time, onChange, readonly = false }) => {
  const [input, setInput] = useState<string>(time || '00:00');

  const CONST_DEFAULT_HOUR_ARRAY = useMemo(() => getDefaultHourArray(), []);
  return (
    <ListDropdown
      options={{
        arrow: false,
        offset: 4,
        zIndex: 1200,
        disabled: readonly,
        autoWidth: true,
      }}
      trigger={
        <StyledSelectTrigger disabled={readonly} focus={false}>
          <StyledInput
            value={input}
            disabled={readonly}
            onBlur={(e) => {
              if (readonly) {
                return;
              }
              const input = e.target.value;
              if (!regex.test(input)) {
                const inputText = CronConverter.getHourTime(time ?? '');
                onChange?.(inputText);
                setInput(inputText);
              }
              // const inputText = CronConverter.getHourTime(time ?? '');
              // setInput(inputText);
              // }
            }}
            onChange={(e) => {
              if (readonly) {
                return;
              }
              const input = e.target.value;
              if (regex.test(input)) {
                onChange?.(e.target.value);
              }
              setInput(e.target.value);
            }}
          />
        </StyledSelectTrigger>
      }
    >
      {({ toggle }) => (
        <StyledListContainer width={'min-content'} onClick={stopPropagation}>
          <ListDeprecate
            onClick={(_e, index) => {
              toggle();
              const item = CONST_DEFAULT_HOUR_ARRAY[index];
              if (item) {
                setInput(item);
                onChange?.(item);
              }
            }}
          >
            {CONST_DEFAULT_HOUR_ARRAY.map((item, index) => (
              <OptionItem
                keyword={''}
                currentIndex={index}
                onClick={() => {
                  setInput(item);
                  onChange?.(item);
                  toggle();
                }}
                value={null}
                item={{
                  value: item,
                  label: item,
                }}
              />
            ))}
          </ListDeprecate>
        </StyledListContainer>
      )}
    </ListDropdown>
  );
};

export const TimeInput = memo(TimeInputComp);
