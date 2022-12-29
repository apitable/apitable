import cx from 'classnames';
import styles from './style.module.less';
import { IElement, IElementRenderProps } from '../../interface/element';
import Decorate from '../element_decorate';

export type THeadingDepth = 1 | 2 | 3 | 4 | 5 | 6;

const headingMap = ['', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export interface IHeadingProps extends IElementRenderProps<IElement> {
  depth: THeadingDepth
}

const Heading = ({ depth, children, data, ...others }: IHeadingProps) => {
  const Tag: any = headingMap[depth] || 'h1';
  return <Decorate {...others} className={cx(styles.heading, styles[`heading${depth}`])}>
    <Tag>
      {children}
    </Tag>
  </Decorate>;
};

export default Heading;