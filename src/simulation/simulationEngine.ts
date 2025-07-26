import { AnyBrick, BrickConnection, MarketScenario, SimulationResult, PayoffPoint } from '../types';

export class SimulationEngine {
  private bricks: AnyBrick[];
  private connections: BrickConnection[];

  constructor(bricks: AnyBrick[], connections: BrickConnection[]) {
    this.bricks = bricks;
    this.connections = connections;
  }

  async simulate(scenario: MarketScenario): Promise<SimulationResult> {
    const { parameters } = scenario;
    const payoffData: PayoffPoint[] = [];
    
    // Generate price path based on scenario
    const pricePath = this.generatePricePath(scenario);
    
    let cumulativePayoff = 0;
    let maxGain = 0;
    let maxDrawdown = 0;
    let profitableOutcomes = 0;
    
    // Simulate each time step
    for (let i = 0; i < pricePath.length; i++) {
      const time = (i / (pricePath.length - 1)) * parameters.timeHorizon;
      const spotPrice = pricePath[i];
      
      // Calculate payoff for this time step
      const stepPayoff = this.calculateStepPayoff(spotPrice, time, scenario);
      cumulativePayoff += stepPayoff;
      
      // Track statistics
      maxGain = Math.max(maxGain, cumulativePayoff);
      maxDrawdown = Math.min(maxDrawdown, cumulativePayoff);
      
      if (cumulativePayoff > 0) {
        profitableOutcomes++;
      }
      
      payoffData.push({
        time,
        spotPrice,
        payoff: stepPayoff,
        cumulativePayoff,
        triggerEvents: this.detectTriggerEvents(spotPrice, time),
      });
    }

    return {
      scenario,
      payoffData,
      finalPayoff: cumulativePayoff,
      maxDrawdown,
      maxGain,
      probabilityOfProfit: profitableOutcomes / pricePath.length,
    };
  }

  private generatePricePath(scenario: MarketScenario): number[] {
    const { startPrice, endPrice, volatility, drift, timeHorizon, steps } = scenario.parameters;
    const dt = timeHorizon / steps;
    const path: number[] = [startPrice];

    let currentPrice = startPrice;
    
    for (let i = 1; i <= steps; i++) {
      // Generate random component
      const random = this.boxMullerRandom();
      
      // Calculate price change based on scenario type
      let priceChange = 0;
      
      switch (scenario.type) {
        case 'uptrend':
          priceChange = currentPrice * (drift * dt + volatility * Math.sqrt(dt) * random);
          break;
        case 'downtrend':
          priceChange = currentPrice * (drift * dt + volatility * Math.sqrt(dt) * random);
          break;
        case 'flat':
          priceChange = currentPrice * (volatility * Math.sqrt(dt) * random);
          break;
        case 'volatile':
          priceChange = currentPrice * (drift * dt + volatility * Math.sqrt(dt) * random * 1.5);
          break;
        default:
          priceChange = currentPrice * (drift * dt + volatility * Math.sqrt(dt) * random);
      }
      
      currentPrice = Math.max(0.01, currentPrice + priceChange);
      path.push(currentPrice);
    }

    // Adjust path to hit target end price if specified
    if (endPrice !== undefined && scenario.type !== 'custom') {
      const adjustment = endPrice / currentPrice;
      for (let i = 1; i < path.length; i++) {
        const factor = Math.pow(adjustment, i / (path.length - 1));
        path[i] *= factor;
      }
    }

    return path;
  }

  private calculateStepPayoff(spotPrice: number, time: number, scenario: MarketScenario): number {
    // Simple payoff calculation - in a real implementation, this would
    // evaluate the entire brick network
    const underlyingAssets = this.bricks.filter(b => b.type === 'UnderlyingAsset');
    const options = this.bricks.filter(b => b.category === 'option');
    
    let totalPayoff = 0;
    
    // Calculate option payoffs
    for (const option of options) {
      switch (option.type) {
        case 'VanillaOption':
          const strike = (option.properties as any).strike;
          const isCall = (option.properties as any).optionType === 'call';
          const isLong = (option.properties as any).position === 'long';
          
          let optionPayoff = isCall 
            ? Math.max(0, spotPrice - strike)
            : Math.max(0, strike - spotPrice);
            
          optionPayoff *= isLong ? 1 : -1;
          optionPayoff *= (option.properties as any).notional / 1000; // Normalize
          
          totalPayoff += optionPayoff;
          break;
          
        case 'DigitalOption':
          const digitalStrike = (option.properties as any).strike;
          const payout = (option.properties as any).payoutAmount;
          const isAbove = (option.properties as any).barrier === 'above';
          
          const condition = isAbove ? spotPrice >= digitalStrike : spotPrice <= digitalStrike;
          totalPayoff += condition ? payout : 0;
          break;
          
        // Add more option types as needed
      }
    }
    
    return totalPayoff;
  }

  private detectTriggerEvents(spotPrice: number, time: number): string[] {
    const events: string[] = [];
    
    // Check for barrier triggers
    const barrierTriggers = this.bricks.filter(b => b.type === 'BarrierTrigger');
    for (const trigger of barrierTriggers) {
      const level = (trigger.properties as any).barrierLevel;
      const type = (trigger.properties as any).triggerType;
      
      if ((type === 'above' && spotPrice >= level) ||
          (type === 'below' && spotPrice <= level) ||
          (type === 'touch' && Math.abs(spotPrice - level) < 0.01)) {
        events.push(`Barrier ${type} ${level} triggered`);
      }
    }
    
    // Check for autocall triggers
    const autocallTriggers = this.bricks.filter(b => b.type === 'AutocallTrigger');
    for (const trigger of autocallTriggers) {
      const level = (trigger.properties as any).autocallLevel;
      if (spotPrice >= level) {
        events.push(`Autocall at ${level} triggered`);
      }
    }
    
    return events;
  }

  private boxMullerRandom(): number {
    // Box-Muller transformation for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}