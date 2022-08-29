import styled, { css } from 'styled-components';
import { InformationSmallOutlined } from '@vikadata/icons';
import { ChevronDownOutlined } from '@vikadata/icons';
import { Tooltip } from '@vikadata/components';

const h = styled.div<{ hasCollapse?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  ${(props) => {
    if (props.hasCollapse) {
      return css`
        cursor: pointer;
      `;
    }
    return;
  }}
`;

const h1 = styled(h)`
  font-size: 16px;
`;
const h2 = styled(h)`
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  &:before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: rgba(201,201,201,1);
    margin-right: 8px;
    border-radius: 6px;
  }
`;
const h3 = styled(h)`
  font-size: 12px;
  padding-bottom: 8px;
  color: #8C8C8C;
`;

export const titleLevel = [h1, h2, h3];

export const SuffixIcon = styled.span <{ isIconRotate: boolean }>`
  transition: transform 0.3s;
  cursor: pointer;
  position: absolute;
  right: 4px;
  ${props => props.isIconRotate && css` transform: rotate(180deg);`}
`;

export const DropIcon = styled(ChevronDownOutlined)`
  vertical-align: middle;
`;

const HelpIcon = styled(InformationSmallOutlined)`
  vertical-align: -0.125em;
`;
export interface IHelp {
  text: string;
  url: string
}

//  TODO: 这里差 tooltips 组件，悬浮在 icon 上应该显示 helpText
export const HelpIconButton = ({ help }: { help: IHelp }) => {
  if (!help) return null;
  return (
    <Tooltip content={help.text}>
      <a
        href={help.url}
        rel="noopener noreferrer"
        style={{ marginLeft: 4 }}
        target='_blank'>
        <HelpIcon color="#8c8c8c" />
      </a>
    </Tooltip>
  );
};