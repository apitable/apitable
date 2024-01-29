/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useUpdateEffect, usePrevious } from 'ahooks';
import { FC, useContext, useRef } from 'react';
import * as React from 'react';
import { DropTargetMonitor } from 'react-dnd';
import ReactDOM from 'react-dom';
import { useContextMenu } from '@apitable/components';
import { ConfigConstant, Selectors } from '@apitable/core';
import ReactFlow, { Edge, OnLoadParams, useStoreState, useZoomPanHelper } from '@apitable/react-flow';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { KeyCode } from 'pc/utils';
import { isWindowsOS } from 'pc/utils/os';
import { AddFirstNode } from './components/add_first_node';
import { Controls } from './components/controls';
import { DragLayer, CustomEdge, BezierEdge, CustomNode } from './components/custom';
import { GhostNode } from './components/custom/custom_node/ghost_node';
import { GhostEdge } from './components/custom/ghost_edge';
import { DropWrapper } from './components/drop_wrapper';
import { Modal } from './components/modal';
import { addRecord } from './components/record_list';
import { ScrollBar } from './components/scroll_bar';
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, ORG_NODE_MENU, ORG_EDGE_MENU, DragNodeType, NodeType } from './constants';
import { FlowContext } from './context/flow_context';
import { IDragItem, NodeHandleState, ScrollBarType } from './interfaces';
// @ts-ignore
import { getWizardRunCount } from 'enterprise/guide/utils';
import styles from './styles.module.less';

