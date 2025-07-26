import { AnyBrick, BrickInput, BrickOutput } from '../types';

const createInput = (id: string, name: string, type: BrickInput['type'], required = true): BrickInput => ({
  id,
  name,
  type,
  required,
  connected: false,
});

const createOutput = (id: string, name: string, type: BrickOutput['type']): BrickOutput => ({
  id,
  name,
  type,
});

export const createBrickTemplate = (type: string): AnyBrick | null => {
  const basePosition = { x: 0, y: 0 };
  
  switch (type) {
    // Asset Bricks
    case 'UnderlyingAsset':
      return {
        id: '',
        type: 'UnderlyingAsset',
        category: 'asset',
        position: basePosition,
        inputs: [],
        outputs: [createOutput('price', 'Price', 'number')],
        properties: {
          symbol: 'SPX',
          currentPrice: 4000,
          volatility: 0.2,
          dividendYield: 0.02,
        },
      };

    case 'Bond':
      return {
        id: '',
        type: 'Bond',
        category: 'asset',
        position: basePosition,
        inputs: [],
        outputs: [createOutput('value', 'Value', 'number')],
        properties: {
          faceValue: 1000,
          couponRate: 0.05,
          maturity: '1Y',
          yieldToMaturity: 0.04,
        },
      };

    // Option Bricks
    case 'VanillaOption':
      return {
        id: '',
        type: 'VanillaOption',
        category: 'option',
        position: basePosition,
        inputs: [createInput('underlying', 'Underlying', 'asset')],
        outputs: [createOutput('payoff', 'Payoff', 'number')],
        properties: {
          optionType: 'call' as const,
          position: 'long' as const,
          strike: 4000,
          expiry: '1Y',
          notional: 1000,
        },
      };

    case 'DigitalOption':
      return {
        id: '',
        type: 'DigitalOption',
        category: 'option',
        position: basePosition,
        inputs: [createInput('underlying', 'Underlying', 'asset')],
        outputs: [createOutput('payoff', 'Payoff', 'number')],
        properties: {
          strike: 4000,
          payoutAmount: 100,
          expiry: '1Y',
          barrier: 'above' as const,
        },
      };

    case 'BarrierOption':
      return {
        id: '',
        type: 'BarrierOption',
        category: 'option',
        position: basePosition,
        inputs: [createInput('underlying', 'Underlying', 'asset')],
        outputs: [createOutput('payoff', 'Payoff', 'number')],
        properties: {
          optionType: 'call' as const,
          barrierType: 'up-and-out' as const,
          strike: 4000,
          barrier: 4800,
          expiry: '1Y',
          notional: 1000,
        },
      };

    case 'LookbackOption':
      return {
        id: '',
        type: 'LookbackOption',
        category: 'option',
        position: basePosition,
        inputs: [createInput('underlying', 'Underlying', 'asset')],
        outputs: [createOutput('payoff', 'Payoff', 'number')],
        properties: {
          lookbackType: 'floating' as const,
          expiry: '1Y',
          notional: 1000,
        },
      };

    case 'RangeOption':
      return {
        id: '',
        type: 'RangeOption',
        category: 'option',
        position: basePosition,
        inputs: [createInput('underlying', 'Underlying', 'asset')],
        outputs: [createOutput('payoff', 'Payoff', 'number')],
        properties: {
          lowerBound: 3800,
          upperBound: 4200,
          payoutPerDay: 1,
          expiry: '1Y',
        },
      };

    // Logic Bricks
    case 'IfThenElse':
      return {
        id: '',
        type: 'IfThenElse',
        category: 'logic',
        position: basePosition,
        inputs: [
          createInput('condition', 'Condition', 'boolean'),
          createInput('then', 'Then', 'any'),
          createInput('else', 'Else', 'any'),
        ],
        outputs: [createOutput('result', 'Result', 'any')],
        properties: {
          condition: 'price > strike',
        },
      };

    case 'BarrierTrigger':
      return {
        id: '',
        type: 'BarrierTrigger',
        category: 'logic',
        position: basePosition,
        inputs: [createInput('price', 'Price', 'number')],
        outputs: [createOutput('triggered', 'Triggered', 'boolean')],
        properties: {
          barrierLevel: 4000,
          triggerType: 'above' as const,
          continuous: true,
        },
      };

    case 'AutocallTrigger':
      return {
        id: '',
        type: 'AutocallTrigger',
        category: 'logic',
        position: basePosition,
        inputs: [createInput('price', 'Price', 'number')],
        outputs: [createOutput('autocall', 'Autocall', 'boolean')],
        properties: {
          autocallLevel: 4000,
          observationDates: ['3M', '6M', '9M', '1Y'],
          callable: true,
        },
      };

    case 'KnockInCheck':
      return {
        id: '',
        type: 'KnockInCheck',
        category: 'logic',
        position: basePosition,
        inputs: [createInput('trigger', 'Trigger', 'boolean')],
        outputs: [createOutput('knockedIn', 'Knocked In', 'boolean')],
        properties: {
          knockInLevel: 3200,
          activated: false,
        },
      };

    case 'MemoryBuffer':
      return {
        id: '',
        type: 'MemoryBuffer',
        category: 'logic',
        position: basePosition,
        inputs: [createInput('coupon', 'Coupon', 'number')],
        outputs: [createOutput('buffered', 'Buffered', 'number')],
        properties: {
          storedCoupons: [],
          maxBuffer: 10,
        },
      };

    case 'HighWatermarkTracker':
      return {
        id: '',
        type: 'HighWatermarkTracker',
        category: 'logic',
        position: basePosition,
        inputs: [createInput('value', 'Value', 'number')],
        outputs: [createOutput('watermark', 'Watermark', 'number')],
        properties: {
          trackingType: 'maximum' as const,
          currentValue: 0,
        },
      };

    case 'TargetTracker':
      return {
        id: '',
        type: 'TargetTracker',
        category: 'logic',
        position: basePosition,
        inputs: [createInput('value', 'Value', 'number')],
        outputs: [createOutput('targetMet', 'Target Met', 'boolean')],
        properties: {
          targetAmount: 1000,
          currentAccumulated: 0,
          resetOnTarget: true,
        },
      };

    case 'Observation':
      return {
        id: '',
        type: 'Observation',
        category: 'logic',
        position: basePosition,
        inputs: [createInput('price', 'Price', 'number')],
        outputs: [createOutput('result', 'Result', 'boolean')],
        properties: {
          observationDates: ['3M', '6M', '9M', '1Y'],
          condition: 'price >= initial',
          result: false,
        },
      };

    // Flow Bricks  
    case 'CouponSchedule':
      return {
        id: '',
        type: 'CouponSchedule',
        category: 'flow',
        position: basePosition,
        inputs: [],
        outputs: [createOutput('schedule', 'Schedule', 'any')],
        properties: {
          paymentDates: ['3M', '6M', '9M', '1Y'],
          observationDates: ['3M', '6M', '9M', '1Y'],
          frequency: 'quarterly' as const,
        },
      };

    case 'CouponLogic':
      return {
        id: '',
        type: 'CouponLogic',
        category: 'flow',
        position: basePosition,
        inputs: [
          createInput('condition', 'Condition', 'boolean'),
          createInput('schedule', 'Schedule', 'any'),
        ],
        outputs: [createOutput('coupon', 'Coupon', 'number')],
        properties: {
          couponRate: 0.08,
          conditional: true,
          condition: 'price >= barrier',
          memory: false,
        },
      };

    case 'FinalPayout':
      return {
        id: '',
        type: 'FinalPayout',
        category: 'flow',
        position: basePosition,
        inputs: [
          createInput('finalPrice', 'Final Price', 'number'),
          createInput('knockedIn', 'Knocked In', 'boolean'),
        ],
        outputs: [createOutput('payout', 'Payout', 'number')],
        properties: {
          protectionLevel: 0.7,
          participationRate: 1.0,
          cap: 1.2,
        },
      };

    case 'AutocallHandler':
      return {
        id: '',
        type: 'AutocallHandler',
        category: 'flow',
        position: basePosition,
        inputs: [createInput('autocallTrigger', 'Autocall Trigger', 'boolean')],
        outputs: [createOutput('payout', 'Payout', 'number')],
        properties: {
          autocallAmount: 1000,
          couponPayment: 80,
          callCondition: 'price >= initial',
        },
      };

    case 'CouponAccumulator':
      return {
        id: '',
        type: 'CouponAccumulator',
        category: 'flow',
        position: basePosition,
        inputs: [createInput('condition', 'Condition', 'boolean')],
        outputs: [createOutput('accumulated', 'Accumulated', 'number')],
        properties: {
          dailyRate: 0.02,
          condition: 'in range',
          resetFrequency: 'quarterly' as const,
        },
      };

    // Math Bricks
    case 'Sum':
      return {
        id: '',
        type: 'Sum',
        category: 'math',
        position: basePosition,
        inputs: [
          createInput('input1', 'Input 1', 'number'),
          createInput('input2', 'Input 2', 'number'),
        ],
        outputs: [createOutput('sum', 'Sum', 'number')],
        properties: {
          inputCount: 2,
        },
      };

    case 'Multiplier':
      return {
        id: '',
        type: 'Multiplier',
        category: 'math',
        position: basePosition,
        inputs: [createInput('input', 'Input', 'number')],
        outputs: [createOutput('output', 'Output', 'number')],
        properties: {
          factor: 1.0,
        },
      };

    case 'Compare':
      return {
        id: '',
        type: 'Compare',
        category: 'math',
        position: basePosition,
        inputs: [createInput('value', 'Value', 'number')],
        outputs: [createOutput('result', 'Result', 'boolean')],
        properties: {
          operator: 'GT' as const,
          threshold: 0,
        },
      };

    case 'Selector':
      return {
        id: '',
        type: 'Selector',
        category: 'math',
        position: basePosition,
        inputs: [
          createInput('asset1', 'Asset 1', 'number'),
          createInput('asset2', 'Asset 2', 'number'),
        ],
        outputs: [createOutput('selected', 'Selected', 'number')],
        properties: {
          selectionType: 'best' as const,
          assetCount: 2,
        },
      };

    case 'Timer':
      return {
        id: '',
        type: 'Timer',
        category: 'math',
        position: basePosition,
        inputs: [createInput('startTrigger', 'Start', 'boolean')],
        outputs: [createOutput('elapsed', 'Elapsed', 'number')],
        properties: {
          startEvent: 'barrier hit',
          elapsedTime: 0,
          units: 'days' as const,
        },
      };

    default:
      return null;
  }
};