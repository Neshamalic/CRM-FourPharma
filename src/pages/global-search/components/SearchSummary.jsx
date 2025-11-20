import React from 'react';
import Icon from '../../../components/AppIcon';

const SearchSummary = ({ totalResults, searchQuery, filters, isLoading }) => {
  const activeFilters = [];
  
  if (filters?.dosageForm) {
    activeFilters?.push(`Dosage: ${filters?.dosageForm}`);
  }
  if (filters?.strength) {
    activeFilters?.push(`Strength: ${filters?.strength}`);
  }

  if (isLoading) {
    return (
      <div className="bg-surface p-4 rounded-lg clinical-shadow mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Loader2" size={16} className="text-primary animate-spin" />
          <span className="text-text-secondary">Searching products...</span>
        </div>
      </div>
    );
  }

  if (!searchQuery && activeFilters?.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface p-4 rounded-lg clinical-shadow mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Icon name="Search" size={16} className="text-primary" />
          <span className="font-medium text-foreground">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </span>
          {searchQuery && (
            <span className="text-text-secondary">
              for "{searchQuery}"
            </span>
          )}
        </div>
        
        {activeFilters?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Filters:</span>
            <div className="flex flex-wrap gap-2">
              {activeFilters?.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-primary bg-opacity-10 text-primary text-sm"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSummary;