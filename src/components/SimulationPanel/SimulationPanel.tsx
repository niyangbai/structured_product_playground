import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { MarketScenario } from '../../types';
import ScenarioBuilder from './ScenarioBuilder';
import './SimulationPanel.css';

const SimulationPanel: React.FC = () => {
  const { 
    currentScenario, 
    simulationResults, 
    isSimulating,
    showSimulation, 
    toggleSimulation,
    setCurrentScenario,
    setIsSimulating,
    setSimulationResults,
    bricks,
    connections
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'scenarios' | 'results'>('scenarios');

  const presetScenarios: MarketScenario[] = [
    {
      id: 'uptrend',
      name: 'Bull Market',
      type: 'uptrend',
      parameters: {
        startPrice: 4000,
        endPrice: 5000,
        volatility: 0.15,
        drift: 0.2,
        timeHorizon: 1,
        steps: 252,
      },
    },
    {
      id: 'downtrend',
      name: 'Bear Market',
      type: 'downtrend',
      parameters: {
        startPrice: 4000,
        endPrice: 3200,
        volatility: 0.25,
        drift: -0.2,
        timeHorizon: 1,
        steps: 252,
      },
    },
    {
      id: 'flat',
      name: 'Sideways Market',
      type: 'flat',
      parameters: {
        startPrice: 4000,
        endPrice: 4000,
        volatility: 0.12,
        drift: 0,
        timeHorizon: 1,
        steps: 252,
      },
    },
    {
      id: 'volatile',
      name: 'High Volatility',
      type: 'volatile',
      parameters: {
        startPrice: 4000,
        endPrice: 4200,
        volatility: 0.35,
        drift: 0.05,
        timeHorizon: 1,
        steps: 252,
      },
    },
  ];

  const handleRunSimulation = async () => {
    if (!currentScenario || bricks.length === 0) return;

    setIsSimulating(true);
    
    try {
      // Import and run the simulation engine
      const { SimulationEngine } = await import('../../simulation/simulationEngine');
      const engine = new SimulationEngine(bricks, connections);
      const result = await engine.simulate(currentScenario);
      
      setSimulationResults([result]);
      console.log('Simulation completed for scenario:', currentScenario.name, result);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!showSimulation) {
    return (
      <div className="simulation-panel collapsed">
        <button className="toggle-button" onClick={toggleSimulation}>
          ▲
        </button>
      </div>
    );
  }

  return (
    <div className="simulation-panel">
      <div className="simulation-header">
        <h3>Simulation</h3>
        <button className="toggle-button" onClick={toggleSimulation}>
          ▼
        </button>
      </div>

      <div className="simulation-tabs">
        <button
          className={`tab ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          📊 Scenarios
        </button>
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          📈 Results
        </button>
      </div>

      <div className="simulation-content">
        {activeTab === 'scenarios' && (
          <div className="scenarios-tab">
            <div className="scenario-section">
              <h4>Preset Scenarios</h4>
              <div className="scenario-grid">
                {presetScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`scenario-card ${
                      currentScenario?.id === scenario.id ? 'selected' : ''
                    }`}
                    onClick={() => setCurrentScenario(scenario)}
                  >
                    <div className="scenario-icon">
                      {getScenarioIcon(scenario.type)}
                    </div>
                    <div className="scenario-name">{scenario.name}</div>
                    <div className="scenario-details">
                      <span>Vol: {(scenario.parameters.volatility * 100).toFixed(0)}%</span>
                      <span>Return: {(scenario.parameters.drift * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentScenario && (
              <div className="scenario-section">
                <h4>Current Scenario: {currentScenario.name}</h4>
                <ScenarioBuilder
                  scenario={currentScenario}
                  onChange={setCurrentScenario}
                />
              </div>
            )}

            <div className="simulation-controls">
              <button
                className="run-button"
                onClick={handleRunSimulation}
                disabled={!currentScenario || bricks.length === 0 || isSimulating}
              >
                {isSimulating ? (
                  <>
                    <span className="spinner">⟳</span>
                    Running...
                  </>
                ) : (
                  <>
                    ▶️ Run Simulation
                  </>
                )}
              </button>
              
              {bricks.length === 0 && (
                <p className="warning">Add some bricks to run simulation</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-tab">
            {simulationResults.length > 0 ? (
              <div className="results-content">
                <h4>Simulation Results</h4>
                {simulationResults.map((result, index) => (
                  <div key={index} className="result-card">
                    <div className="result-header">
                      <strong>{result.scenario.name}</strong>
                    </div>
                    <div className="result-metrics">
                      <div className="metric">
                        <span className="metric-label">Final Payoff:</span>
                        <span className="metric-value">
                          ${result.finalPayoff.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Max Gain:</span>
                        <span className="metric-value positive">
                          ${result.maxGain.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Max Drawdown:</span>
                        <span className="metric-value negative">
                          ${result.maxDrawdown.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Profit Probability:</span>
                        <span className="metric-value">
                          {(result.probabilityOfProfit * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <div className="empty-icon">📊</div>
                <p>No simulation results yet</p>
                <p className="empty-subtitle">Run a simulation to see results here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const getScenarioIcon = (type: string): string => {
  const icons = {
    uptrend: '📈',
    downtrend: '📉',
    flat: '➡️',
    volatile: '🌊',
    custom: '⚙️',
  };
  return icons[type as keyof typeof icons] || '📊';
};

export default SimulationPanel;