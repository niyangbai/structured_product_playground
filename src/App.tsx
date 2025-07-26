import React from 'react';
import BrickCanvas from './components/BrickCanvas/BrickCanvas';
import InspectorPanel from './components/InspectorPanel/InspectorPanel';
import SimulationPanel from './components/SimulationPanel/SimulationPanel';
import PayoffChart from './components/PayoffChart/PayoffChart';
import { useAppStore } from './store/appStore';
import { useLocalStoragePersistence } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const { showInspector, showSimulation } = useAppStore();
  
  // Initialize localStorage persistence
  useLocalStoragePersistence();

  return (
    <div className="app">
      <div className="app-header">
        <h1>📐 Structured Product Builder</h1>
        <div className="app-subtitle">
          Build and simulate structured financial products using visual bricks
        </div>
      </div>
      
      <div className="app-content">
        <div className="main-section">
          <div className="canvas-section">
            <BrickCanvas />
          </div>
          
          {showInspector && (
            <div className="inspector-section">
              <InspectorPanel />
            </div>
          )}
        </div>
        
        <div className="bottom-section">
          <div className="chart-section">
            <PayoffChart />
          </div>
          
          {showSimulation && (
            <div className="simulation-section">
              <SimulationPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
