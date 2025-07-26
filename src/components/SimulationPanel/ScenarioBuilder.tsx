import React from 'react';
import { MarketScenario } from '../../types';
import './ScenarioBuilder.css';

interface ScenarioBuilderProps {
  scenario: MarketScenario;
  onChange: (scenario: MarketScenario) => void;
}

const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({ scenario, onChange }) => {
  const handleParameterChange = (key: keyof MarketScenario['parameters'], value: number) => {
    onChange({
      ...scenario,
      parameters: {
        ...scenario.parameters,
        [key]: value,
      },
    });
  };

  return (
    <div className="scenario-builder">
      <div className="parameter-grid">
        <div className="parameter-group">
          <label>Start Price</label>
          <input
            type="number"
            value={scenario.parameters.startPrice}
            onChange={(e) => handleParameterChange('startPrice', parseFloat(e.target.value) || 0)}
            step="0.01"
          />
        </div>

        {scenario.parameters.endPrice !== undefined && (
          <div className="parameter-group">
            <label>End Price</label>
            <input
              type="number"
              value={scenario.parameters.endPrice}
              onChange={(e) => handleParameterChange('endPrice', parseFloat(e.target.value) || 0)}
              step="0.01"
            />
          </div>
        )}

        <div className="parameter-group">
          <label>Volatility (%)</label>
          <input
            type="number"
            value={(scenario.parameters.volatility * 100).toFixed(1)}
            onChange={(e) => handleParameterChange('volatility', (parseFloat(e.target.value) || 0) / 100)}
            step="0.1"
            min="0"
            max="100"
          />
        </div>

        <div className="parameter-group">
          <label>Drift (%)</label>
          <input
            type="number"
            value={(scenario.parameters.drift * 100).toFixed(1)}
            onChange={(e) => handleParameterChange('drift', (parseFloat(e.target.value) || 0) / 100)}
            step="0.1"
            min="-100"
            max="100"
          />
        </div>

        <div className="parameter-group">
          <label>Time Horizon (years)</label>
          <input
            type="number"
            value={scenario.parameters.timeHorizon}
            onChange={(e) => handleParameterChange('timeHorizon', parseFloat(e.target.value) || 0)}
            step="0.1"
            min="0.1"
            max="10"
          />
        </div>

        <div className="parameter-group">
          <label>Time Steps</label>
          <input
            type="number"
            value={scenario.parameters.steps}
            onChange={(e) => handleParameterChange('steps', parseInt(e.target.value) || 0)}
            step="1"
            min="10"
            max="2520"
          />
        </div>
      </div>

      <div className="scenario-preview">
        <h5>Preview</h5>
        <div className="preview-stats">
          <div className="stat">
            <span className="stat-label">Expected Return:</span>
            <span className="stat-value">
              {(scenario.parameters.drift * 100).toFixed(2)}%
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Annual Volatility:</span>
            <span className="stat-value">
              {(scenario.parameters.volatility * 100).toFixed(1)}%
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Steps per Year:</span>
            <span className="stat-value">
              {Math.round(scenario.parameters.steps / scenario.parameters.timeHorizon)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioBuilder;