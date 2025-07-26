import { ProductTemplate, AnyBrick, BrickConnection } from '../types';
import { createBrickTemplate } from './brickTemplates';

export const getProductTemplates = (): ProductTemplate[] => [
  {
    id: 'snowball-note',
    name: 'Snowball Note',
    description: 'Autocallable note with memory coupon feature and barrier protection',
    bricks: createSnowballNote(),
    connections: createSnowballConnections(),
  },
  {
    id: 'reverse-convertible',
    name: 'Reverse Convertible',
    description: 'High yield note with downside equity exposure',
    bricks: createReverseConvertible(),
    connections: createReverseConvertibleConnections(),
  },
  {
    id: 'twin-win',
    name: 'Twin Win Note',
    description: 'Symmetric payoff structure with upside and downside participation',
    bricks: createTwinWinNote(),
    connections: createTwinWinConnections(),
  },
  {
    id: 'accumulator',
    name: 'Accumulator',
    description: 'Daily range accrual with leverage and knockout features',
    bricks: createAccumulator(),
    connections: createAccumulatorConnections(),
  },
];

function createSnowballNote(): AnyBrick[] {
  const underlying = createBrickTemplate('UnderlyingAsset');
  const couponSchedule = createBrickTemplate('CouponSchedule');
  const barrierTrigger = createBrickTemplate('BarrierTrigger');
  const autocallTrigger = createBrickTemplate('AutocallTrigger');
  const memoryBuffer = createBrickTemplate('MemoryBuffer');
  const knockInCheck = createBrickTemplate('KnockInCheck');
  const finalPayout = createBrickTemplate('FinalPayout');

  if (!underlying || !couponSchedule || !barrierTrigger || !autocallTrigger || 
      !memoryBuffer || !knockInCheck || !finalPayout) {
    return [];
  }

  // Set positions
  underlying.position = { x: 100, y: 100 };
  couponSchedule.position = { x: 300, y: 50 };
  barrierTrigger.position = { x: 300, y: 150 };
  autocallTrigger.position = { x: 500, y: 100 };
  memoryBuffer.position = { x: 500, y: 200 };
  knockInCheck.position = { x: 300, y: 250 };
  finalPayout.position = { x: 700, y: 150 };

  // Configure properties
  (underlying as any).properties = {
    symbol: 'SPX',
    currentPrice: 4000,
    volatility: 0.20,
    dividendYield: 0.02,
  };

  (barrierTrigger as any).properties = {
    barrierLevel: 3200, // 80% barrier
    triggerType: 'below',
    continuous: true,
  };

  (autocallTrigger as any).properties = {
    autocallLevel: 4000, // At-the-money
    observationDates: ['3M', '6M', '9M', '1Y'],
    callable: true,
  };

  (finalPayout as any).properties = {
    protectionLevel: 0.8,
    participationRate: 1.0,
  };

  return [
    { ...underlying, id: 'underlying-1' },
    { ...couponSchedule, id: 'schedule-1' },
    { ...barrierTrigger, id: 'barrier-1' },
    { ...autocallTrigger, id: 'autocall-1' },
    { ...memoryBuffer, id: 'memory-1' },
    { ...knockInCheck, id: 'knockin-1' },
    { ...finalPayout, id: 'payout-1' },
  ];
}

function createSnowballConnections(): BrickConnection[] {
  return [
    {
      id: 'conn-1',
      sourceId: 'underlying-1',
      targetId: 'barrier-1',
      sourceOutputId: 'price',
      targetInputId: 'price',
    },
    {
      id: 'conn-2',
      sourceId: 'underlying-1',
      targetId: 'autocall-1',
      sourceOutputId: 'price',
      targetInputId: 'price',
    },
    {
      id: 'conn-3',
      sourceId: 'barrier-1',
      targetId: 'knockin-1',
      sourceOutputId: 'triggered',
      targetInputId: 'trigger',
    },
    {
      id: 'conn-4',
      sourceId: 'autocall-1',
      targetId: 'payout-1',
      sourceOutputId: 'autocall',
      targetInputId: 'finalPrice',
    },
    {
      id: 'conn-5',
      sourceId: 'knockin-1',
      targetId: 'payout-1',
      sourceOutputId: 'knockedIn',
      targetInputId: 'knockedIn',
    },
  ];
}

