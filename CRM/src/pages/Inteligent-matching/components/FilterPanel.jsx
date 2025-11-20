import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ filters, onFiltersChange, onClearFilters, isOpen, onToggle }) => {
  const similarityOptions = [
    { value: '0', label: 'All Matches (0%+)' },
    { value: '60', label: 'Good Matches (60%+)' },
    { value: '75', label: 'Great Matches (75%+)' },
    { value: '90', label: 'Excellent Matches (90%+)' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'India', label: 'India' },
    { value: 'China', label: 'China' },
    { value: 'USA', label: 'United States' },
    { value: 'Germany', label: 'Germany' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Switzerland', label: 'Switzerland' }
  ];

  const leadTimeOptions = [
    { value: '', label: 'Any Lead Time' },
    { value: '7', label: 'Within 1 week' },
    { value: '14', label: 'Within 2 weeks' },
    { value: '30', label: 'Within 1 month' },
    { value: '60', label: 'Within 2 months' },
    { value: '90', label: 'Within 3 months' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== '' && value !== null && value !== undefined
  );

  if (!isOpen) {
    return (
      <div className="bg-surface border border-border rounded-lg clinical-shadow mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={20} className="text-text-secondary" />
              <h3 className="text-lg font-semibold text-foreground">Filters</h3>
              {hasActiveFilters && (
                <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  Active
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              iconName="ChevronDown"
              iconPosition="right"
            >
              Show Filters
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg clinical-shadow mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-text-secondary" />
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              iconName="ChevronUp"
              iconPosition="right"
            >
              Hide Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Similarity Score"
            options={similarityOptions}
            value={filters?.similarityThreshold || '0'}
            onChange={(value) => handleFilterChange('similarityThreshold', value)}
            placeholder="Select minimum score"
          />

          <Select
            label="Supplier Location"
            options={locationOptions}
            value={filters?.location || ''}
            onChange={(value) => handleFilterChange('location', value)}
            placeholder="Select location"
          />

          <Select
            label="Lead Time"
            options={leadTimeOptions}
            value={filters?.leadTime || ''}
            onChange={(value) => handleFilterChange('leadTime', value)}
            placeholder="Select max lead time"
          />

          <div className="space-y-4">
            <Input
              label="Max Price (USD)"
              type="number"
              placeholder="Enter max price"
              value={filters?.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e?.target?.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            label="Min MOQ"
            type="number"
            placeholder="Enter minimum MOQ"
            value={filters?.minMoq || ''}
            onChange={(e) => handleFilterChange('minMoq', e?.target?.value)}
          />

          <Input
            label="Min Available Quantity"
            type="number"
            placeholder="Enter minimum quantity"
            value={filters?.minQuantity || ''}
            onChange={(e) => handleFilterChange('minQuantity', e?.target?.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;