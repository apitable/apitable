import styled from 'styled-components';
import { FilterInputWrap } from '../styled';

export const FilterDateWrap = styled.div`
  display: flex;
  margin-right: 8px;
`;

export const DateEditorWrap = styled(FilterInputWrap)`
  margin: 0 8px;
  flex: 1;
  background: var(--lowestBg);
  .ant-picker {
    width: 100%;
    background: var(--lowestBg);
    border: none;
    input {
      color: var(--firstLevelText);
    }
  }
  .ant-picker-range {
    border: none !important;
    .ant-picker-separator {
      color: var(--firstLevelText);
    }
  }
`;
