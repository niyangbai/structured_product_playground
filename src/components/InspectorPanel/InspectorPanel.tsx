import React from 'react';
import { useAppStore } from '../../store/appStore';
import PropertyEditor from './PropertyEditor';
import './InspectorPanel.css';

const InspectorPanel: React.FC = () => {
  const { selectedBrickId, bricks, showInspector, toggleInspector, deleteBrick } = useAppStore();
  
  const selectedBrick = selectedBrickId ? bricks.find(b => b.id === selectedBrickId) : null;

  if (!showInspector) {
    return (
      <div className="inspector-panel collapsed">
        <button className="toggle-button" onClick={toggleInspector}>
          ◀
        </button>
      </div>
    );
  }

  return (
    <div className="inspector-panel">
      <div className="inspector-header">
        <h3>Inspector</h3>
        <button className="toggle-button" onClick={toggleInspector}>
          ▶
        </button>
      </div>

      {selectedBrick ? (
        <div className="inspector-content">
          <div className="brick-info">
            <div className="brick-title">
              <span className="brick-icon">
                {getBrickIcon(selectedBrick.type)}
              </span>
              <span className="brick-name">{selectedBrick.type}</span>
            </div>
            <div className="brick-category">
              Category: {selectedBrick.category}
            </div>
          </div>

          <div className="inspector-section">
            <h4>Properties</h4>
            <PropertyEditor brick={selectedBrick} />
          </div>

          <div className="inspector-section">
            <h4>Inputs ({selectedBrick.inputs.length})</h4>
            <div className="io-list">
              {selectedBrick.inputs.map((input) => (
                <div key={input.id} className="io-item">
                  <div className="io-info">
                    <span className="io-name">{input.name}</span>
                    <span className="io-type">{input.type}</span>
                  </div>
                  <div className={`io-status ${input.connected ? 'connected' : 'disconnected'}`}>
                    {input.connected ? '🔗' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="inspector-section">
            <h4>Outputs ({selectedBrick.outputs.length})</h4>
            <div className="io-list">
              {selectedBrick.outputs.map((output) => (
                <div key={output.id} className="io-item">
                  <div className="io-info">
                    <span className="io-name">{output.name}</span>
                    <span className="io-type">{output.type}</span>
                  </div>
                  <div className="io-value">
                    {output.value !== undefined ? String(output.value) : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="inspector-actions">
            <button 
              className="delete-button"
              onClick={() => deleteBrick(selectedBrick.id)}
            >
              🗑️ Delete Brick
            </button>
          </div>
        </div>
      ) : (
        <div className="inspector-empty">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>Select a brick to inspect its properties</p>
          </div>
        </div>
      )}
    </div>
  );
};

const getBrickIcon = (brickType: string): string => {
  const icons: Record<string, string> = {
    // Asset bricks
    UnderlyingAsset: '📊',
    Bond: '💰',
    
    // Option bricks
    VanillaOption: '📈',
    DigitalOption: '🎯',
    BarrierOption: '🚧',
    LookbackOption: '👁️',
    RangeOption: '📏',
    
    // Logic bricks
    IfThenElse: '❓',
    BarrierTrigger: '⚡',
    AutocallTrigger: '📞',
    KnockInCheck: '🔓',
    MemoryBuffer: '💾',
    HighWatermarkTracker: '📊',
    TargetTracker: '🎯',
    Observation: '👀',
    
    // Flow bricks
    CouponSchedule: '📅',
    CouponLogic: '🔄',
    FinalPayout: '💸',
    AutocallHandler: '☎️',
    CouponAccumulator: '📈',
    
    // Math bricks
    Sum: '➕',
    Multiplier: '✖️',
    Compare: '⚖️',
    Selector: '🎯',
    Timer: '⏰',
  };
  
  return icons[brickType] || '⚙️';
};

export default InspectorPanel;