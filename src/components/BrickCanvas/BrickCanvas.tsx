import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useAppStore } from '../../store/appStore';
import { AnyBrick, BrickConnection } from '../../types';
import BrickNode from './BrickNode';
import BrickPalette from './BrickPalette';
import './BrickCanvas.css';

const nodeTypes = {
  brickNode: BrickNode,
};

const BrickCanvas: React.FC = () => {
  const {
    bricks,
    connections,
    selectedBrickId,
    addConnection,
    removeConnection,
    updateBrick,
    selectBrick,
  } = useAppStore();

  // Convert bricks to react-flow nodes
  const nodes: Node[] = useMemo(
    () =>
      bricks.map((brick) => ({
        id: brick.id,
        type: 'brickNode',
        position: brick.position,
        data: {
          brick,
          isSelected: brick.id === selectedBrickId,
        },
        selected: brick.id === selectedBrickId,
      })),
    [bricks, selectedBrickId]
  );

  // Convert connections to react-flow edges
  const edges: Edge[] = useMemo(
    () =>
      connections.map((connection) => ({
        id: connection.id,
        source: connection.sourceId,
        target: connection.targetId,
        sourceHandle: connection.sourceOutputId,
        targetHandle: connection.targetInputId,
        type: 'default',
        animated: true,
      })),
    [connections]
  );

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Sync nodes with store
  React.useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  // Sync edges with store
  React.useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      if (connection.source && connection.target) {
        const newConnection: BrickConnection = {
          id: `${connection.source}-${connection.target}-${Date.now()}`,
          sourceId: connection.source,
          targetId: connection.target,
          sourceOutputId: connection.sourceHandle || 'output',
          targetInputId: connection.targetHandle || 'input',
        };
        addConnection(newConnection);
      }
    },
    [addConnection]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      selectBrick(node.id);
    },
    [selectBrick]
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      
      // Update brick positions in store
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          updateBrick(change.id, { position: change.position });
        }
      });
    },
    [onNodesChange, updateBrick]
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      
      // Handle edge removals
      changes.forEach((change) => {
        if (change.type === 'remove') {
          removeConnection(change.id);
        }
      });
    },
    [onEdgesChange, removeConnection]
  );

  const handleCanvasClick = useCallback(() => {
    selectBrick(null);
  }, [selectBrick]);

  return (
    <div className="brick-canvas-container">
      <BrickPalette />
      <div className="brick-canvas">
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handleCanvasClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap
            nodeStrokeColor={(n) => {
              const brick = bricks.find(b => b.id === n.id);
              return brick ? getBrickCategoryColor(brick.category) : '#333';
            }}
            nodeColor={(n) => {
              const brick = bricks.find(b => b.id === n.id);
              return brick ? getBrickCategoryColor(brick.category, 0.3) : '#ccc';
            }}
            nodeBorderRadius={8}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

const getBrickCategoryColor = (category: string, opacity = 1) => {
  const colors = {
    asset: `rgba(52, 152, 219, ${opacity})`,
    option: `rgba(155, 89, 182, ${opacity})`,
    logic: `rgba(241, 196, 15, ${opacity})`,
    flow: `rgba(46, 204, 113, ${opacity})`,
    math: `rgba(231, 76, 60, ${opacity})`,
  };
  return colors[category as keyof typeof colors] || `rgba(149, 165, 166, ${opacity})`;
};

export default BrickCanvas;