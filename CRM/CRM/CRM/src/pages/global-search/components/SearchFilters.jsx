import React from 'react';
import Select from '../../../components/ui/Select';

const SearchFilters = ({ filters, onFilterChange, isLoading }) => {
  const dosageFormOptions = [
    { value: '', label: 'All Dosage Forms' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'injection', label: 'Injection' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'cream', label: 'Cream' },
    { value: 'ointment', label: 'Ointment' },
    { value: 'drops', label: 'Drops' },
    { value: 'inhaler', label: 'Inhaler' }
  ];

  const strengthOptions = [
    { value: '', label: 'All Strengths' },
    { value: '5mg', label: '5mg' },
    { value: '10mg', label: '10mg' },
    { value: '25mg', label: '25mg' },
    { value: '50mg', label: '50mg' },
    { value: '100mg', label: '100mg' },
    { value: '250mg', label: '250mg' },
    { value: '500mg', label: '500mg' },
    { value: '1g', label: '1g' },
    { value: '2.5ml', label: '2.5ml' },
    { value: '5ml', label: '5ml' },
    { value: '10ml', label: '10ml' }
  ];

  return (
    <div className="bg-surface p-6 rounded-lg clinical-shadow mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Filter Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Dosage Form"
          options={dosageFormOptions}
          value={filters?.dosageForm}
          onChange={(value) => onFilterChange('dosageForm', value)}
          disabled={isLoading}
          placeholder="Select dosage form"
        />
        <Select
          label="Strength"
          options={strengthOptions}
          value={filters?.strength}
          onChange={(value) => onFilterChange('strength', value)}
          disabled={isLoading}
          placeholder="Select strength"
        />
      </div>
    </div>
  );
};

export default SearchFilters;