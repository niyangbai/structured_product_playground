import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AnyBrick } from '../../types';
import './BrickNode.css';

interface BrickNodeData {
  brick: AnyBrick;
  isSelected: boolean;
}

const BrickNode: React.FC<NodeProps<BrickNodeData>> = ({ data }) => {
  const { brick, isSelected } = data;

  const getCategoryColor = (category: string) => {
    const colors = {
      asset: '#3498db',
      option: '#9b59b6',
      logic: '#f1c40f',
      flow: '#2ecc71',
      math: '#e74c3c',
    };
    return colors[category as keyof typeof colors] || '#95a5a6';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      asset: '📊',
      option: '📈',
      logic: '🔧',
      flow: '🔄',
      math: '🧮',
    };
    return icons[category as keyof typeof icons] || '⚙️';
  };

  return (
    <div
      className={`brick-node ${isSelected ? 'selected' : ''}`}
      style={{
        borderColor: getCategoryColor(brick.category),
        backgroundColor: `${getCategoryColor(brick.category)}15`,
      }}
    >
      {/* Input handles */}
      {brick.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: `${((index + 1) * 100) / (brick.inputs.length + 1)}%`,
            backgroundColor: input.connected ? '#2ecc71' : '#bdc3c7',
          }}
          className="brick-handle"
        />
      ))}

      {/* Node content */}
      <div className="brick-node-header">
        <span className="brick-icon">{getCategoryIcon(brick.category)}</span>
        <span className="brick-type">{brick.type}</span>
      </div>

      <div className="brick-node-content">
        {/* Display key properties */}
        {Object.entries(brick.properties).slice(0, 3).map(([key, value]) => (
          <div key={key} className="brick-property">
            <span className="property-key">{key}:</span>
            <span className="property-value">
              {typeof value === 'number' ? value.toFixed(2) : String(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Output handles */}
      {brick.outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            top: `${((index + 1) * 100) / (brick.outputs.length + 1)}%`,
            backgroundColor: getCategoryColor(brick.category),
          }}
          className="brick-handle"
        />
      ))}
    </div>
  );
};

export default BrickNode;