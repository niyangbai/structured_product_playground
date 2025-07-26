import { create } from 'zustand';
import { AnyBrick, BrickConnection, MarketScenario, SimulationResult } from '../types';

interface AppState {
  // Canvas state
  bricks: AnyBrick[];
  connections: BrickConnection[];
  selectedBrickId: string | null;
  
  // Simulation state
  currentScenario: MarketScenario | null;
  simulationResults: SimulationResult[];
  isSimulating: boolean;
  
  // UI state
  showInspector: boolean;
  showSimulation: boolean;
  
  // Actions
  addBrick: (brick: AnyBrick) => void;
  updateBrick: (id: string, updates: Partial<AnyBrick>) => void;
  deleteBrick: (id: string) => void;
  selectBrick: (id: string | null) => void;
  addConnection: (connection: BrickConnection) => void;
  removeConnection: (id: string) => void;
  setCurrentScenario: (scenario: MarketScenario) => void;
  setSimulationResults: (results: SimulationResult[]) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  toggleInspector: () => void;
  toggleSimulation: () => void;
  resetCanvas: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  bricks: [],
  connections: [],
  selectedBrickId: null,
  currentScenario: null,
  simulationResults: [],
  isSimulating: false,
  showInspector: true,
  showSimulation: true,
  
  // Actions
  addBrick: (brick) => {
    set((state) => ({
      bricks: [...state.bricks, { ...brick, id: generateId() }]
    }));
  },
  
  updateBrick: (id, updates) => {
    set((state) => ({
      bricks: state.bricks.map((brick) =>
        brick.id === id ? { ...brick, ...updates } as AnyBrick : brick
      )
    }));
  },
  
  deleteBrick: (id) => {
    set((state) => ({
      bricks: state.bricks.filter((brick) => brick.id !== id),
      connections: state.connections.filter(
        (conn) => conn.sourceId !== id && conn.targetId !== id
      ),
      selectedBrickId: state.selectedBrickId === id ? null : state.selectedBrickId
    }));
  },
  
  selectBrick: (id) => {
    set({ selectedBrickId: id });
  },
  
  addConnection: (connection) => {
    set((state) => ({
      connections: [...state.connections, { ...connection, id: generateId() }]
    }));
  },
  
  removeConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== id)
    }));
  },
  
  setCurrentScenario: (scenario) => {
    set({ currentScenario: scenario });
  },
  
  setSimulationResults: (results) => {
    set({ simulationResults: results });
  },
  
  setIsSimulating: (isSimulating) => {
    set({ isSimulating });
  },
  
  toggleInspector: () => {
    set((state) => ({ showInspector: !state.showInspector }));
  },
  
  toggleSimulation: () => {
    set((state) => ({ showSimulation: !state.showSimulation }));
  },
  
  resetCanvas: () => {
    set({
      bricks: [],
      connections: [],
      selectedBrickId: null,
      simulationResults: [],
      currentScenario: null
    });
  }
}));