import styled, { css } from 'styled-components';

export const FilterInputWrap = styled.div<{ pointer?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  height: 40px;
  background: var(--lowestBg);
  
  ${(props) => 
    css`
        cursor: ${props.pointer ? 'pointer' : 'default'};
      `
}
  .widgetFilterTextInput {
    background: var(--lowestBg);
  }
`;

export const SelectPopupContainer = styled.div`
  background: var(--highestBg);
  border-radius: 4px;
  box-shadow: var(--shadowCommonHighest);
  max-height: 300px; 
  overflow-y: auto;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

export const OptionItemWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 32px;
  line-height: 32px;

  @media (any-hover: hover) {
    &:hover {
      background: var(--rowSelectedBg);
    } 
  }
`;
