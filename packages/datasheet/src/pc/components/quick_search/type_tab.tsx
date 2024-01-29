import classNames from 'classnames';
import { Strings, t, ConfigConstant } from '@apitable/core';
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
    type: TabNodeType.ALL_TYPE,
  },
  {
    name: t(Strings.datasheet),
    type: ConfigConstant.NodeType.DATASHEET,
  },
  {
    name: t(Strings.automation),
    type: ConfigConstant.NodeType.AUTOMATION,
  },
  {
    name: t(Strings.folder),
    type: ConfigConstant.NodeType.FOLDER,
  },
  {
    name: t(Strings.view_form),
    type: ConfigConstant.NodeType.FORM,
  },
  {
    name: t(Strings.mirror),
    type: ConfigConstant.NodeType.MIRROR,
  },
  {
    name: t(Strings.dashboard),
    type: ConfigConstant.NodeType.DASHBOARD,
  },
  {
    name: t(Strings.embed_page),
    type: ConfigConstant.NodeType.CUSTOM_PAGE,
  },
];

interface ITypeTab {
  nodeType?: TabNodeType;
  onChange?: (type: TabNodeType) => void;
}

export const TypeTab: React.FC<ITypeTab> = (props) => {
  const { nodeType = TabNodeType.ALL_TYPE } = props;

  return (
    <div className={styles.tabWrapper}>
      {nodeTypeList.map(({ name, type }) => {
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
      })}
    </div>
  );
};