export const OrgChart: FC<React.PropsWithChildren<unknown>> = () => {
  const {
    initialElements,
    unhandledNodes,
    handlingCount,
    datasheetId,
    setNodeStateMap,
    rowsCount,
    viewId,
    overGhostRef,
    quickAddRecId,
    setQuickAddRecId,
    horizontal,
  } = useContext(FlowContext);

  const { show: showNodeMenu } = useContextMenu({
    id: ORG_NODE_MENU,
  });

  const { show: showEdgeMenu } = useContextMenu({
    id: ORG_EDGE_MENU,
  });

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<OnLoadParams>();

  const { zoomIn, zoomOut, zoomTo, fitView, setCenter } = useZoomPanHelper();

  const nodes = useStoreState((state) => state.nodes);
  const [, , scale] = useStoreState((state) => state.transform);

  const searchRecordId = useAppSelector(Selectors.getCurrentSearchRecordId);

  const focusNode = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (node) {
      const x = node.__rf.position.x + node.__rf.width / 2;
      const y = node.__rf.position.y + node.__rf.height / 2;
      setCenter(x, y, scale);
    }
  };

  const handleNodeContextMenu = (event: React.MouseEvent, node: any) => {
    event.preventDefault();
    if (node.type !== NodeType.GhostNode) {
      showNodeMenu(event as React.MouseEvent<HTMLElement>, {
        props: {
          node,
        },
      });
    }
  };

  const handleEdgeContextMenu = (event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    if (edge.type !== NodeType.GhostEdge) {
      showEdgeMenu(event as React.MouseEvent<HTMLElement>, {
        props: {
          edge,
        },
      });
    }
  };

  const handleDropNode = (item: IDragItem, monitor: DropTargetMonitor) => {
    const clientOffset = monitor.getSourceClientOffset()!;
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()!;

    const position = reactFlowInstance.current!.project({
      x: clientOffset.x - reactFlowBounds.left,
      y: clientOffset.y - reactFlowBounds.top,
    });
    setNodeStateMap((s) => ({
      ...s,
      [item.id]: {
        ...s?.[item.id],
        handleState: NodeHandleState.Handling,
        position,
      },
    }));
  };

  const onLoad = (_reactFlowInstance: OnLoadParams) => {
    reactFlowInstance.current = _reactFlowInstance;
    fitView({
      maxZoom: 1,
    });
  };

  useUpdateEffect(() => {
    fitView({
      maxZoom: 1,
    });
  }, [datasheetId]);

  useUpdateEffect(() => {
    focusNode(searchRecordId as string);
  }, [searchRecordId]);

  useUpdateEffect(() => {
    fitView();
  }, [horizontal]);

  const prevHandlingCount = usePrevious(handlingCount);

  useUpdateEffect(() => {
    if (handlingCount === 0 && prevHandlingCount === 1) {
      fitView({
        maxZoom: 1,
      });
    }
  }, [handlingCount]);

  useUpdateEffect(() => {
    const state = store.getState();
    const hooks = state.hooks;
    const curGuideWizardId = hooks?.curGuideWizardId;
    const handledCount = rowsCount - handlingCount - unhandledNodes.length;

    if (initialElements.length === 1) {
      // Add the first node
      // The current wizard is 79 and 79 is complete before 80 can be executed
      if (
        curGuideWizardId === ConfigConstant.WizardIdConstant.ORG_VIEW_PANEL &&
        getWizardRunCount(state.user, ConfigConstant.WizardIdConstant.ORG_VIEW_PANEL)
      ) {
        TriggerCommands.clear_guide_all_ui?.();
        TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.ORG_VIEW_ADD_FIRST_NODE);
      }
    }
    // Add link nodes
    else if (unhandledNodes.length !== initialElements.length && handledCount === 2) {
      // The current wizard is 80 in order to execute 81
      if (curGuideWizardId === ConfigConstant.WizardIdConstant.ORG_VIEW_ADD_FIRST_NODE) {
        TriggerCommands.clear_guide_all_ui?.();
        TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.ORG_VIEW_DRAG_TO_UNHANDLED_LIST);
      }
    }
  }, [initialElements]);

  return (
    <>
      <DropWrapper
        accept={[DragNodeType.OTHER_NODE, DragNodeType.RENDER_NODE]}
        className={styles.dropWrapper}
        onDrop={handleDropNode}
        onMouseOver={() => {
          if (overGhostRef.current) {
            const { id = '', hiddenLastNode, setEdgeVisibleFuncsMap } = overGhostRef.current;
            hiddenLastNode?.();
            setEdgeVisibleFuncsMap?.[id]?.(false);
            overGhostRef.current.id = undefined;
          }
        }}
      >
        <ReactFlow
          ref={reactFlowWrapper}
          elements={initialElements}
          panOnScroll
          zoomOnDoubleClick={false}
          zoomOnScroll={false}
          nodesDraggable={false}
          selectionKeyCode=""
          selectNodesOnDrag={false}
          onLoad={onLoad}
          defaultZoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          zoomOnPinch={!isWindowsOS()}
          zoomActivationKeyCode={isWindowsOS() ? KeyCode.Alt : KeyCode.Meta}
          nodeTypes={{
            [NodeType.CustomNode]: CustomNode as any,
            [NodeType.GhostNode]: GhostNode as any,
          }}
          edgeTypes={{
            [NodeType.CustomEdge]: CustomEdge as any,
            [NodeType.BezierEdge]: BezierEdge as any,
            [NodeType.GhostEdge]: GhostEdge as any,
          }}
          onlyRenderVisibleElements
          panOnScrollSpeed={1}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
        />
        <DragLayer />
        <Controls
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoomReset={() => {
            zoomTo(1);
          }}
          fitView={fitView}
        />
      </DropWrapper>
      {unhandledNodes.length === rowsCount && (
        <AddFirstNode
          onAdd={async () => (await addRecord(viewId, rowsCount))!}
          mode={rowsCount === 0 ? 'add' : 'none'}
          reactFlowInstance={reactFlowInstance}
        />
      )}
      {quickAddRecId &&
        ReactDOM.createPortal(
          <>
            <Modal recordId={quickAddRecId} setQuickAddRecId={setQuickAddRecId} />
            <div
              className={styles.mask}
              onClick={() => {
                setQuickAddRecId(undefined);
              }}
            />
          </>,
          document.body,
        )}
      {initialElements.length > 0 && (
        <>
          <ScrollBar type={ScrollBarType.Horizontal} />
          <ScrollBar type={ScrollBarType.Vertical} />
        </>
      )}
    </>
  );
};
