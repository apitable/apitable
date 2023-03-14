import { Strings, t, ConfigConstant } from '@apitable/core';
import classNames from 'classnames';
import { nodeConfigData } from 'pc/utils';
import styles from './style.module.less';

export enum TabNodeType {
  ALL_TYPE = -1,
  DASHBOARD = ConfigConstant.NodeType.DASHBOARD,
  DATASHEET = ConfigConstant.NodeType.DATASHEET,
  FOLDER = ConfigConstant.NodeType.FOLDER,
  FORM = ConfigConstant.NodeType.FORM,
  MIRROR = ConfigConstant.NodeType.MIRROR,
}

export const nodeTypeList = [
  {
    name: t(Strings.all),
    type: TabNodeType.ALL_TYPE
  },
  ...nodeConfigData.map(({ name, type }) => ({ name, type }))
];

interface ITypeTab {
  nodeType?: TabNodeType,
  onChange?: (type: TabNodeType) => void;
}

export const TypeTab: React.FC<ITypeTab> = (props) => {

  const { nodeType = TabNodeType.ALL_TYPE } = props;

  return (
    <div className={styles.tabWrapper}>
      {
        nodeTypeList.map(({ name, type }) => {
          return (
            <div
              className={classNames(styles.typeTabItem, { [styles.typeTabItemActive]: nodeType === type })}
              key={type}
              onClick={() => {
                props.onChange?.(type as TabNodeType);
              }}
            >
              {name}
            </div>
          );
        })
      }
    </div>
  );
};
