import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const DealsFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const stageOptions = [
    { value: '', label: 'All Stages' },
    { value: 'Lead', label: 'Lead' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '' && value !== null);

  return (
    <div className="bg-surface p-4 rounded-lg clinical-shadow border border-border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search deals..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
          />
        </div>

        {/* Stage Filter */}
        <Select
          placeholder="Filter by stage"
          options={stageOptions}
          value={filters?.stage || ''}
          onChange={(value) => handleFilterChange('stage', value)}
        />

        {/* Priority Filter */}
        <Select
          placeholder="Filter by priority"
          options={priorityOptions}
          value={filters?.priority || ''}
          onChange={(value) => handleFilterChange('priority', value)}
        />

        {/* Value Range */}
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Min value"
            value={filters?.minValue || ''}
            onChange={(e) => handleFilterChange('minValue', e?.target?.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Max value"
            value={filters?.maxValue || ''}
            onChange={(e) => handleFilterChange('maxValue', e?.target?.value)}
            min="0"
          />
        </div>

        {/* Date Range */}
        <div className="flex space-x-2">
          <Input
            type="date"
            value={filters?.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
            placeholder="Start date"
          />
          <Input
            type="date"
            value={filters?.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
            placeholder="End date"
          />
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {filters?.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                Search: "{filters?.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-2 hover:bg-primary-foreground hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.stage && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                Stage: {filters?.stage}
                <button
                  onClick={() => handleFilterChange('stage', '')}
                  className="ml-2 hover:bg-secondary-foreground hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.priority && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                Priority: {filters?.priority}
                <button
                  onClick={() => handleFilterChange('priority', '')}
                  className="ml-2 hover:bg-accent-foreground hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {(filters?.minValue || filters?.maxValue) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning text-warning-foreground">
                Value: ${filters?.minValue || '0'} - ${filters?.maxValue || '∞'}
                <button
                  onClick={() => {
                    handleFilterChange('minValue', '');
                    handleFilterChange('maxValue', '');
                  }}
                  className="ml-2 hover:bg-warning-foreground hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {(filters?.startDate || filters?.endDate) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success text-success-foreground">
                Date: {filters?.startDate || 'Start'} - {filters?.endDate || 'End'}
                <button
                  onClick={() => {
                    handleFilterChange('startDate', '');
                    handleFilterChange('endDate', '');
                  }}
                  className="ml-2 hover:bg-success-foreground hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsFilters;