import { useCallback, useState } from 'react';

// 获取 dom 节点的 下边界中点的绝对位置
const getBottomCenter = (dom: HTMLElement) => {
  const rect = dom.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.bottom
  };
};

// 获取 dom 节点的 上边界中点的绝对位置
const getTopCenter = (dom: HTMLElement) => {
  const rect = dom.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top
  };
};

const getRobotNodeElementById = (id: string) => {
  return document.getElementById(`robot_node_${id}`);
};

// 将列表转化为前后两个节点相连的 二维数组
const nodeListToArray = (nodeList: string[]) => {
  const result: string[][] = [];
  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i];
    if (i + 1 < nodeList.length) {
      result.push([node, nodeList[i + 1]]);
    }
  }
  return result;
};

export const useNodeLine = (nodeList: string[]) => {
  const [lines, setLines] = useState<{
    start: { x: number, y: number }
    end: { x: number, y: number }
  }[]>([]);

  // const requestRef = useRef<any>();

  const updateLines = useCallback(() => {
    const lines = nodeListToArray(nodeList).map(([prev, next]) => {
      const prevDom = getRobotNodeElementById(prev);
      const nextDom = getRobotNodeElementById(next);
      // console.log(prev, next, prevDom, nextDom);
      const prevCenter = prevDom ? getBottomCenter(prevDom) : { x: 0, y: 0 };
      const nextCenter = nextDom ? getTopCenter(nextDom) : { x: 0, y: 0 };
      return {
        start: prevCenter,
        end: nextCenter
      };
    });
    setLines(lines);
  }, [nodeList]);

  updateLines();
  // const animate = time => {
  //   updateLines();
  //   // The 'state' will always be the initial value here
  //   requestRef.current = requestAnimationFrame(animate);
  // };

  // useEffect(() => {
  //   requestRef.current = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(requestRef.current);
  // }, []); // Make sure the effect runs only once

  return lines;
};
/**
 * 将 node 连起来
 * @param nodeList [triggerId,actionId1,actionId2]
 */

export const NodeConnectionLine = (props: {
  nodeList: string[]
}) => {
  const { nodeList } = props;
  // console.log(nodeList);
  // const lines = useNodeLine(nodeList);
  const lines = nodeListToArray(nodeList).map(([prev, next]) => {
    const prevDom = getRobotNodeElementById(prev);
    const nextDom = getRobotNodeElementById(next);
    // console.log(prev, next, prevDom, nextDom);
    const prevCenter = prevDom ? getBottomCenter(prevDom) : { x: 0, y: 0 };
    const nextCenter = nextDom ? getTopCenter(nextDom) : { x: 0, y: 0 };
    return {
      start: prevCenter,
      end: nextCenter
    };
  });
  // console.log('lines', lines);
  return (
    <>
      {
        lines.map((line, index) => {
          const style = {
            position: 'absolute',
            pointerEvents: 'none',
            left: `${line.start.x}px`,
            top: `${line.start.y}px`,
            height: `${line.end.y - line.start.y}px`,
            backgroundColor: 'red',
          };
          // console.log('line style', style);
          return <div
            key={`robot_node_line_${index}`}
            style={style as any}
          />;
        })
      }
    </>
  );
};