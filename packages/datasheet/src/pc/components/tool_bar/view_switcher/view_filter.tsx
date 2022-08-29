import { FC } from 'react';
import { IViewProperty, t, Strings } from '@vikadata/core';
import { ViewItem } from './view_item';
import styles from './style.module.less';

interface IViewFilterProps {
  viewsList: IViewProperty[];
  [key: string]: any;
}

export const ViewFilter: FC<IViewFilterProps> = props => {
  const { viewsList, ...rest } = props;

  return (
    <>
      {
        viewsList.length > 0 &&
        <div className={styles.viewList}>
          {
            viewsList.map((view, index) => (
              <div
                className={styles.viewItem}
                key={view.id}
              >
                <ViewItem
                  currentViewId={view.id}
                  currentViewName={view.name}
                  currentViewIndex={index}
                  viewType={view.type}
                  {...rest as any}
                />
              </div>
            ))
          }
        </div>
      }
      {
        !viewsList.length &&
        <div className={styles.viewListEmpty}>
          {t(Strings.no_view_find)}
        </div>
      }
    </>
  );
};