function createReverseConvertible(): AnyBrick[] {
  const underlying = createBrickTemplate('UnderlyingAsset');
  const vanillaOption = createBrickTemplate('VanillaOption');
  const bond = createBrickTemplate('Bond');
  const couponSchedule = createBrickTemplate('CouponSchedule');
  const finalPayout = createBrickTemplate('FinalPayout');

  if (!underlying || !vanillaOption || !bond || !couponSchedule || !finalPayout) {
    return [];
  }

  // Set positions
  underlying.position = { x: 100, y: 100 };
  vanillaOption.position = { x: 300, y: 150 };
  bond.position = { x: 300, y: 50 };
  couponSchedule.position = { x: 500, y: 50 };
  finalPayout.position = { x: 700, y: 100 };

  // Configure properties
  (vanillaOption as any).properties = {
    optionType: 'put',
    position: 'short',
    strike: 3200, // 80% strike
    notional: 1000,
  };

  (bond as any).properties = {
    faceValue: 1000,
    couponRate: 0.08, // 8% coupon
    maturity: '1Y',
  };

  return [
    { ...underlying, id: 'underlying-1' },
    { ...vanillaOption, id: 'option-1' },
    { ...bond, id: 'bond-1' },
    { ...couponSchedule, id: 'schedule-1' },
    { ...finalPayout, id: 'payout-1' },
  ];
}

function createReverseConvertibleConnections(): BrickConnection[] {
  return [
    {
      id: 'conn-1',
      sourceId: 'underlying-1',
      targetId: 'option-1',
      sourceOutputId: 'price',
      targetInputId: 'underlying',
    },
    {
      id: 'conn-2',
      sourceId: 'option-1',
      targetId: 'payout-1',
      sourceOutputId: 'payoff',
      targetInputId: 'finalPrice',
    },
    {
      id: 'conn-3',
      sourceId: 'bond-1',
      targetId: 'payout-1',
      sourceOutputId: 'value',
      targetInputId: 'knockedIn',
    },
  ];
}

function createTwinWinNote(): AnyBrick[] {
  const underlying = createBrickTemplate('UnderlyingAsset');
  const callOption = createBrickTemplate('VanillaOption');
  const putOption = createBrickTemplate('VanillaOption');
  const sum = createBrickTemplate('Sum');

  if (!underlying || !callOption || !putOption || !sum) {
    return [];
  }

  // Set positions
  underlying.position = { x: 100, y: 100 };
  callOption.position = { x: 300, y: 50 };
  putOption.position = { x: 300, y: 150 };
  sum.position = { x: 500, y: 100 };

  // Configure properties
  (callOption as any).properties = {
    optionType: 'call',
    position: 'long',
    strike: 4000,
    notional: 1000,
  };

  (putOption as any).properties = {
    optionType: 'put',
    position: 'long',
    strike: 4000,
    notional: 1000,
  };

  return [
    { ...underlying, id: 'underlying-1' },
    { ...callOption, id: 'call-1' },
    { ...putOption, id: 'put-1' },
    { ...sum, id: 'sum-1' },
  ];
}

function createTwinWinConnections(): BrickConnection[] {
  return [
    {
      id: 'conn-1',
      sourceId: 'underlying-1',
      targetId: 'call-1',
      sourceOutputId: 'price',
      targetInputId: 'underlying',
    },
    {
      id: 'conn-2',
      sourceId: 'underlying-1',
      targetId: 'put-1',
      sourceOutputId: 'price',
      targetInputId: 'underlying',
    },
    {
      id: 'conn-3',
      sourceId: 'call-1',
      targetId: 'sum-1',
      sourceOutputId: 'payoff',
      targetInputId: 'input1',
    },
    {
      id: 'conn-4',
      sourceId: 'put-1',
      targetId: 'sum-1',
      sourceOutputId: 'payoff',
      targetInputId: 'input2',
    },
  ];
}

function createAccumulator(): AnyBrick[] {
  const underlying = createBrickTemplate('UnderlyingAsset');
  const couponAccumulator = createBrickTemplate('CouponAccumulator');
  const rangeOption = createBrickTemplate('RangeOption');
  const timer = createBrickTemplate('Timer');

  if (!underlying || !couponAccumulator || !rangeOption || !timer) {
    return [];
  }

  // Set positions
  underlying.position = { x: 100, y: 100 };
  rangeOption.position = { x: 300, y: 100 };
  couponAccumulator.position = { x: 500, y: 100 };
  timer.position = { x: 300, y: 200 };

  // Configure properties
  (rangeOption as any).properties = {
    lowerBound: 3800, // 95% of initial
    upperBound: 4200, // 105% of initial
    payoutPerDay: 2,
  };

  (couponAccumulator as any).properties = {
    dailyRate: 0.02,
    condition: 'in range',
    resetFrequency: 'quarterly',
  };

  return [
    { ...underlying, id: 'underlying-1' },
    { ...couponAccumulator, id: 'accumulator-1' },
    { ...rangeOption, id: 'range-1' },
    { ...timer, id: 'timer-1' },
  ];
}

function createAccumulatorConnections(): BrickConnection[] {
  return [
    {
      id: 'conn-1',
      sourceId: 'underlying-1',
      targetId: 'range-1',
      sourceOutputId: 'price',
      targetInputId: 'underlying',
    },
    {
      id: 'conn-2',
      sourceId: 'range-1',
      targetId: 'accumulator-1',
      sourceOutputId: 'payoff',
      targetInputId: 'condition',
    },
  ];
}