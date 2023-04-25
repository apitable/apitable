/* eslint-disable max-len */
import styled from 'styled-components';

export const GroupWrapperWithButton = styled.div`
  overflow: auto;
`;

export const FilterGroupWrap = styled.div`
  display: grid;
  grid-template-columns: [boolean-start] 80px [boolean-end property-start] 120px [property-end opererator-start] 110px [operator-end value-start] auto [value-end menu-start] 32px [menu-end];
  grid-auto-rows: minmax(32px, auto);
  gap: 16px 8px;
  place-items: start stretch;
  align-items: center;
`;

export const FilterButtonWrap = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 16px;
`;

export const SubGroupWrap = styled.div`
  grid-column: property-start / value-end;
  border-radius: 3px;
  box-shadow: rgb(55 53 47 / 10%) 0px 0px 0px 1px;
  margin: 1px;
  align-self: stretch;
`;

export const OperatorWrap = styled.div`
  padding-left: 8px;
  height: 40px;
  line-height: 40px;
  background: var(--lowestBg);
  border-radius: 4px;
  text-align: left;
`;
