import { Drawer as AntdDrawer } from 'antd';
import type { DrawerProps } from 'antd';

interface IDrawerProps extends DrawerProps {
  test?: string;
}

export const Drawer: React.FC<React.PropsWithChildren<IDrawerProps>> = ({ children, ...restPoops }) => {
  return <AntdDrawer {...restPoops}>{children}</AntdDrawer>;
};
