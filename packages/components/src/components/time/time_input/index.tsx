import React, { FC, useRef, useState } from 'react';
import { ListDropdown } from '../../select/dropdown/list_dropdown';
import { stopPropagation } from '../../../helper';
import { OptionItem, StyledListContainer } from '../../select';

export const CONST_DEFAULT_HOUR_ARRAY = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const TimeInput: FC<{
    time?: string
    onChange?: (value: string) => void;
}> = ({ time, onChange }) => {

  const [input, setInput] = useState<string>(time || '');

  return (
    <>
      <ListDropdown
        options={{
          arrow: false,
          offset: 4,
          zIndex: 1200,
          autoWidth: true,
        }}
        trigger={
          <span>
            <input value={input} onChange={(e) => {
              const input = e.target.value;
              if(regex.test(input)) {
                onChange?.(e.target.value);
              }
              setInput(e.target.value);
            }} />
          </span>
        }
      >
        {
          ({ toggle })=> (
            <StyledListContainer
              onClick={stopPropagation}
              // className={listCls}
              style={{
                height: '200px',
                overflow: 'auto',
              }}
            >
              {
                CONST_DEFAULT_HOUR_ARRAY.map((item, index) => (
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
                      label: item
                    }} />
                ))
              }

            </StyledListContainer>
          )
        }
      </ListDropdown>
    </>
  );
};
