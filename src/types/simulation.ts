// Simulation related types

export interface MarketScenario {
  id: string;
  name: string;
  type: 'uptrend' | 'downtrend' | 'flat' | 'volatile' | 'custom';
  parameters: {
    startPrice: number;
    endPrice?: number;
    volatility: number;
    drift: number;
    timeHorizon: number; // in years
    steps: number;
  };
  customPath?: number[];
}

export interface SimulationResult {
  scenario: MarketScenario;
  payoffData: PayoffPoint[];
  finalPayoff: number;
  maxDrawdown: number;
  maxGain: number;
  probabilityOfProfit: number;
}

export interface PayoffPoint {
  time: number;
  spotPrice: number;
  payoff: number;
  cumulativePayoff: number;
  triggerEvents: string[];
}

export interface SimulationConfig {
  scenarios: MarketScenario[];
  timeSteps: number;
  monteCarloRuns?: number;
  riskFreeRate: number;
  dividendYield: number;
}