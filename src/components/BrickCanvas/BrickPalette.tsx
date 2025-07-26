import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { AnyBrick, BrickCategory } from '../../types';
import { createBrickTemplate } from '../../bricks/brickTemplates';
import { getProductTemplates } from '../../bricks/productTemplates';
import './BrickPalette.css';

const BrickPalette: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BrickCategory>('asset');
  const [showTemplates, setShowTemplates] = useState(false);
  const { addBrick, resetCanvas, bricks, connections, addConnection } = useAppStore();

  const categories: { key: BrickCategory; label: string; icon: string }[] = [
    { key: 'asset', label: 'Assets', icon: '📊' },
    { key: 'option', label: 'Options', icon: '📈' },
    { key: 'logic', label: 'Logic', icon: '🔧' },
    { key: 'flow', label: 'Flow', icon: '🔄' },
    { key: 'math', label: 'Math', icon: '🧮' },
  ];

  const brickTypes = {
    asset: ['UnderlyingAsset', 'Bond'],
    option: ['VanillaOption', 'DigitalOption', 'BarrierOption', 'LookbackOption', 'RangeOption'],
    logic: ['IfThenElse', 'BarrierTrigger', 'AutocallTrigger', 'KnockInCheck', 'MemoryBuffer', 'HighWatermarkTracker', 'TargetTracker', 'Observation'],
    flow: ['CouponSchedule', 'CouponLogic', 'FinalPayout', 'AutocallHandler', 'CouponAccumulator'],
    math: ['Sum', 'Multiplier', 'Compare', 'Selector', 'Timer'],
  };

  const handleDragStart = (event: React.DragEvent, brickType: string) => {
    event.dataTransfer.setData('application/brickType', brickType);
  };

  const handleBrickClick = (brickType: string) => {
    const template = createBrickTemplate(brickType as any);
    if (template) {
      // Position new brick at a random location
      const newBrick: AnyBrick = {
        ...template,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
      };
      addBrick(newBrick);
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    const templates = getProductTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      resetCanvas();
      
      // Add all bricks from template
      template.bricks.forEach(brick => {
        addBrick(brick);
      });
      
      // Add all connections from template
      template.connections.forEach(connection => {
        addConnection(connection);
      });
      
      setShowTemplates(false);
    }
  };

  return (
    <div className="brick-palette">
      <div className="palette-header">
        <h3>Brick Palette</h3>
        <div className="header-buttons">
          <button 
            className="template-button" 
            onClick={() => setShowTemplates(!showTemplates)}
            title="Load product template"
          >
            📋
          </button>
          <button 
            className="clear-button" 
            onClick={resetCanvas}
            title="Clear canvas"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category.key}
            className={`category-tab ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.key)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>

      {showTemplates ? (
        <div className="template-list">
          <h4>Product Templates</h4>
          {getProductTemplates().map((template) => (
            <div
              key={template.id}
              className="template-item"
              onClick={() => handleLoadTemplate(template.id)}
            >
              <div className="template-name">{template.name}</div>
              <div className="template-description">{template.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="brick-list">
          {brickTypes[selectedCategory].map((brickType) => (
            <div
              key={brickType}
              className="brick-item"
              draggable
              onDragStart={(e) => handleDragStart(e, brickType)}
              onClick={() => handleBrickClick(brickType)}
            >
              <div className="brick-item-icon">
                {getBrickIcon(brickType)}
              </div>
              <div className="brick-item-label">
                {brickType}
              </div>
            </div>
          ))}
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

export default BrickPalette;