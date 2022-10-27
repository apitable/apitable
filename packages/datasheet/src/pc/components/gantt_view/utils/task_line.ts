import { IGroupLinearRow, IAdjacency } from '../interface';
import { CellType, fastCloneDeep } from '@apitable/core';
import { slice } from 'lodash';

/*
* nodes: task recordId List
*/
export const getAllCycleDAG = (nodes: string[], sourceAdj) => {
  const pre: { [key: string]: string } = {};
  const color: { [key: string]: number | null } = {};
  
  const cycles : string[][] = [];
 
  // 记录起来 在访问情况为1的时候直接判断有环存起来，因为1是在找查找的链条上
  // 如果有是1证明跑回来了
  const buildCycle = (start: string, end: string) => {
    const cycle : string[] = [start];
    for(let cur = end; cur !== start; cur = pre[cur]) {
      cycle.push(cur);
    }
    cycle.push(start);
    cycles.push(cycle.reverse());
  };

  const dfs = (source: string) => {
    if(!sourceAdj[source]) {
      return;
    }
    // 首先将节点的访问情况设置为1
    color[source] = 1;
    // 遍历节点的字节点
    sourceAdj[source].forEach((target: string) => {
      // 如果节点的访问情况为null，记录该节点的父节点，并且递归访问
      // 如果节点的访问情况为1，有环记录起来
      // 节访问情况为2，则是完全访问过
      if (color[target] == null) {
        pre[target] = source;
        dfs(target);
      } else if (color[target] === 1) {
        buildCycle(target, source);
      }
    });
    color[source] = 2;
  };

  // 根据顶点访问情况(color)使用DFS遍历
  nodes.forEach(node => {
    if (color[node] == null) {
      dfs(node);
    }
  });

  const cycleEdges : string[] = [];
  cycles.forEach(element => {
    for(let i = 1; i < element.length; i++) {
      const taskLineName = getTaskLineName(element[i-1], element[i]);
      cycleEdges.push(taskLineName);
    }
  });
 
  return cycleEdges;
};

export const detectCyclesStack = (nodes: string[], sourceAdj) => {
  const color: { [key: string]: number | null } = {}; // 记录是不是被访问过
  const cycleStack: string[] = []; // 人工访问栈
  const stackAdj: string[][] = []; // 记录当前栈接下来需要访问的参数
  const cycles : string[][] = []; // 记录找到的环
  const findCycle = (node: string) => {
    cycleStack.push(node);
    const nodeAdj = sourceAdj[node] ? sourceAdj[node] : [];
    stackAdj.push(fastCloneDeep(nodeAdj));

    while(cycleStack.length > 0) {
      const source = cycleStack[cycleStack.length - 1];
      const targets = stackAdj[stackAdj.length - 1] ? stackAdj[stackAdj.length - 1] : [];

      if(targets && targets.length > 0) {
        color[source] = 1;
        const target = targets[0];
        if(color[target] === 1) {
    
          const start = cycleStack.indexOf(target);
          const cycle = slice(cycleStack, start);
          cycle.push(target);
          cycles.push(cycle);
          const lastAdj = stackAdj[stackAdj.length - 1];
          const index = lastAdj.indexOf(target);
          stackAdj[stackAdj.length - 1].splice(index,1);

        } else if(color[target] === undefined) {
          cycleStack.push(target);
          const nextAdj = sourceAdj[target] ? sourceAdj[target] : [];
          stackAdj.push(fastCloneDeep(nextAdj));
        } else if(color[target] === 2) {
          const lastAdj = stackAdj[stackAdj.length - 1];
          const index = lastAdj.indexOf(target);
          stackAdj[stackAdj.length - 1].splice(index,1);
        }
     
      } else {
        color[source] = 2;
        cycleStack.pop();
        stackAdj.pop();
        if(stackAdj.length > 0) {
          const lastAdj = stackAdj[stackAdj.length - 1];
          const index = lastAdj.indexOf(source);
          stackAdj[stackAdj.length - 1].splice(index,1);
        }
      }

    }
  };

  nodes.forEach((node: string) => {
    
    if(color[node] === undefined) {
      findCycle(node);
    }
  });
  const cycleEdges : string[] = [];
 
  cycles.forEach(element => {
    for(let i = 1; i < element.length; i++) {
      const taskLineName = getTaskLineName(element[i-1], element[i]);
      cycleEdges.push(taskLineName);
    }
  });
 
  return cycleEdges;
};

export const getAllTaskLine = (taskListJson) => {

  const taskLineList : string[][] = [];
  
  Object.keys(taskListJson).forEach(taskLine => {
    taskListJson[taskLine].forEach(element => {
      taskLineList.push([element, taskLine]);
    });
  });

  // source adjacency list
  const sourceAdj : IAdjacency = {}; 
  taskLineList.forEach(edge => {
    const [source, target] = edge;
    if(sourceAdj[source] == null) {
      sourceAdj[source] = [];
    }
    sourceAdj[source].push(target);
  });

  return { 
    taskLineList,
    sourceAdj
  };
};

export const getTaskLineName = (sourceId: string, targetId: string) => {
  return `taskLine-${sourceId}-${targetId}`;
};

export const getCollapsedLinearRows = (ganttLinearRows: IGroupLinearRow[], groupCollapseIds) => {
  const groupingCollapseSet = new Set<string>(groupCollapseIds);
  let collapsedLinearRows;
  if(!groupCollapseIds) {
    collapsedLinearRows = ganttLinearRows;
  } else {
    const res = ganttLinearRows.reduce<{collapsedLinearRows: IGroupLinearRow[], skip: boolean, depth: number, recordId: string}>
    ((ctx, ganttLinearRow: IGroupLinearRow) => {
      if(ctx.skip) {
      // 遇到与跳过的分组同等级的 black，说明分组已结束
        if (ganttLinearRow.type === CellType.Blank && 
        ganttLinearRow.depth === ctx.depth) {
        // 重置折叠状态
          ctx.depth = Infinity;
          ctx.skip = false;
          ctx.recordId = ganttLinearRow.recordId;
          ctx.collapsedLinearRows.push(ganttLinearRow);

          return ctx;
        } 
        ganttLinearRow.groupHeadRecordId = ctx.recordId;
        ganttLinearRow.groupDepth = ctx.depth;
        ctx.collapsedLinearRows.push(ganttLinearRow);

        return ctx;
      
      }

      if(ganttLinearRow.type === CellType.GroupTab && 
      groupingCollapseSet.has(ganttLinearRow.recordId + '_' + ganttLinearRow.depth)) {
        ctx.skip = true;
        ctx.depth = ganttLinearRow.depth;
        ctx.recordId = ganttLinearRow.recordId;
      }
      ctx.collapsedLinearRows.push(ganttLinearRow);

      return ctx;

    }, { collapsedLinearRows: [], skip: false, depth: Infinity, recordId: '' });
    collapsedLinearRows = res.collapsedLinearRows;
  }
  const linerMap = new Map();

  collapsedLinearRows.forEach(item => {
    if(item.type === CellType.Record) {
      linerMap.set(item.recordId, item);
    }
  });

  return linerMap;
};