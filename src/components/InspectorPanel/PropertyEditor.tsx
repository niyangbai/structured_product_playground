import React from 'react';
import { useAppStore } from '../../store/appStore';
import { AnyBrick } from '../../types';
import './PropertyEditor.css';

interface PropertyEditorProps {
  brick: AnyBrick;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({ brick }) => {
  const { updateBrick } = useAppStore();

  const handlePropertyChange = (key: string, value: any) => {
    updateBrick(brick.id, {
      properties: {
        ...brick.properties,
        [key]: value,
      },
    } as any);
  };

  const renderPropertyInput = (key: string, value: any) => {
    const handleChange = (newValue: any) => {
      handlePropertyChange(key, newValue);
    };

    // Handle different types of properties
    if (typeof value === 'boolean') {
      return (
        <div className="property-input">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(e.target.checked)}
            />
            <span className="checkmark"></span>
          </label>
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div className="property-input">
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
            step="any"
          />
        </div>
      );
    }

    if (typeof value === 'string') {
      // Handle select options for specific properties
      const selectOptions = getSelectOptions(key, brick.type);
      
      if (selectOptions) {
        return (
          <div className="property-input">
            <select
              value={value}
              onChange={(e) => handleChange(e.target.value)}
            >
              {selectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div className="property-input">
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="property-input">
          <textarea
            value={value.join(', ')}
            onChange={(e) => handleChange(e.target.value.split(',').map(s => s.trim()))}
            rows={3}
            placeholder="Enter items separated by commas"
          />
        </div>
      );
    }

    return (
      <div className="property-input">
        <input
          type="text"
          value={String(value)}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="property-editor">
      {Object.entries(brick.properties).map(([key, value]) => (
        <div key={key} className="property-field">
          <label className="property-label">
            {formatPropertyName(key)}
          </label>
          {renderPropertyInput(key, value)}
        </div>
      ))}
    </div>
  );
};

const formatPropertyName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const getSelectOptions = (key: string, brickType: string) => {
  const options: Record<string, { value: string; label: string }[]> = {
    optionType: [
      { value: 'call', label: 'Call' },
      { value: 'put', label: 'Put' },
    ],
    position: [
      { value: 'long', label: 'Long' },
      { value: 'short', label: 'Short' },
    ],
    barrierType: [
      { value: 'up-and-out', label: 'Up and Out' },
      { value: 'up-and-in', label: 'Up and In' },
      { value: 'down-and-out', label: 'Down and Out' },
      { value: 'down-and-in', label: 'Down and In' },
    ],
    barrier: [
      { value: 'above', label: 'Above' },
      { value: 'below', label: 'Below' },
    ],
    lookbackType: [
      { value: 'fixed', label: 'Fixed' },
      { value: 'floating', label: 'Floating' },
    ],
    triggerType: [
      { value: 'above', label: 'Above' },
      { value: 'below', label: 'Below' },
      { value: 'touch', label: 'Touch' },
    ],
    trackingType: [
      { value: 'maximum', label: 'Maximum' },
      { value: 'minimum', label: 'Minimum' },
    ],
    frequency: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'semi-annually', label: 'Semi-Annually' },
      { value: 'annually', label: 'Annually' },
    ],
    resetFrequency: [
      { value: 'daily', label: 'Daily' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
    ],
    operator: [
      { value: 'GT', label: 'Greater Than' },
      { value: 'LT', label: 'Less Than' },
      { value: 'EQ', label: 'Equal To' },
      { value: 'GTE', label: 'Greater Than or Equal' },
      { value: 'LTE', label: 'Less Than or Equal' },
      { value: 'NEQ', label: 'Not Equal To' },
    ],
    selectionType: [
      { value: 'best', label: 'Best' },
      { value: 'worst', label: 'Worst' },
      { value: 'median', label: 'Median' },
      { value: 'random', label: 'Random' },
    ],
    units: [
      { value: 'days', label: 'Days' },
      { value: 'months', label: 'Months' },
      { value: 'years', label: 'Years' },
    ],
  };

  return options[key] || null;
};

export default PropertyEditor;