import styled, { css } from 'styled-components';
import { CellValue as CellValueComponent } from 'pc/components/multi_grid/cell/cell_value';

export const SearchContentWrapper = styled.div`
  height: 486px;
  position: relative;
  padding-top: 8px;
  overflow: hidden;
`;

export const SearchEmpty = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SearchEmptyText = styled.div`
  text-align: center;
  color: var(--thirdLevelText);
  font-size: 13px;
  margin-top: 16px;
  margin-bottom: 32px;
`;

export const RecordListWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  > div > div {
    overflow-y: scroll !important;

    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    &::-webkit-scrollbar-button {
      display: none;
      height: 0;
      width: 0;
    }

    &::-webkit-scrollbar-thumb {
      background-color: transparent;
      background-clip: padding-box;
      border: 3px solid rgba(0, 0, 0, 0);
      border-radius: 6px;
      min-height: 36px;
    }

    &:hover::-webkit-scrollbar-thumb {
      background-color: rgba(191, 193, 203, 0.5);
    }
  }
`;

export const RecordCardWrapper = styled.div<any>`
  margin: 1px 12px 7px 24px;
  overflow: hidden;
  position: relative;
  border-radius: 4px;

  ${(props) => {
    return props.isSelected && css`
      box-shadow: 0px 0px 0px 1px var(--primaryColor);

      &::before {
        content: " ";
        z-index: 1;
        width: 31px;
        height: 31px;
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-50%, -50%) rotate(45deg);
        background-color: var(--primaryColor);
      }

      &::after {
        content: " ";
        z-index: 1;
        left: 3px;
        top: 6px;
        width: 5px;
        height: 8px;
        position: absolute;
        display: table;
        border: 1px solid #fff;
        border-top: 0;
        border-left: 0;
        transform: rotate(45deg) scale(1) translate(-50%, -50%);
        opacity: 1;
        transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
      }
    `;
  }}
`;

export const RecordCardContainer = styled.div`
  position: relative;
`;

export const RecordCardStyled = styled.div`
  position: relative;
  display: flex;
  background-color: var(--fill0);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
`;

export const RecordCardRow = styled.div`
  flex: 1 1;
  width: calc(100% - 90px);
  height: 90px;
  border-radius: 2px;
  padding-left: 10px;
`;

export const RecordCardTitle = styled.h3<any>`
  margin-top: 10px;
  height: 18px;
  line-height: 18px;
  font-size: 13px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${(props) => {
    if (props.isEmpty) {
      return css`color: var(--fourthLevelText);`;
    }
    return css`color: var(--firstLevelText);`;
  }};
`;

export const CellRow = styled.div`
  display: flex;
  flex: 1 1;
`;

export const CardColumn = styled.div`
  flex: 1 1;
  width: 20%;
`;

export const CellTitle = styled.div`
  font-size: 11px;
  color: var(--thirdLevelText);
  line-height: 16px;
`;

export const CardCell = styled.div`
  height: 31px;
  display: flex;
  align-items: center;
`;

export const CellHolder = styled.div`
  border: solid 1px var(--fourthLevelText);
  height: 2px;
  width: 7px;
  border-radius: 2px;
`;

export const CellValue = styled(CellValueComponent)`
  padding-left: 0;
  padding-right: 0;
  margin-right: 8px;
  overflow: hidden;
  flex-wrap: nowrap;
`;

