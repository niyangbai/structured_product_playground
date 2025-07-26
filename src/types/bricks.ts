// Core brick system types based on the blueprint

export type BrickCategory = 'asset' | 'option' | 'logic' | 'flow' | 'math';

export interface BaseBrick {
  id: string;
  type: string;
  category: BrickCategory;
  position: { x: number; y: number };
  inputs: BrickInput[];
  outputs: BrickOutput[];
  properties: Record<string, any>;
}

export interface BrickInput {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'asset' | 'option' | 'trigger' | 'any';
  required: boolean;
  connected?: boolean;
  value?: any;
}

export interface BrickOutput {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'asset' | 'option' | 'trigger' | 'any';
  value?: any;
}

// Asset Bricks
export interface UnderlyingAssetBrick extends BaseBrick {
  type: 'UnderlyingAsset';
  category: 'asset';
  properties: {
    symbol: string;
    currentPrice: number;
    volatility: number;
    dividendYield: number;
  };
}

export interface BondBrick extends BaseBrick {
  type: 'Bond';
  category: 'asset';
  properties: {
    faceValue: number;
    couponRate: number;
    maturity: string;
    yieldToMaturity: number;
  };
}

// Option Bricks
export interface VanillaOptionBrick extends BaseBrick {
  type: 'VanillaOption';
  category: 'option';
  properties: {
    optionType: 'call' | 'put';
    position: 'long' | 'short';
    strike: number;
    expiry: string;
    notional: number;
  };
}

export interface DigitalOptionBrick extends BaseBrick {
  type: 'DigitalOption';
  category: 'option';
  properties: {
    strike: number;
    payoutAmount: number;
    expiry: string;
    barrier: 'above' | 'below';
  };
}

export interface BarrierOptionBrick extends BaseBrick {
  type: 'BarrierOption';
  category: 'option';
  properties: {
    optionType: 'call' | 'put';
    barrierType: 'up-and-out' | 'up-and-in' | 'down-and-out' | 'down-and-in';
    strike: number;
    barrier: number;
    expiry: string;
    notional: number;
  };
}

export interface LookbackOptionBrick extends BaseBrick {
  type: 'LookbackOption';
  category: 'option';
  properties: {
    lookbackType: 'fixed' | 'floating';
    strike?: number;
    expiry: string;
    notional: number;
  };
}

export interface RangeOptionBrick extends BaseBrick {
  type: 'RangeOption';
  category: 'option';
  properties: {
    lowerBound: number;
    upperBound: number;
    payoutPerDay: number;
    expiry: string;
  };
}

// Logic Bricks
export interface IfThenElseBrick extends BaseBrick {
  type: 'IfThenElse';
  category: 'logic';
  properties: {
    condition: string;
  };
}

export interface BarrierTriggerBrick extends BaseBrick {
  type: 'BarrierTrigger';
  category: 'logic';
  properties: {
    barrierLevel: number;
    triggerType: 'above' | 'below' | 'touch';
    continuous: boolean;
  };
}

export interface AutocallTriggerBrick extends BaseBrick {
  type: 'AutocallTrigger';
  category: 'logic';
  properties: {
    autocallLevel: number;
    observationDates: string[];
    callable: boolean;
  };
}

export interface KnockInCheckBrick extends BaseBrick {
  type: 'KnockInCheck';
  category: 'logic';
  properties: {
    knockInLevel: number;
    activated: boolean;
  };
}

export interface MemoryBufferBrick extends BaseBrick {
  type: 'MemoryBuffer';
  category: 'logic';
  properties: {
    storedCoupons: number[];
    maxBuffer: number;
  };
}

export interface HighWatermarkTrackerBrick extends BaseBrick {
  type: 'HighWatermarkTracker';
  category: 'logic';
  properties: {
    trackingType: 'maximum' | 'minimum';
    currentValue: number;
    resetCondition?: string;
  };
}

export interface TargetTrackerBrick extends BaseBrick {
  type: 'TargetTracker';
  category: 'logic';
  properties: {
    targetAmount: number;
    currentAccumulated: number;
    resetOnTarget: boolean;
  };
}

export interface ObservationBrick extends BaseBrick {
  type: 'Observation';
  category: 'logic';
  properties: {
    observationDates: string[];
    condition: string;
    result: boolean;
  };
}

// Flow Bricks
export interface CouponScheduleBrick extends BaseBrick {
  type: 'CouponSchedule';
  category: 'flow';
  properties: {
    paymentDates: string[];
    observationDates: string[];
    frequency: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
  };
}

export interface CouponLogicBrick extends BaseBrick {
  type: 'CouponLogic';
  category: 'flow';
  properties: {
    couponRate: number;
    conditional: boolean;
    condition: string;
    memory: boolean;
  };
}

export interface FinalPayoutBrick extends BaseBrick {
  type: 'FinalPayout';
  category: 'flow';
  properties: {
    protectionLevel: number;
    participationRate: number;
    cap?: number;
    floor?: number;
  };
}

export interface AutocallHandlerBrick extends BaseBrick {
  type: 'AutocallHandler';
  category: 'flow';
  properties: {
    autocallAmount: number;
    couponPayment: number;
    callCondition: string;
  };
}

export interface CouponAccumulatorBrick extends BaseBrick {
  type: 'CouponAccumulator';
  category: 'flow';
  properties: {
    dailyRate: number;
    condition: string;
    resetFrequency: 'daily' | 'monthly' | 'quarterly';
  };
}

// Math/Utility Bricks
export interface SumBrick extends BaseBrick {
  type: 'Sum';
  category: 'math';
  properties: {
    inputCount: number;
  };
}

export interface MultiplierBrick extends BaseBrick {
  type: 'Multiplier';
  category: 'math';
  properties: {
    factor: number;
  };
}

export interface CompareBrick extends BaseBrick {
  type: 'Compare';
  category: 'math';
  properties: {
    operator: 'GT' | 'LT' | 'EQ' | 'GTE' | 'LTE' | 'NEQ';
    threshold: number;
  };
}

export interface SelectorBrick extends BaseBrick {
  type: 'Selector';
  category: 'math';
  properties: {
    selectionType: 'best' | 'worst' | 'median' | 'random';
    assetCount: number;
  };
}

export interface TimerBrick extends BaseBrick {
  type: 'Timer';
  category: 'math';
  properties: {
    startEvent: string;
    endEvent?: string;
    elapsedTime: number;
    units: 'days' | 'months' | 'years';
  };
}

// Union type for all brick types
export type AnyBrick = 
  | UnderlyingAssetBrick
  | BondBrick
  | VanillaOptionBrick
  | DigitalOptionBrick
  | BarrierOptionBrick
  | LookbackOptionBrick
  | RangeOptionBrick
  | IfThenElseBrick
  | BarrierTriggerBrick
  | AutocallTriggerBrick
  | KnockInCheckBrick
  | MemoryBufferBrick
  | HighWatermarkTrackerBrick
  | TargetTrackerBrick
  | ObservationBrick
  | CouponScheduleBrick
  | CouponLogicBrick
  | FinalPayoutBrick
  | AutocallHandlerBrick
  | CouponAccumulatorBrick
  | SumBrick
  | MultiplierBrick
  | CompareBrick
  | SelectorBrick
  | TimerBrick;

// Product template types
export interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  bricks: AnyBrick[];
  connections: BrickConnection[];
}

export interface BrickConnection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceOutputId: string;
  targetInputId: string;
}