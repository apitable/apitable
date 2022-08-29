import styled from 'styled-components';

export const ButtonGroupBase = styled.div`
  display: inline-flex;
  border-radius: 4px;
  &.border {
    border: 1px solid #ccc;
  }
  &.separate {
    & > button,
    & > div {
      border-radius: 4px;
      position: relative;
      &:not(:first-of-type):before {
        content: " ";
        display: block;
        width: 1px;
        height: 12px;
        position: absolute;
        top: 50%;
        left: -1px;
        background: #e6e6e6;
        z-index: 3;
        transform: translateY(-50%);
        opacity: 1!important;
      }
    }
  }
  & > button,
  & > div {
    border-radius: 4px;
    &:not(:last-of-type) {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-right-color: transparent;
    }
    &:not(:first-of-type) {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      margin-left: -1px;
    }
  }
`;