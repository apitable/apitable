import { useThemeColors } from '@vikadata/components';
import { FlowContext } from 'pc/components/org_chart_view/context/flow_context';
import { FC, useContext } from 'react';
import styles from '../styles.module.less';
import classNames from 'classnames';

interface IBottomProps {
  id: string;
  linkIds: string[];
}

export const Bottom: FC<IBottomProps> = ({
  id,
  linkIds,
}) => {
  const colors = useThemeColors();
  const {
    setNodeStateMap,
    horizontal,
  } = useContext(FlowContext);

  return (
    <div 
      className={classNames(styles.collapse, {
        [styles.horizontal]: horizontal,
      })}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.25 8C14.25 11.4518 11.4518 14.25 8 14.25C4.54822 14.25 1.75 
                11.4518 1.75 8C1.75 4.54822 4.54822 1.75 8 1.75C11.4518 1.75 14.25 4.54822 14.25 8Z"
          fill={colors.defaultBg}
          stroke={colors.primaryColor}
          strokeWidth="1.5"
        />
        <text
          x={8}
          y={12}
          textAnchor="middle"
          fill={colors.primaryColor}
          fontSize={12}
          fontWeight='bold'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setNodeStateMap((prevState) => {
              const nextState = { ...prevState };
              delete nextState[id];
              return nextState;
            });
          }}
        >
          {linkIds.length}
        </text>
      </svg>
    </div >
  );
};
