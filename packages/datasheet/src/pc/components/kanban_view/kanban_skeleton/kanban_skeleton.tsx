import { useThemeColors, Skeleton } from '@vikadata/components';
import styles from './styles.module.less';

export const KanbanSkeleton = () => {
  const colors = useThemeColors();

  const list = [
    { rows: 4, color: colors.blackBlue[400] },
    { rows: 2, color: colors.deepPurple[100] },
    { rows: 3, color: colors.indigo[100] },
    { rows: 1, color: colors.blue[100] },
  ];

  return (
    <div className={styles.container}>
      {
        list.map((v) => {
          return (
            <div className={styles.board}>
              <div
                className={styles.colorLine}
                style={{ background: v.color }}
              />
              <Skeleton disabledAnimation className={styles.tag} style={{ background: v.color }} />
              <Skeleton
                count={v.rows}
                height="132px"
                className={styles.card}
                disabledAnimation
              />
            </div>
          );
        })
      }
    </div>
  );
};