import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useAppStore } from '../../store/appStore';
import { PayoffPoint } from '../../types';
import './PayoffChart.css';

const PayoffChart: React.FC = () => {
  const { simulationResults, currentScenario, isSimulating } = useAppStore();

  // Generate sample payoff data for demonstration
  const payoffData = useMemo(() => {
    if (!currentScenario) return [];

    const { startPrice, timeHorizon, steps } = currentScenario.parameters;
    const data: PayoffPoint[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const time = (i / steps) * timeHorizon;
      const spotPrice = startPrice * (1 + Math.sin(i * 0.1) * 0.1 + (Math.random() - 0.5) * 0.05);
      const payoff = Math.max(0, spotPrice - startPrice) * 0.8; // Simple call option payoff
      
      data.push({
        time,
        spotPrice,
        payoff,
        cumulativePayoff: payoff,
        triggerEvents: [],
      });
    }
    
    return data;
  }, [currentScenario]);

  const plotData = useMemo(() => {
    if (payoffData.length === 0) return [];

    return [
      {
        x: payoffData.map(p => p.time),
        y: payoffData.map(p => p.spotPrice),
        type: 'scatter',
        mode: 'lines',
        name: 'Spot Price',
        line: { color: '#3b82f6', width: 2 },
        yaxis: 'y',
      },
      {
        x: payoffData.map(p => p.time),
        y: payoffData.map(p => p.payoff),
        type: 'scatter',
        mode: 'lines',
        name: 'Payoff',
        line: { color: '#10b981', width: 2 },
        fill: 'tonexty',
        fillcolor: 'rgba(16, 185, 129, 0.1)',
        yaxis: 'y2',
      },
    ] as any[];
  }, [payoffData]);

  const layout: any = {
    title: {
      text: currentScenario ? `Payoff Analysis - ${currentScenario.name}` : 'Payoff Analysis',
      font: { size: 16, color: '#1e293b' },
    },
    xaxis: {
      title: 'Time (Years)',
      gridcolor: '#f1f5f9',
      zeroline: false,
    },
    yaxis: {
      title: 'Spot Price',
      side: 'left',
      gridcolor: '#f1f5f9',
      zeroline: false,
      titlefont: { color: '#3b82f6' },
      tickfont: { color: '#3b82f6' },
    },
    yaxis2: {
      title: 'Payoff',
      side: 'right',
      overlaying: 'y',
      gridcolor: '#f1f5f9',
      zeroline: false,
      titlefont: { color: '#10b981' },
      tickfont: { color: '#10b981' },
    },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#e2e8f0',
      borderwidth: 1,
    },
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#ffffff',
    margin: { l: 60, r: 60, t: 50, b: 50 },
    hovermode: 'x unified',
  };

  const config: any = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true,
  };

  if (isSimulating) {
    return (
      <div className="payoff-chart">
        <div className="chart-loading">
          <div className="loading-spinner">⟳</div>
          <p>Running simulation...</p>
        </div>
      </div>
    );
  }

  if (payoffData.length === 0) {
    return (
      <div className="payoff-chart">
        <div className="chart-empty">
          <div className="empty-icon">📊</div>
          <p>No simulation data</p>
          <p className="empty-subtitle">
            Select a scenario and run simulation to see payoff analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="payoff-chart">
      <div className="chart-container">
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
      
      {simulationResults.length > 0 && (
        <div className="chart-summary">
          <div className="summary-metrics">
            {simulationResults.map((result, index) => (
              <div key={index} className="metric-card">
                <div className="metric-label">{result.scenario.name}</div>
                <div className="metric-grid">
                  <div className="metric-item">
                    <span className="metric-title">Final Payoff</span>
                    <span className="metric-value">
                      ${result.finalPayoff.toFixed(2)}
                    </span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-title">Max Gain</span>
                    <span className="metric-value positive">
                      ${result.maxGain.toFixed(2)}
                    </span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-title">Max Loss</span>
                    <span className="metric-value negative">
                      ${result.maxDrawdown.toFixed(2)}
                    </span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-title">Win Rate</span>
                    <span className="metric-value">
                      {(result.probabilityOfProfit * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoffChart;